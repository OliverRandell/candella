import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Business } from '@/lib/types'

export const metadata = {
  title: 'Sustainable businesses in Melbourne — Candella',
  description: 'Browse Melbourne\'s most trusted directory of sustainable, ethical and planet-friendly businesses.',
}

export default async function BusinessesPage() {
  const supabase = await createClient()

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('name')

  if (error) console.error(error)

  return (
    <main className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-sm text-stone-400">Melbourne</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">

        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Sustainable businesses
        </h1>
        <p className="text-stone-500 text-sm mb-10">
          {businesses?.length ?? 0} listings across Melbourne
        </p>

        {/* Listings */}
        {!businesses || businesses.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            No listings yet — check back soon.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {businesses.map((business: Business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="block py-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors">
              {business.name}
            </span>
            {business.is_verified && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
            {business.is_featured && (
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mb-2">
            {business.suburb} · {business.category}
          </p>
          {business.description && (
            <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          )}
          {business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {business.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-stone-300 group-hover:text-emerald-500 transition-colors text-lg flex-shrink-0">
          →
        </span>
      </div>
    </Link>
  )
}