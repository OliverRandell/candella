import Link from 'next/link'

export const metadata = {
  title: 'Page not found \u2014 Candella',
}

export default function NotFound() {
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
            404
          </p>
          <h1 className="text-3xl font-semibold text-stone-900 mb-3">
            We couldn\u2019t find that page.
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            It may have moved, or the link might be wrong. Try the directory \u2014
            it\u2019s where most things live.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/businesses"
              className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Browse the directory
            </Link>
            <Link
              href="/"
              className="text-sm text-stone-500 hover:text-stone-900 hover:underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
