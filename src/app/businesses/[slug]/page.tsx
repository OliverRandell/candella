import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Business } from '@/lib/types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, suburb, category')
    .eq('slug', slug)
    .single()

  if (!business) return {}

  const title = `${business.name} — Candella`
  const description = business.description?.slice(0, 155) ??
    `${business.name} is a sustainable ${business.category.toLowerCase()} business in ${business.suburb}, Melbourne.`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/businesses/${slug}`

  const categoryColors: Record<string, string> = {
    'Cafes & Restaurants': '#A1EDCA',
    'Fashion': '#EDB1A1',
    'Groceries': '#EDA1B7',
    'Home & Living': '#D1A1ED',
    'Alcohol': '#A1D0ED',
    'Markets': '#DDEDA1',
  }
  const color = categoryColors[business.category] ?? '#A1EDCA'

  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/og?name=${encodeURIComponent(business.name)}&suburb=${encodeURIComponent(business.suburb)}&category=${encodeURIComponent(business.category)}&color=${encodeURIComponent(color)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Candella',
      locale: 'en_AU',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!business || error) notFound()

  return (
    <main className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-stone-300">/</span>
        <Link href="/businesses" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          Browse
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-500 truncate">{business.name}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {business.is_verified && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">
                Verified
              </span>
            )}
            {business.is_featured && (
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">
            {business.name}
          </h1>
          <p className="text-stone-400 text-sm">
            {business.suburb} · {business.category}
          </p>
        </div>

        {/* Description */}
        {business.description && (
          <div className="mb-8">
            <p className="text-stone-600 leading-relaxed">
              {business.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {business.tags?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
              Sustainability signals
            </h2>
            <div className="flex flex-wrap gap-2">
              {business.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="mb-8 border border-stone-100 rounded-xl divide-y divide-stone-100">
          {business.address && (
            <div className="px-4 py-3 flex items-start gap-3">
              <span className="text-stone-300 text-sm mt-0.5">→</span>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Address</p>
                <p className="text-sm text-stone-700">{business.address}</p>
              </div>
            </div>
          )}
          {business.website_url && (
            <div className="px-4 py-3 flex items-start gap-3">
              <span className="text-stone-300 text-sm mt-0.5">→</span>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Website</p>
                
                  <a href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:underline break-all"
                >
                  {business.website_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          {business.suburb && (
            <div className="px-4 py-3 flex items-start gap-3">
              <span className="text-stone-300 text-sm mt-0.5">→</span>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Suburb</p>
                <Link
                  href={`/suburb/${business.suburb.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  More in {business.suburb}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Claim CTA */}
        {!business.claimed_by && (
          <div className="border border-stone-100 rounded-xl px-6 py-5 text-center">
            <p className="text-sm text-stone-500 mb-1">Is this your business?</p>
            <p className="text-xs text-stone-400 mb-4">
              Claim this listing to update your details and add your sustainability credentials.
            </p>
            <Link
              href={`/claim?business=${business.slug}`}
              className="inline-block bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Claim this listing
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}