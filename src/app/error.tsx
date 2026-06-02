'use client'

import Link from 'next/link'
import Nav from '@/components/Nav'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-white">
      <Nav current="other" />
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
          Something went wrong
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 mb-4">
          That didn&rsquo;t work.
        </h1>
        <p className="text-stone-500 leading-relaxed mb-10">
          Something went wrong on our end. You can try again, or head back
          to the directory.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/businesses"
            className="inline-block border border-stone-200 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-full hover:border-stone-400 hover:bg-stone-50 transition-colors"
          >
            Browse the directory
          </Link>
        </div>
      </div>
    </main>
  )
}
