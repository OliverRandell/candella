'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Business } from '@/lib/types'
import { getCategoryColor } from '@/lib/categories'

const BusinessMap = dynamic(() => import('@/components/listings/BusinessMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading map...</p>
    </div>
  ),
})

const CATEGORIES = [
  'All',
  'Cafes & Restaurants',
  'Fashion',
  'Groceries',
  'Home & Living',
  'Alcohol',
  'Markets',
]

type ViewMode = 'list' | 'map'

export default function BusinessesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filtered, setFiltered] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [suburbs, setSuburbs] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const activeCategory = searchParams.get('category') ?? 'All'
  const activeSuburb = searchParams.get('suburb') ?? 'All'
  const searchQuery = searchParams.get('q') ?? ''

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('name')

      if (data) {
        setBusinesses(data)
        const uniqueSuburbs = Array.from(
          new Set(data.map((b: Business) => b.suburb).filter(Boolean))
        ).sort() as string[]
        setSuburbs(uniqueSuburbs)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const applyFilters = useCallback(() => {
    let results = [...businesses]
    if (activeCategory !== 'All') {
      results = results.filter(b => b.category === activeCategory)
    }
    if (activeSuburb !== 'All') {
      results = results.filter(b => b.suburb === activeSuburb)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.suburb?.toLowerCase().includes(q)
      )
    }
    setFiltered(results)
  }, [businesses, activeCategory, activeSuburb, searchQuery])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/businesses?${params.toString()}`, { scroll: false })
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-sm text-stone-400">Melbourne</span>
      </nav>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="max-w-3xl w-full mx-auto px-6 pt-10 pb-4 flex-shrink-0">

          {/* Heading + view toggle */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 mb-1">
                Sustainable businesses
              </h1>
              <p className="text-stone-400 text-sm">
                {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* List / Map toggle */}
            <div className="flex border border-stone-200 rounded-lg overflow-hidden flex-shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-500 hover:bg-stone-50'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 text-sm transition-colors ${
                  viewMode === 'map'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-500 hover:bg-stone-50'
                }`}
              >
                Map
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={e => updateParams({ q: e.target.value })}
              placeholder="Search businesses..."
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat
              const color = cat === 'All' ? null : getCategoryColor(cat)
              return (
                <button
                  key={cat}
                  onClick={() => updateParams({ category: cat })}
                  className="px-4 py-1.5 rounded-full text-sm transition-colors border"
                  style={
                    isActive && color
                      ? { backgroundColor: color, borderColor: color, color: '#1c1c1a' }
                      : isActive
                      ? { backgroundColor: '#1c1917', borderColor: '#1c1917', color: '#fff' }
                      : { backgroundColor: '#fff', borderColor: '#e7e5e4', color: '#57534e' }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Suburb filter */}
          <div className="mb-6">
            <select
              value={activeSuburb}
              onChange={e => updateParams({ suburb: e.target.value })}
              className="border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
            >
              <option value="All">All suburbs</option>
              {suburbs.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(activeCategory !== 'All' || activeSuburb !== 'All' || searchQuery) && (
              <button
                onClick={() => router.push('/businesses', { scroll: false })}
                className="ml-3 text-xs text-stone-400 hover:text-stone-700 underline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* List view */}
        {viewMode === 'list' && (
          <div className="max-w-3xl w-full mx-auto px-6 pb-12">
            {loading ? (
              <div className="divide-y divide-stone-100">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="py-5">
                    <div className="h-4 bg-stone-100 rounded w-1/3 mb-2 animate-pulse" />
                    <div className="h-3 bg-stone-100 rounded w-1/4 mb-3 animate-pulse" />
                    <div className="h-3 bg-stone-100 rounded w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-400 text-sm mb-3">No businesses match your search.</p>
                <button
                  onClick={() => router.push('/businesses', { scroll: false })}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filtered.map((business: Business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map view */}
        {viewMode === 'map' && (
          <div style={{ height: 'calc(100vh - 280px)', width: '100%' }}>
            <BusinessMap businesses={filtered} />
          </div>
        )}
      </div>
    </main>
  )
}

function BusinessCard({ business }: { business: Business }) {
  const color = getCategoryColor(business.category)
  return (
    <Link href={`/businesses/${business.slug}`} className="block py-5 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors">
              {business.name}
            </span>
            {business.is_verified && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
            {business.is_featured && (
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mb-2 pl-4">
            {business.suburb} · {business.category}
          </p>
          {business.description && (
            <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed pl-4">
              {business.description}
            </p>
          )}
          {business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pl-4">
              {business.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-stone-300 group-hover:text-emerald-500 transition-colors flex-shrink-0">→</span>
      </div>
    </Link>
  )
}