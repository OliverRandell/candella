import Link from 'next/link'

/**
 * Single source of truth for the site's top navigation.
 *
 * Used on every page. When the rebrand happens, only this file's
 * 'candella' wordmark needs to change \u2014 the rest of the codebase
 * inherits the change automatically.
 *
 * Optional `current` prop hides the matching link to avoid a self-link
 * (e.g. don't show "Browse all" when already on the browse page).
 */

type NavCurrent = 'home' | 'browse' | 'about' | 'other'

type Props = {
  current?: NavCurrent
  /**
   * Render style. 'default' for normal page nav with a bottom border.
   * 'minimal' for cases where the nav sits inside a layout that already
   * has its own top chrome (rare \u2014 default is right for almost everything).
   */
  variant?: 'default' | 'minimal'
}

export default function Nav({ current = 'other', variant = 'default' }: Props) {
  const wrapperClasses =
    variant === 'default'
      ? 'border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0'
      : 'px-6 py-4 flex items-center justify-between'

  return (
    <nav className={wrapperClasses}>
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-stone-900"
        aria-label="Candella home"
      >
        candella
      </Link>
      <div className="flex items-center gap-6">
        {current !== 'about' && (
          <Link
            href="/about"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            About
          </Link>
        )}
        {current !== 'browse' && (
          <Link
            href="/businesses"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            Browse all
          </Link>
        )}
      </div>
    </nav>
  )
}
