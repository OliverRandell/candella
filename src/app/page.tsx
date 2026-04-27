import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, CATEGORY_NAMES } from '@/lib/categories'

/**
 * Top suburbs by listing count. Fetched server-side so the homepage stays
 * static-friendly. Falls back to an empty list on error — the section will
 * just not render its tiles, rather than crashing.
 */
async function getTopSuburbs(limit = 8): Promise<{ name: string; count: number }[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('businesses')
      .select('suburb')

    if (error || !data) return []

    const counts = new Map<string, number>()
    for (const row of data) {
      if (!row.suburb) continue
      counts.set(row.suburb, (counts.get(row.suburb) ?? 0) + 1)
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const topSuburbs = await getTopSuburbs(8)

  return (
    <main className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-stone-900">candella</span>
        <Link
          href="/businesses"
          className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          Browse all
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <div className="inline-block text-xs font-medium tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-6 uppercase">
          Melbourne
        </div>
        <h1 className="text-4xl font-semibold text-stone-900 leading-tight mb-4">
          Discover businesses that give a damn
        </h1>
        <p className="text-lg text-stone-500 mb-10 leading-relaxed">
          Candella is a curated directory of sustainable, ethical, and
          planet-friendly businesses across Melbourne.
        </p>
        <Link
          href="/businesses"
          className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Browse listings
        </Link>
      </section>

      {/* Categories — links into the browse page with the filter pre-applied */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORY_NAMES.map((name) => {
            const cat = CATEGORIES[name]
            return (
              <Link
                key={name}
                href={`/businesses?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-3 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                <Image
                  src={cat.iconPath}
                  alt=""
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="truncate">{name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Suburbs — top by listing count, pulled from the database */}
      {topSuburbs.length > 0 && (
        <section className="px-6 py-12 max-w-3xl mx-auto">
          <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
            Most listed suburbs
          </h2>
          <div className="flex flex-wrap gap-2">
            {topSuburbs.map(({ name, count }) => (
              <Link
                key={name}
                href={`/businesses?suburb=${encodeURIComponent(name)}`}
                className="border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-600 hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                <span>{name}</span>
                <span className="text-stone-400 ml-1.5">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center border-t border-stone-100 mt-8">
        <p className="text-stone-500 text-sm mb-3">Own a sustainable business in Melbourne?</p>
        <Link
          href="/claim"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          List your business for free →
        </Link>
      </section>

    </main>
  )
}
