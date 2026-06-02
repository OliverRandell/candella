import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Business } from '@/lib/types'
import {
  getCategoryColor,
  getCategoryGradient,
  getCategoryIconPath,
} from '@/lib/categories'
import { getRelatedBusinesses } from '@/lib/related-businesses'
import BusinessLocationMap from '@/components/listings/BusinessLocationMap'
import VerifiedBadge from '@/components/VerifiedBadge'
import UnclaimedBanner from '@/components/UnclaimedBanner'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, suburb, category')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (!business) return {}

  const title = `${business.name} \u2014 Candella`
  const description = business.description?.slice(0, 155) ??
    `${business.name} is a sustainable ${business.category.toLowerCase()} business in ${business.suburb}, Melbourne.`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/businesses/${slug}`
  const color = getCategoryColor(business.category)

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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { ref } = await searchParams
  const supabase = await createClient()

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single<Business>()

  if (!business || error) notFound()

  const isClaimed = !!business.claimed_by
  const iconPath = getCategoryIconPath(business.category)
  const gradient = getCategoryGradient(business.category)
  const hasCoordinates = !!(business.lat && business.lng)

  // Show the unclaimed banner only when the visitor arrived from outreach
  // (?ref=<slug> in the URL). Regular browsing traffic still sees the soft
  // bottom-of-page CTA, which is enough for them.
  const showUnclaimedBanner = !isClaimed && !!ref

  const credentials = (business.criteria ?? []).filter(Boolean)
  const hasCredentials = credentials.length > 0

  const relatedBusinesses = await getRelatedBusinesses(
    { id: business.id, suburb: business.suburb },
    3
  )

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

      {/* Hero photo / placeholder */}
      <div className="max-w-3xl mx-auto px-0 sm:px-6 pt-0 sm:pt-8">
        <div
          className="w-full aspect-[16/9] sm:rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: gradient }}
        >
          {iconPath && (
            <div className="opacity-50">
              <Image src={iconPath} alt="" width={80} height={80} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Outreach banner — only when ?ref= is present and listing is unclaimed */}
        {showUnclaimedBanner && (
          <UnclaimedBanner
            businessName={business.name}
            businessSlug={business.slug}
          />
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-3 mb-2">
            {iconPath && (
              <Image
                src={iconPath}
                alt=""
                width={32}
                height={32}
                className="flex-shrink-0 mt-1.5"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-semibold text-stone-900 leading-tight">
                  {business.name}
                </h1>
                {business.is_verified && <VerifiedBadge />}
              </div>
              <p className="text-stone-400 text-sm mt-1">
                {business.suburb} \u00b7 {business.category}
              </p>
            </div>
          </div>
        </header>

        {/* Description */}
        {business.description && (
          <section className="mb-10">
            <p className="text-stone-700 text-base leading-relaxed">
              {business.description}
            </p>
          </section>
        )}

        {/* What makes this place sustainable */}
        <section className="mb-10">
          <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
            What makes this place sustainable
          </h2>
          {hasCredentials ? (
            <div className="flex flex-wrap gap-2">
              {credentials.map((credential: string) => (
                <span
                  key={credential}
                  className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1.5 rounded-full"
                >
                  {credential}
                </span>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-stone-200 rounded-xl px-5 py-4">
              <p className="text-sm text-stone-500">
                {isClaimed ? (
                  <>
                    Sustainability credentials are being added. Read about{' '}
                    <Link href="/about" className="text-emerald-700 hover:underline font-medium">
                      Candella's standard
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Sustainability credentials haven't been added yet.{' '}
                    <Link
                      href={`/claim?business=${business.slug}`}
                      className="text-emerald-700 hover:underline font-medium"
                    >
                      Claim this listing
                    </Link>{' '}
                    to add them, or read about{' '}
                    <Link href="/about" className="text-emerald-700 hover:underline font-medium">
                      Candella's standard
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          )}
        </section>

        {/* Practical info */}
        <section className="mb-10">
          <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
            Practical info
          </h2>
          <div className="border border-stone-100 rounded-xl divide-y divide-stone-100">
            {business.address && (
              <InfoRow label="Address">
                <p className="text-sm text-stone-700">{business.address}</p>
                {hasCoordinates && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 hover:underline mt-1 inline-block"
                  >
                    Get directions \u2192
                  </a>
                )}
              </InfoRow>
            )}
            {business.website_url && (
              <InfoRow label="Website">
                <a
                  href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 hover:underline break-all"
                >
                  {business.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </InfoRow>
            )}
            {business.instagram_url && (
              <InfoRow label="Instagram">
                <a
                  href={business.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 hover:underline"
                >
                  {extractInstagramHandle(business.instagram_url)}
                </a>
              </InfoRow>
            )}
            <InfoRow label="Opening hours">
              <p className="text-sm text-stone-500 italic">
                {isClaimed ? (
                  'Opening hours are being added.'
                ) : (
                  <>
                    Not yet listed.{' '}
                    <Link
                      href={`/claim?business=${business.slug}`}
                      className="text-emerald-700 hover:underline not-italic font-medium"
                    >
                      Claim this listing
                    </Link>{' '}
                    to add them.
                  </>
                )}
              </p>
            </InfoRow>
            {business.suburb && (
              <InfoRow label="Area">
                <Link
                  href={`/suburb/${business.suburb.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-emerald-700 hover:underline"
                >
                  More sustainable businesses in {business.suburb} \u2192
                </Link>
              </InfoRow>
            )}
          </div>
        </section>

        {/* Location map */}
        {hasCoordinates && (
          <section className="mb-10">
            <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
              Location
            </h2>
            <BusinessLocationMap business={business} />
          </section>
        )}

        {/* Related businesses */}
        {relatedBusinesses.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
              More in {business.suburb}
            </h2>
            <div className="divide-y divide-stone-100 border-y border-stone-100">
              {relatedBusinesses.map((related) => (
                <RelatedBusinessRow key={related.id} business={related} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom: claim CTA or owner-managed indicator */}
        {!isClaimed ? (
          <section className="border border-stone-100 rounded-xl px-6 py-6 text-center bg-stone-50/50">
            <p className="text-sm font-medium text-stone-900 mb-1">
              Is this your business?
            </p>
            <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto leading-relaxed">
              Claim this listing to add photos, opening hours, your sustainability credentials, and the verified badge.
            </p>
            <Link
              href={`/claim?business=${business.slug}`}
              className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Claim this listing
            </Link>
          </section>
        ) : (
          <section className="text-center">
            <p className="text-xs text-stone-400">
              This listing is managed by its owner.
            </p>
          </section>
        )}

      </div>
    </main>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <span className="text-stone-300 text-sm mt-0.5 flex-shrink-0">\u2192</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  )
}

function RelatedBusinessRow({ business }: { business: Business }) {
  const iconPath = getCategoryIconPath(business.category)
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="flex items-center gap-3 py-3 group"
    >
      {iconPath ? (
        <Image
          src={iconPath}
          alt=""
          width={32}
          height={32}
          className="flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-stone-100 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors truncate">
            {business.name}
          </span>
          {business.is_verified && <VerifiedBadge variant="compact" />}
        </div>
        <p className="text-xs text-stone-400 truncate">
          {business.category}
        </p>
      </div>
      <span className="text-stone-300 group-hover:text-emerald-500 transition-colors flex-shrink-0">\u2192</span>
    </Link>
  )
}

function extractInstagramHandle(url: string): string {
  try {
    const u = new URL(url)
    const handle = u.pathname.replace(/^\/+|\/+$/g, '').split('/')[0]
    return handle ? `@${handle}` : url.replace(/^https?:\/\//, '')
  } catch {
    return url.replace(/^https?:\/\//, '')
  }
}
