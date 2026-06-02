'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getCategoryIconPath } from '@/lib/categories'

type Business = {
  id: string
  name: string
  slug: string
  suburb: string
  category: string
  description: string | null
  criteria: string[]
  is_verified: boolean
}

type Props = {
  featuredBusinesses: Business[]
  categoryCounts: Record<string, number>
}

const CATEGORIES = [
  'Cafes & Restaurants',
  'Fashion',
  'Groceries',
  'Home & Living',
  'Alcohol',
  'Markets',
]

export default function HomePageClient({ featuredBusinesses, categoryCounts }: Props) {
  const [navVisible, setNavVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight
      setNavVisible(window.scrollY > heroHeight * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ fontFamily: '"Garet", "Quicksand", sans-serif', color: '#2A2A28' }}>

      {/* Sticky nav — fades in once user has scrolled past 30% of hero */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 40px',
        background: '#F7F4F0',
        borderBottom: navVisible ? '0.5px solid rgba(42,42,40,0.1)' : 'none',
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, border-bottom 0.3s ease',
        pointerEvents: navVisible ? 'all' : 'none',
      }}>
        <Link href="/" style={{
          fontSize: '26px', fontWeight: 700, letterSpacing: '-0.092em',
          color: '#2A2A28', textDecoration: 'none',
        }}>
          henka.
        </Link>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/businesses" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>Businesses</Link>
          <Link href="/about" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>About</Link>
          <Link href="/businesses/submit" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>Contact</Link>
        </div>
      </nav>

      {/* Hero — sticky so content scrolls over it */}
      <div ref={heroRef} style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {/* Background image — Unsplash Melbourne laneway, free to use */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-photo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }} />

        {/* Dark overlay so text reads clearly */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(247,244,240,0.55)',
        }} />

        {/* Nav top right — always visible on hero */}
        <div style={{
          position: 'absolute', top: '24px', right: '40px',
          display: 'flex', gap: '32px', alignItems: 'center', zIndex: 10,
        }}>
          <Link href="/businesses" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>Businesses</Link>
          <Link href="/about" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>About</Link>
          <Link href="/businesses/submit" style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#2A2A28', textDecoration: 'none',
          }}>Contact</Link>
        </div>

        {/* Wordmark — bottom left, bleeds off edge */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '40px',
          zIndex: 10,
          lineHeight: 1,
        }}>
          <h1 style={{
            fontSize: 'clamp(140px, 28vw, 280px)',
            fontWeight: 700,
            letterSpacing: '-0.092em',
            color: '#2A2A28',
            margin: 0,
            lineHeight: 0.9,
          }}>
            henka.
          </h1>
          <p style={{
            fontSize: 'clamp(20px, 3.5vw, 42px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#2A2A28',
            margin: '8px 0 0 4px',
            opacity: 0.85,
          }}>
            a change for good
          </p>
        </div>

        {/* CTA — bottom right */}
        <div style={{
          position: 'absolute', bottom: '10%', right: '40px', zIndex: 10,
        }}>
          <Link href="/businesses" style={{
            display: 'inline-block',
            background: '#898F65',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '16px 32px',
            borderRadius: '999px',
            textDecoration: 'none',
          }}>
            Browse stores
          </Link>
        </div>
      </div>

      {/* Content — scrolls over the sticky hero */}
      <div style={{ position: 'relative', zIndex: 10, background: '#F7F4F0' }}>

        {/* Why Henka */}
        <section style={{
          padding: '80px 40px',
          borderTop: '0.5px solid rgba(42,42,40,0.1)',
          maxWidth: '720px',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#898F65', marginBottom: '20px',
          }}>
            Why Henka.
          </p>
          <p style={{
            fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 600,
            color: '#2A2A28', lineHeight: 1.45, marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Melbourne is full of businesses doing the work: sourcing carefully,
            paying fairly, putting thought into where their materials come from
            and where their waste ends up.
          </p>
          <p style={{
            fontSize: '16px', color: '#2A2A28', opacity: 0.6,
            lineHeight: 1.7, marginBottom: '32px', maxWidth: '560px',
          }}>
            Henka is a curated guide to find them, in one place, organised by
            what you&rsquo;re actually looking for: a coffee, a jumper, a Saturday
            market. We&rsquo;re building it slowly, business by business, because
            that&rsquo;s the only way to do it properly.
          </p>
          <Link href="/about" style={{
            fontSize: '14px', fontWeight: 600, color: '#898F65', textDecoration: 'none',
          }}>
            Read more about us &rarr;
          </Link>
        </section>

        {/* Featured businesses */}
        {featuredBusinesses.length > 0 && (
          <section style={{
            padding: '80px 40px',
            borderTop: '0.5px solid rgba(42,42,40,0.1)',
          }}>
            <p style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#898F65', marginBottom: '20px',
            }}>
              Worth knowing about
            </p>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700,
              letterSpacing: '-0.025em', color: '#2A2A28',
              lineHeight: 1.2, marginBottom: '32px',
            }}>
              Places we&rsquo;d go back to.
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px', marginBottom: '36px',
            }}>
              {featuredBusinesses.map(biz => (
                <Link key={biz.id} href={`/businesses/${biz.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    background: '#fff', borderRadius: '16px',
                    overflow: 'hidden', border: '0.5px solid rgba(42,42,40,0.1)',
                  }}>
                    <div style={{
                      height: '140px', background: '#E4E6DC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {getCategoryIconPath(biz.category) && (
                        <img src={getCategoryIconPath(biz.category)!} alt=""
                          style={{ width: '40px', height: '40px', opacity: 0.4 }}
                          aria-hidden="true" />
                      )}
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#2A2A28', marginBottom: '4px' }}>
                        {biz.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#2A2A28', opacity: 0.45, marginBottom: '10px' }}>
                        {biz.suburb} &middot; {biz.category}
                      </p>
                      {biz.criteria?.length > 0 && (
                        <span style={{
                          fontSize: '11px', fontWeight: 700, background: '#F0F1EB',
                          color: '#5a6140', padding: '3px 10px', borderRadius: '999px',
                          display: 'inline-block',
                        }}>
                          {biz.criteria[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/businesses" style={{
              display: 'inline-block', background: '#898F65', color: '#fff',
              fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', padding: '16px 32px',
              borderRadius: '999px', textDecoration: 'none',
            }}>
              See all businesses
            </Link>
          </section>
        )}

        {/* Categories */}
        <section style={{
          padding: '80px 40px',
          borderTop: '0.5px solid rgba(42,42,40,0.1)',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#898F65', marginBottom: '16px',
          }}>
            Browse by category
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700,
            letterSpacing: '-0.025em', color: '#2A2A28',
            lineHeight: 1.2, marginBottom: '28px',
          }}>
            Find what you&rsquo;re looking for.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px', marginBottom: '36px',
          }}>
            {CATEGORIES.map(cat => (
              <Link key={cat}
                href={`/businesses?category=${encodeURIComponent(cat)}`}
                style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '18px 16px', border: '0.5px solid rgba(42,42,40,0.1)',
                }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#2A2A28', marginBottom: '4px' }}>
                    {cat}
                  </p>
                  <p style={{ fontSize: '12px', color: '#2A2A28', opacity: 0.45 }}>
                    {categoryCounts[cat] ?? 0} places
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/businesses" style={{
            display: 'inline-block', border: '2px solid #2A2A28', color: '#2A2A28',
            fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '14px 32px',
            borderRadius: '999px', textDecoration: 'none',
          }}>
            Browse all
          </Link>
        </section>

        {/* Closing */}
        <section style={{
          background: '#2A2A28',
          padding: '80px 40px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700,
            letterSpacing: '-0.03em', color: '#F7F4F0',
            marginBottom: '16px', lineHeight: 1.2,
          }}>
            Change starts close to home.
          </h2>
          <p style={{
            fontSize: '16px', color: '#F7F4F0', opacity: 0.5,
            maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.65,
          }}>
            Every business on Henka is here because we put it here. Not because
            they paid to be. Not because an algorithm surfaced them.
          </p>
          <Link href="/about" style={{
            display: 'inline-block', background: '#F7F4F0', color: '#2A2A28',
            fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '16px 36px',
            borderRadius: '999px', textDecoration: 'none',
          }}>
            Read how we curate
          </Link>
        </section>

      </div>
    </div>
  )
}
