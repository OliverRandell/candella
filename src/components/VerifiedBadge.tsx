import { BadgeCheck } from 'lucide-react'

type VerifiedBadgeProps = {
  /**
   * Visual variant.
   * - `full` shows the icon + "Verified" label (use on profile pages)
   * - `compact` shows icon only (use on cards / map pin overlays)
   */
  variant?: 'full' | 'compact'
  className?: string
}

/**
 * Visual marker shown on claimed business listings.
 *
 * Important note on language: "Verified" here means the listing has been
 * claimed by the business owner and is actively managed by them. It is NOT
 * a verification of sustainability claims — that distinction is made
 * deliberately on the /about page and should be respected wherever this
 * badge appears in surrounding copy.
 */
export default function VerifiedBadge({
  variant = 'full',
  className = '',
}: VerifiedBadgeProps) {
  if (variant === 'compact') {
    return (
      <span
        title="Owner-managed listing"
        aria-label="Owner-managed listing"
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ${className}`}
      >
        <BadgeCheck className="h-3.5 w-3.5" />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 ${className}`}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  )
}
