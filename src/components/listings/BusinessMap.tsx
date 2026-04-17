'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps'
import { Business } from '@/lib/types'
import { getCategoryColor } from '@/lib/categories'

type Props = {
  businesses: Business[]
  selectedId?: string | null
  hoveredId?: string | null
  onMarkerClick?: (business: Business) => void
  onMarkerHover?: (id: string | null) => void
  userLocation?: { lat: number; lng: number } | null
  activeRadius?: number
  activeSuburb?: string | null
}

const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 }

function MapController({
  activeSuburb,
  suburbCenter,
  suburbBounds,
  userLocation,
  activeRadius,
}: {
  activeSuburb?: string | null
  suburbCenter?: { lat: number; lng: number } | null
  suburbBounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number } | null
  userLocation?: { lat: number; lng: number } | null
  activeRadius?: number
}) {
  const map = useMap()
  const circleRef = useRef<google.maps.Circle | null>(null)

  useEffect(() => {
    if (!map || !activeSuburb || !suburbCenter) return
    if (suburbBounds) {
      const bounds = new google.maps.LatLngBounds(
        { lat: suburbBounds.minLat, lng: suburbBounds.minLng },
        { lat: suburbBounds.maxLat, lng: suburbBounds.maxLng }
      )
      map.fitBounds(bounds, 80)
    } else {
      map.panTo(suburbCenter)
      map.setZoom(15)
    }
  }, [map, activeSuburb, suburbCenter, suburbBounds])

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setMap(null)
      circleRef.current = null
    }

    if (!map || !userLocation || !activeRadius) return

    circleRef.current = new google.maps.Circle({
      map,
      center: userLocation,
      radius: activeRadius * 1000,
      strokeColor: '#A1EDCA',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#A1EDCA',
      fillOpacity: 0.12,
    })

    map.panTo(userLocation)
    map.setZoom(activeRadius <= 2 ? 15 : activeRadius <= 5 ? 14 : activeRadius <= 10 ? 13 : 12)

    return () => {
      circleRef.current?.setMap(null)
    }
  }, [map, userLocation, activeRadius])

  return null
}

export default function BusinessMap({
  businesses,
  selectedId,
  hoveredId,
  onMarkerClick,
  onMarkerHover,
  userLocation,
  activeRadius,
  activeSuburb,
}: Props) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)

  useEffect(() => {
    if (selectedId) {
      const business = businesses.find(b => b.id === selectedId)
      setSelectedBusiness(business ?? null)
    } else {
      setSelectedBusiness(null)
    }
  }, [selectedId, businesses])

  const handleMarkerClick = useCallback((business: Business) => {
    setSelectedBusiness(prev => prev?.id === business.id ? null : business)
  }, [])

  const mapped = businesses.filter(b => b.lat && b.lng)

  const suburbData = useMemo(() => {
    if (!activeSuburb) return null
    const suburbBusinesses = businesses.filter(
      b => b.suburb === activeSuburb && b.lat && b.lng
    )
    if (suburbBusinesses.length === 0) return null

    const lats = suburbBusinesses.map(b => Number(b.lat))
    const lngs = suburbBusinesses.map(b => Number(b.lng))
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    return {
      center: { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 },
      bounds: suburbBusinesses.length > 1
        ? { minLat, maxLat, minLng, maxLng }
        : null,
    }
  }, [activeSuburb, businesses])

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        defaultCenter={MELBOURNE_CENTER}
        defaultZoom={13}
        gestureHandling="greedy"
        style={{ width: '100%', height: '100%' }}
      >
        <MapController
          activeSuburb={activeSuburb}
          suburbCenter={suburbData?.center ?? null}
          suburbBounds={suburbData?.bounds ?? null}
          userLocation={userLocation}
          activeRadius={activeRadius}
        />

        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              border: '3px solid white',
              boxShadow: '0 0 0 2px #3B82F6',
            }} />
          </AdvancedMarker>
        )}

        {mapped.map(business => {
          const color = getCategoryColor(business.category)
          const isSelected = business.id === selectedId
          const isHovered = business.id === hoveredId

          return (
            <AdvancedMarker
              key={business.id}
              position={{ lat: Number(business.lat), lng: Number(business.lng) }}
              onClick={() => handleMarkerClick(business)}
            >
              <div
                onMouseEnter={() => onMarkerHover?.(business.id)}
                onMouseLeave={() => onMarkerHover?.(null)}
                style={{
                  width: isSelected || isHovered ? '20px' : '14px',
                  height: isSelected || isHovered ? '20px' : '14px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: isSelected || isHovered
                    ? '3px solid #1c1917'
                    : '2px solid white',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              />
            </AdvancedMarker>
          )
        })}

        {selectedBusiness && selectedBusiness.lat && selectedBusiness.lng && (
          <InfoWindow
            position={{
              lat: Number(selectedBusiness.lat),
              lng: Number(selectedBusiness.lng),
            }}
            onCloseClick={() => setSelectedBusiness(null)}
          >
            <div style={{ maxWidth: '200px', fontFamily: 'sans-serif', padding: '4px' }}>
              <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px', color: '#1c1c1a' }}>
                {selectedBusiness.name}
              </p>
              <p style={{ fontSize: '12px', color: '#888780', marginBottom: '8px' }}>
                {selectedBusiness.suburb} · {selectedBusiness.category}
              </p>
              {selectedBusiness.description && (
                <p style={{ fontSize: '12px', color: '#5F5E5A', marginBottom: '8px', lineHeight: '1.5' }}>
                  {selectedBusiness.description.slice(0, 100)}...
                </p>
              )}
              
                <a href={`/businesses/${selectedBusiness.slug}`}
                style={{ fontSize: '12px', color: '#0F6E56', textDecoration: 'none', fontWeight: 500 }}
              >
                View listing →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}