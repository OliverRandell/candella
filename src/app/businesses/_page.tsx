'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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

const RADIUS_OPTIONS = [
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
  { label: '50 km', value: 50 },
]

const CRITERIA_OPTIONS = [
  'Vegan',
  'Organic Certified',
  'Australian Made',
  'Female Founded',
  'BIPOC Owned',
  'Cruelty Free',
  'Zero Waste',
  'Circular Materials',
  'Brand Giveback',
  'Regenerative',
  'B Corp Certified',
  'Size Inclusive',
]

type ViewMode = 'map' | 'list'

function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function BusinessesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filtered, setFiltered] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [suburbs, setSuburbs] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const activeCategory = searchParams.get('category') ?? 'All'
  const activeSuburb = searchParams.get('suburb') ?? 'All'
  const searchQuery = searchParams.get('q') ?? ''
  const activeRadius = Number(searchParams.get('radius') ?? '0')
  const activeCriteriaString = searchParams.get('criteria') ?? ''
  const activeCriteria = activeCriteriaString ? activeCriteriaString.split(',').filter(Boolean) : []

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

    if (userLocation && activeRadius > 0) {
      results = results.filter(b => {
        if (!b.lat || !b.lng) return false
        return getDistanceKm(
          userLocation.lat, userLocation.lng,
          Number(b.lat), Number(b.lng)
        ) <= activeRadius
      })
    }

    if (activeCriteria.length > 0) {
      results = results.filter(b =>
        activeCriteria.every(c => b.criteria?.includes(c))
      )
    }

    setFiltered(results)
  }, [businesses, activeCategory, activeSuburb, searchQuery, userLocation, activeRadius, activeCriteriaString])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== '0') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/businesses?${params.toString()}`, { scroll: false })
  }

  function toggleCriteria(criterion: string) {
    const current = activeCriteria
    const updated = current.includes(criterion)
      ? current.filter(c => c !== criterion)
      : [...current, criterion]
    updateParams({ criteria: updated.join(',') })
  }

  function requestLocation() {
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationLoading(false)
        updateParams({ radius: '5' })
      },
      () => {
        setLocationLoading(false)
        alert('Unable to get your location. Please check your browser settings.')
      }
    )
  }

  function handleMarkerClick(business: Business) {
    setSelectedId(business.id)
    cardRefs.current[business.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const hasActiveFilters = activeCategory !== 'All' ||
    activeSuburb !== 'All' ||
    searchQuery ||
    activeRadius > 0 ||
    activeCriteria.length > 0

  return (
    <main className="h-screen flex flex-col bg-white overflow-hidden">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-sm text-stone-400">Melbourne</span>
      </nav>

      {/* Filter bar */}
      <div className="border-b border-stone-100 px-6 py-4 flex-shrink-0">
        <div className="flex flex-wrap gap-3 items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => updateParams({ q: e.target.value })}
              placeholder="Search businesses..."
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Category */}
          <select
            value={activeCategory}
            onChange={e => updateParams({ category: e.target.value })}
            className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Suburb */}
          <select
            value={activeSuburb}
            onChange={e => updateParams({ suburb: e.target.value })}
            className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
          >
            <option value="All">All suburbs</option>
            {suburbs.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Location + radius */}
          <div className="flex items-center gap-2">
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className={`flex items-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm transition-colors ${
                userLocation
                  ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              <span style={{ fontSize: '14px' }}>◎</span>
              {locationLoading ? 'Locating...' : userLocation ? 'Located' : 'Near me'}
            </button>

            {userLocation && (
              <select
                value={activeRadius || 5}
                onChange={e => updateParams({ radius: e.target.value })}
                className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
              >
                {RADIUS_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Filters button */}
          <button
            onClick={() => setFiltersOpen(true)}
            className={`flex items-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm transition-colors ${
              activeCriteria.length > 0
                ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
                : 'border-stone-200 text-stone-600 hover:border-stone-400'
            }`}
          >
            <span style={{ fontSize: '14px' }}>⊞</span>
            Filters
            {activeCriteria.length > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeCriteria.length}
              </span>
            )}
          </button>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={() => router.push('/businesses', { scroll: false })}
              className="text-xs text-stone-400 hover:text-stone-700 underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results count + view toggle */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-stone-400 text-sm">
            {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex border border-stone-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'map'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-500 hover:bg-stone-50'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-500 hover:bg-stone-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex">

        {/* Desktop */}
        <div className="hidden lg:flex w-full h-full">
          {viewMode === 'map' ? (
            <>
              {/* Sidebar list */}
              <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-stone-100 px-6 py-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="py-4 border-b border-stone-100">
                        <div className="h-4 bg-stone-100 rounded w-1/2 mb-2 animate-pulse" />
                        <div className="h-3 bg-stone-100 rounded w-1/3 mb-3 animate-pulse" />
                        <div className="h-3 bg-stone-100 rounded w-3/4 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-stone-400 text-sm mb-3">No businesses match your filters.</p>
                    <button
                      onClick={() => router.push('/businesses', { scroll: false })}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filtered.map((business: Business) => (
                    <div
                      key={business.id}
                      ref={el => { cardRefs.current[business.id] = el }}
                      onMouseEnter={() => setHoveredId(business.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <BusinessCard
                        business={business}
                        isSelected={selectedId === business.id}
                        onClick={() => setSelectedId(business.id)}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Map */}
              <div className="flex-1">
                <BusinessMap
                  businesses={filtered}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onMarkerClick={handleMarkerClick}
                  onMarkerHover={(id) => setHoveredId(id)}
                  userLocation={userLocation}
                  activeRadius={activeRadius}
                  activeSuburb={activeSuburb !== 'All' ? activeSuburb : null}
                />
              </div>
            </>
          ) : (
            /* List only */
            <div className="w-full overflow-y-auto px-6 py-4 max-w-3xl mx-auto">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="py-4 border-b border-stone-100">
                      <div className="h-4 bg-stone-100 rounded w-1/2 mb-2 animate-pulse" />
                      <div className="h-3 bg-stone-100 rounded w-1/3 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-stone-400 text-sm">No businesses match your filters.</p>
                </div>
              ) : (
                filtered.map((business: Business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    isSelected={selectedId === business.id}
                    onClick={() => setSelectedId(business.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Mobile: toggle view */}
        <div className="lg:hidden w-full h-full">
          {viewMode === 'list' ? (
            <div className="overflow-y-auto h-full px-6 py-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="py-4 border-b border-stone-100">
                      <div className="h-4 bg-stone-100 rounded w-1/2 mb-2 animate-pulse" />
                      <div className="h-3 bg-stone-100 rounded w-1/3 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-stone-400 text-sm">No businesses match your filters.</p>
                </div>
              ) : (
                filtered.map((business: Business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    isSelected={selectedId === business.id}
                    onClick={() => setSelectedId(business.id)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="h-full">
              <BusinessMap
                businesses={filtered}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onMarkerClick={handleMarkerClick}
                onMarkerHover={(id) => setHoveredId(id)}
                userLocation={userLocation}
                activeRadius={activeRadius}
                activeSuburb={activeSuburb !== 'All' ? activeSuburb : null}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/20"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="w-80 bg-white h-full overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-medium text-stone-900">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-sm text-stone-400 hover:text-stone-700"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-4">
              <h3 className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-4">
                Sustainability criteria
              </h3>
              <div className="space-y-2">
                {CRITERIA_OPTIONS.map(criterion => (
                  <label
                    key={criterion}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        activeCriteria.includes(criterion)
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-stone-300 group-hover:border-emerald-400'
                      }`}
                      onClick={() => toggleCriteria(criterion)}
                    >
                      {activeCriteria.includes(criterion) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span className="text-sm text-stone-700">{criterion}</span>
                  </label>
                ))}
              </div>

              {activeCriteria.length > 0 && (
                <button
                  onClick={() => updateParams({ criteria: '' })}
                  className="mt-6 text-xs text-stone-400 hover:text-stone-700 underline"
                >
                  Clear criteria filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function BusinessCard({
  business,
  isSelected,
  onClick,
}: {
  business: Business
  isSelected: boolean
  onClick: () => void
}) {
  const color = getCategoryColor(business.category)
  return (
    <div
      onClick={onClick}
      className={`py-4 border-b border-stone-100 cursor-pointer transition-colors ${
        isSelected ? 'bg-emerald-50 -mx-6 px-6' : 'hover:bg-stone-50 -mx-2 px-2 rounded-lg'
      }`}
    >
      <Link href={`/businesses/${business.slug}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-stone-900 hover:text-emerald-700 transition-colors">
                {business.name}
              </span>
              {business.is_verified && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Verified
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
            {business.criteria?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 pl-4">
                {business.criteria.slice(0, 3).map(c => (
                  <span key={c} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-stone-300 hover:text-emerald-500 transition-colors flex-shrink-0">→</span>
        </div>
      </Link>
    </div>
  )
}