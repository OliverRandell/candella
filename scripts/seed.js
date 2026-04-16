const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseLocation(location) {
  const cleaned = location.replace(', Australia', '').trim()
  const parts = cleaned.split(',').map(s => s.trim())
  if (parts.length >= 2) {
    const address = parts[0]
    const suburbPart = parts[1]
    const tokens = suburbPart.split(' ')
    const postcode = tokens[tokens.length - 1] ?? ''
    const state = tokens[tokens.length - 2] ?? 'VIC'
    const suburb = tokens.slice(0, -2).join(' ')
    return { address, suburb, state, postcode }
  }
  return { address: location, suburb: '', state: 'VIC', postcode: '' }
}

function normaliseCategory(raw) {
  const map = {
    'cafes & restaurants': 'Cafes & Restaurants',
    'cafes':               'Cafes & Restaurants',
    'fashion':             'Fashion',
    'groceries':           'Groceries',
    'home & living':       'Home & Living',
    'alcohol':             'Alcohol',
    'markets':             'Markets',
  }
  return map[(raw || '').toLowerCase().trim()] ?? (raw || '').trim()
}

function tagsFromCategory(category) {
  const map = {
    'Cafes & Restaurants': ['sustainable-dining', 'local'],
    'Fashion':             ['sustainable-fashion', 'ethical'],
    'Groceries':           ['zero-waste', 'organic', 'local'],
    'Home & Living':       ['sustainable-living', 'local'],
    'Alcohol':             ['local', 'organic'],
    'Markets':             ['local', 'zero-waste'],
  }
  return map[category] ?? ['sustainable', 'local']
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8')
  const lines = content.split('\n').filter(Boolean)
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim() })
    return row
  }).filter(row => row['Name'])
}

async function seed() {
  console.log('Reading Adalo export...')
  const csvPath = path.join(process.cwd(), 'data', 'Businesses.csv')
  console.log('Looking for CSV at:', csvPath)

  const rows = parseCSV(csvPath)
  console.log(`Found ${rows.length} businesses`)

  const usedSlugs = new Set()

  const businesses = rows.map(row => {
    const name = row['Name']
    const category = normaliseCategory(row['Category'] || row['Categories'])
    const location = parseLocation(row['Location'] ?? '')
    const description = row['Description'] ?? null
    const website = row['Website'] ?? null

    let slug = slugify(name)
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${slugify(location.suburb)}`
    }
    usedSlugs.add(slug)

    return {
      name,
      slug,
      suburb:      location.suburb,
      city:        'Melbourne',
      state:       location.state || 'VIC',
      address:     location.address,
      category,
      description,
      tags:        tagsFromCategory(category),
      website_url: website || null,
      is_verified: false,
      is_featured: false,
    }
  }).filter(b => b.name && b.suburb)

  console.log(`Seeding ${businesses.length} businesses...`)

  const batchSize = 50
  let inserted = 0

  for (let i = 0; i < businesses.length; i += batchSize) {
    const batch = businesses.slice(i, i + batchSize)
    const { error } = await supabase
      .from('businesses')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.error(`Batch error:`, error.message)
    } else {
      inserted += batch.length
      console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1} (${inserted} total)`)
    }
  }

  console.log(`Done. ${inserted} businesses seeded.`)
}

seed().catch(console.error)