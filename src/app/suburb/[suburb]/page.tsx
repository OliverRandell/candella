import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Business } from '@/lib/types'

type Props = {
  params: Promise<{ suburb: string }>
}

export async function generateMetadata({ params }: Props) {
  const { suburb } = await params
  const name = suburb.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `Sustainable businesses in ${name} — Candella`,
    description: `Discover sustainable, ethical and planet-friendly businesses in ${name}, Melbourne.`,
  }
}

export default async function SuburbPage({ params }: Props) {
  const { suburb } = await params
  const suburbName = suburb.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const supabase = await createClient()
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .ilike('suburb', suburbName)
    .order('is_featured', { ascending: false })
    .order('name')

  if (!businesses) notFound()

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-stone-300">/</span>
        <Link href="/businesses" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          Browse
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-500">{suburbName}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Sustainable businesses in {suburbName}
        </h1>
        <p className="text-stone-500 text-sm mb-10">
          {businesses.length} listing{businesses.length !== 1 ? 's' : ''} in {suburbName}
        </p>

        {businesses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm mb-4">No listings in {suburbName} yet.</p>
            <Link href="/businesses" className="text-sm text-emerald-600 hover:underline">
              Browse all listings
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {businesses.map((business: Business) => (
              <Link
                key={business.id}
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
                    </div>
                    <p className="text-xs text-stone-400 mb-2">{business.category}</p>
                    {business.description && (
                      <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                        {business.description}
                      </p>
                    )}
                  </div>
                  <span className="text-stone-300 group-hover:text-emerald-500 transition-colors flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}