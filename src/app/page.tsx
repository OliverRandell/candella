import Link from 'next/link'

const CATEGORIES = [
  { label: 'Cafes & coffee', slug: 'cafes-coffee' },
  { label: 'Grocers & food', slug: 'grocers-food' },
  { label: 'Fashion & clothing', slug: 'fashion-clothing' },
  { label: 'Homewares & living', slug: 'homewares-living' },
  { label: 'Health & wellness', slug: 'health-wellness' },
  { label: 'Beauty & personal care', slug: 'beauty-personal-care' },
]

const SUBURBS = [
  'Fitzroy', 'Collingwood', 'Brunswick', 'Northcote',
  'Richmond', 'South Yarra', 'Prahran', 'St Kilda',
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-stone-900">candella</span>
        <Link
          href="/businesses"
          className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          Browse all
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <div className="inline-block text-xs font-medium tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-6 uppercase">
          Melbourne
        </div>
        <h1 className="text-4xl font-semibold text-stone-900 leading-tight mb-4">
          Discover businesses that give a damn
        </h1>
        <p className="text-lg text-stone-500 mb-10 leading-relaxed">
          Candella is a curated directory of sustainable, ethical, and
          planet-friendly businesses across Melbourne.
        </p>
        <Link
          href="/businesses"
          className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Browse listings
        </Link>
      </section>

      {/* Categories */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Suburbs */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h2 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
          Browse by suburb
        </h2>
        <div className="flex flex-wrap gap-2">
          {SUBURBS.map((suburb) => (
            <Link
              key={suburb}
              href={`/suburb/${suburb.toLowerCase()}`}
              className="border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
            >
              {suburb}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center border-t border-stone-100 mt-8">
        <p className="text-stone-500 text-sm mb-3">Own a sustainable business in Melbourne?</p>
        <Link
          href="/claim"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          List your business for free →
        </Link>
      </section>

    </main>
  )
}