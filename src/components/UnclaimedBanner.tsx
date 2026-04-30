import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type UnclaimedBannerProps = {
  businessName: string
  businessSlug: string
}

/**
 * Banner shown at the top of business profile pages when the listing has
 * not been claimed AND the visitor arrived via outreach (?ref= present).
 *
 * The conditional rendering — including the ?ref= check — is done in the
 * parent component, not here. This component is purely presentational.
 *
 * The link forwards the ref param to /for-businesses so click-throughs can
 * be attributed to the originating profile.
 */
export default function UnclaimedBanner({
  businessName,
  businessSlug,
}: UnclaimedBannerProps) {
  return (
    <aside className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 md:flex md:items-center md:justify-between md:gap-6">
      <div className="mb-4 md:mb-0">
        <h2 className="text-base font-semibold text-stone-900">
          Is this your business?
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">
          Claim your listing to edit your profile, add photos, and mark it as
          owner-managed. Free, takes a few minutes.
        </p>
      </div>
      <Link
        href={`/for-businesses?ref=${encodeURIComponent(businessSlug)}`}
        className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
      >
        Claim {businessName}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  )
}
