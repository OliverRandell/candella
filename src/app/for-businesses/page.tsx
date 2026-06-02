import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Pencil,
  Image as ImageIcon,
  BadgeCheck,
  Leaf,
  Network,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Claim your listing on Candella | For Businesses',
  description:
    'Candella is Melbourne&rsquo;s curated guide to sustainable businesses. Claim your listing to edit your profile, add photos, get the verified badge, and join the network.',
  openGraph: {
    title: 'Claim your listing on Candella',
    description:
      'Melbourne&rsquo;s curated guide to sustainable businesses. Free to claim, takes a few minutes.',
    url: '/for-businesses',
    type: 'website',
  },
  alternates: {
    canonical: '/for-businesses',
  },
}

const benefits = [
  {
    icon: Pencil,
    title: 'Take control of your listing',
    body: 'Edit your description, hours, contact details, website, and the sustainability criteria your business meets. Make sure your listing shows up the way you want it to.',
  },
  {
    icon: ImageIcon,
    title: 'Add photos',
    body: 'Upload a hero image and gallery so visitors see your space, your products, and your team \u2014 not just text.',
  },
  {
    icon: BadgeCheck,
    title: 'Get the verified badge',
    body: 'Claimed listings get a visible verified badge on their profile and map pin \u2014 a clear signal that the listing is owner-managed and actively maintained.',
  },
  {
    icon: Leaf,
    title: 'Tell the full story',
    body: 'Add the certifications, suppliers, and specific practices that the directory entry can&rsquo;t capture from the outside. The detail that only an owner knows.',
  },
  {
    icon: Network,
    title: 'Cross-promotion across the directory',
    body: 'Claimed listings appear in \u201Cmore in this suburb\u201D on other profiles, helping Melbourne&rsquo;s sustainability-minded customers discover you through businesses they already know.',
  },
  {
    icon: Sparkles,
    title: 'Be part of what comes next',
    body: 'Candella is starting as a directory but the longer-term vision is bigger. Claimed members will be the founding network for whatever the platform grows into.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Find your listing',
    body: 'Search the directory or send us a link. If your business isn&rsquo;t listed yet, you can submit it for review.',
  },
  {
    number: '2',
    title: 'Claim it',
    body: 'Fill out a short form to verify you&rsquo;re the owner. We&rsquo;ll confirm by email \u2014 usually within 48 hours.',
  },
  {
    number: '3',
    title: 'Make it yours',
    body: 'Once verified, edit your profile, add photos, and tell the part of your story the directory entry couldn&rsquo;t.',
  },
]

const faqs = [
  {
    q: 'Is claiming really free?',
    a: 'Yes. Your base listing is free to claim and will always remain free to maintain. We may introduce optional premium features later \u2014 things like featured placement or advanced analytics \u2014 but nothing about the core listing will move behind a paywall.',
  },
  {
    q: 'How do you verify I own the business?',
    a: 'We&rsquo;ll send a verification email to an address associated with the business (usually the one on your website). If that&rsquo;s not possible, we&rsquo;ll arrange a quick alternative \u2014 a social media DM from the business account, or a brief call.',
  },
  {
    q: 'What does \u201Cverified\u201D actually mean?',
    a: 'It means the listing has been claimed by the business owner and is actively managed by them. It&rsquo;s a signal of authenticity, not an endorsement of sustainability claims \u2014 we treat those separately. Read our about page for how we curate.',
  },
  {
    q: 'What if my business isn&rsquo;t listed yet?',
    a: 'Candella is curated \u2014 we list businesses that meet at least one of our published sustainability criteria. If you think yours fits, you can submit it for review. We&rsquo;ll be in touch either way.',
  },
  {
    q: 'Who&rsquo;s behind Candella?',
    a: 'Candella is an independent project based in Melbourne, building a directory and community for sustainable businesses. Solo-founded, grown with care, not funded by advertisers.',
  },
  {
    q: 'Will you share my information?',
    a: 'No. We don&rsquo;t sell data, we don&rsquo;t share your contact details with third parties, and any email you give us is used only for account-related communication unless you explicitly opt in to updates.',
  },
  {
    q: 'Is anything else on the roadmap?',
    a: 'We&rsquo;re exploring a few things \u2014 a community/rewards layer connecting Melbourne&rsquo;s sustainable businesses, deeper editorial coverage, possibly a native app. None of it is committed yet. Claimed members will hear about it first.',
  },
]

export default function ForBusinessesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/businesses"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            Browse all
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Hero */}
        <section className="mb-20 md:mb-28">
          <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-4">
            For businesses
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            Own your listing on Candella.
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mb-8 leading-relaxed">
            Candella is Melbourne's curated guide to sustainable
            businesses. Claiming your listing takes a few minutes, its
            free, and it puts you in control of how your business shows up.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/claim"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Claim your listing
            </Link>
            <Link
              href="/businesses"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
            >
              Browse the directory
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20 md:mb-28">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900 mb-10">
            What claiming unlocks
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                    <Icon className="h-5 w-5 text-stone-700" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-stone-900">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {b.body}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20 md:mb-28">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900 mb-10">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number}>
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                  {s.number}
                </div>
                <h3 className="mb-2 text-base font-semibold text-stone-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-stone-100 bg-stone-50/50 p-5">
            <p className="text-sm text-stone-600 leading-relaxed">
              <span className="font-medium text-stone-900">
                Don't see your business yet?
              </span>{' '}
              You can{' '}
              <Link
                href="/businesses/submit"
                className="text-emerald-700 hover:underline font-medium"
              >
                submit it for review
              </Link>{' '}
              and we'll get back to you.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 md:mb-28">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900 mb-10">
            Frequently asked
          </h2>
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-stone-900">
                  {f.q}
                  <span className="ml-4 text-stone-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="rounded-3xl bg-stone-900 p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
            Ready to claim your listing?
          </h2>
          <p className="text-stone-300 mb-8 max-w-xl mx-auto leading-relaxed">
            It takes a few minutes, it's free, and it puts your business
            on the map \u2014 literally.
          </p>
          <Link
            href="/claim"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
          >
            Claim your listing
          </Link>
        </section>
      </div>
    </main>
  )
}
