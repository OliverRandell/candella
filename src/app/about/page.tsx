import { CRITERIA } from '@/lib/criteria'
import Link from 'next/link'
import Nav from '@/components/Nav'

export const metadata = {
  title: 'About — Candella',
  description:
    'A small Melbourne project building the directory we wished existed: a careful, honest guide to the businesses doing sustainability in ways worth knowing about.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      <Nav current="about" />

      <article className="max-w-2xl mx-auto px-6 py-16">

        {/* Hero */}
        <header className="mb-12">
          <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-4">
            About Candella
          </p>
          <h1 className="text-4xl font-semibold text-stone-900 leading-tight mb-4">
            What we mean when we say sustainable.
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            A small Melbourne project building the directory we wished existed:
            a careful, honest guide to the businesses doing sustainability in
            ways worth knowing about.
          </p>
        </header>

        {/* What we mean */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            What sustainable means here
          </h2>
          <div className="text-stone-700 leading-relaxed space-y-4">
            <p>
              Sustainable is a word that&rsquo;s been worked over so much it can
              mean almost anything. A cafe with a compostable cup might call
              itself sustainable. So might a fashion brand making 200
              collections a year in unnamed factories. The word does heavy
              lifting on packaging and very little lifting in reality.
            </p>
            <p>
              So we&rsquo;ve tried to be specific about what we mean. The
              businesses on Candella meet at least one of the criteria
              we&rsquo;ve published openly. Things like locally made, fair
              labour, organic sourcing, plastic-free, secondhand-first, or
              carbon-aware. None of them are perfect. We&rsquo;re not interested
              in perfect. We&rsquo;re interested in businesses making genuine,
              traceable choices that add up to something better than the
              default. You&rsquo;ll see the criteria each business meets on
              their listing, and you can browse by them if you&rsquo;re shopping
              for a specific kind of better.
            </p>
            <p>
              What you won&rsquo;t find here are vague claims. We don&rsquo;t
              list businesses just because they say they&rsquo;re sustainable.
              We list them because something specific is true about how they
              operate and we&rsquo;ll tell you what.
            </p>
          </div>
        </section>

        {/* Criteria glossary */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-stone-900 mb-8">
            The criteria we look for
          </h2>
          <dl className="space-y-8">
            {CRITERIA.map(c => (
              <div key={c.slug}>
                <dt className="text-base font-semibold text-stone-900 mb-2">
                  {c.name}
                </dt>
                <dd className="text-sm text-stone-700 leading-relaxed">
                  {c.definition}
                  {c.framing && (
                    <span className="block text-stone-500 mt-2 italic">
                      {c.framing}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* How we curate */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            How we curate
          </h2>
          <div className="text-stone-700 leading-relaxed space-y-4">
            <p>
              Every business on Candella has been added by hand. We find them
              through people we trust, businesses we already shop at, and quiet
              research on places that don&rsquo;t necessarily promote themselves
              loudly. Then we check: do they actually do what they say? Where
              do their suppliers come from? Are the credentials they claim
              &mdash; B Corp, Climate Active, Ethical Clothing Australia, fair
              trade certifications &mdash; real and current?
            </p>
            <p>
              If we can verify it, they go in. If we can&rsquo;t verify it, we
              ask the business directly. If something feels off, we leave it
              off. We&rsquo;d rather have a smaller list of businesses we
              genuinely stand behind than a big list with question marks
              attached. The directory grows slowly on purpose.
            </p>
            <p>
              When a business claims their listing, they can edit their
              information and add detail we couldn&rsquo;t find from the outside
              &mdash; supplier stories, certifications, photos, the things only
              an owner knows. Claimed listings are marked, so you can see
              who&rsquo;s been verified by their owner. Either way, every
              business on this list is here because we put it here, not because
              they paid to be.
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-stone-100 pt-10">
          <p className="text-stone-700 leading-relaxed mb-6">
            Candella is built in Melbourne, slowly, by people who care about
            getting this right. If you know a business that should be on here
            &mdash; or you run one &mdash; get in touch.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/businesses"
              className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors"
            >
              Browse the directory
            </Link>
            <Link
              href="/claim"
              className="inline-block border border-stone-200 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-full hover:border-stone-400 hover:bg-stone-50 transition-colors"
            >
              Claim or list a business
            </Link>
          </div>
        </section>

      </article>
    </main>
  )
}
