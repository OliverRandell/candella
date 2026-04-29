'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Global error boundary. Renders when an uncaught error is thrown anywhere
 * in the app shell. Must be a Client Component (Next.js requirement) and
 * accepts a `reset` function to allow the user to retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production this is where you'd send to Sentry / Logtail / etc.
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-stone-100 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
            Something went wrong
          </p>
          <h1 className="text-3xl font-semibold text-stone-900 mb-3">
            We hit an unexpected error.
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            Try again \u2014 it\u2019s often a one-off. If it keeps happening, the
            directory is the most reliable place to start.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/businesses"
              className="text-sm text-stone-500 hover:text-stone-900 hover:underline"
            >
              Browse the directory
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
