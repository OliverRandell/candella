const https = require('https')
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

function geocode(address) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(address)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_API_KEY}`

    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.status === 'OK' && json.results.length > 0) {
						const { lat, lng } = json.results[0].geometry.location
						resolve({ lat, lng })
						} else {
						console.log('Google response:', json.status, json.error_message ?? '')
						resolve(null)
					}
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run() {
  // Fetch all businesses missing coordinates
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, address, suburb')
    .is('lat', null)

  if (error) {
    console.error('Failed to fetch businesses:', error.message)
    return
  }

  console.log(`Found ${businesses.length} businesses to geocode`)

  let success = 0
  let failed = 0

  for (const business of businesses) {
    const fullAddress = `${business.address}, ${business.suburb} VIC, Australia`
    process.stdout.write(`Geocoding: ${business.name}... `)

    try {
      const coords = await geocode(fullAddress)

      if (coords) {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ lat: coords.lat, lng: coords.lng })
          .eq('id', business.id)

        if (updateError) {
          console.log(`DB error: ${updateError.message}`)
          failed++
        } else {
          console.log(`${coords.lat}, ${coords.lng}`)
          success++
        }
      } else {
        console.log('No result')
        failed++
      }
    } catch (e) {
      console.log(`Error: ${e.message}`)
      failed++
    }

    // Respect Google's rate limit
    await sleep(200)
  }

  console.log(`\nDone. ${success} geocoded, ${failed} failed.`)
}

run().catch(console.error)