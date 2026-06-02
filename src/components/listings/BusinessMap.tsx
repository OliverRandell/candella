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
  // Invariant enforced by the parent: `userLocation` and `activeSuburb`
  // are NEVER both truthy at the same time. The parent passes one or the other.
  userLocation?: { lat: number; lng: number } | null
  activeRadius?: number
  activeSuburb?: string | null
}

const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 }
const MELBOURNE_DEFAULT_ZOOM = 13

/**
 * Zoom level chosen so the full radius circle is comfortably visible on a
 * desktop viewport. Previously the values were one level too tight, which
 * clipped the circle on wider radii.
 */
function zoomForRadius(radiusKm: number): number {
  if (radiusKm <= 2) return 14
  if (radiusKm <= 5) return 13
  if (radiusKm <= 10) return 12
  if (radiusKm <= 20) return 11
  return 10
}

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

  // Reset map to Melbourne when all location filters clear.
  // This catches the case where the user clicks "Clear all" or disables Near Me.
  useEffect(() => {
    if (!map) return
    if (!activeSuburb && !userLocation) {
      map.panTo(MELBOURNE_CENTER)
      map.setZoom(MELBOURNE_DEFAULT_ZOOM)
    }
  }, [map, activeSuburb, userLocation])

  // Pan/zoom to suburb
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

  // Draw the radius circle and pan to user. Bumped fill opacity 0.12 → 0.22
  // and stroke to 2.5 px so the area is actually visible on the map.
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
      strokeColor: '#0F6E56',
      strokeOpacity: 0.9,
      strokeWeight: 2.5,
      fillColor: '#A1EDCA',
      fillOpacity: 0.22,
      clickable: false,
    })

    map.panTo(userLocation)
    map.setZoom(zoomForRadius(activeRadius))

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
    onMarkerClick?.(business)
  }, [onMarkerClick])

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
        defaultZoom={MELBOURNE_DEFAULT_ZOOM}
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
            pixelOffset={[0, -8]}
          >
            <div
              style={{
                maxWidth: '240px',
                fontFamily: 'inherit',
                padding: '8px 4px 6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    margin: 0,
                    color: '#1c1917',
                    lineHeight: 1.3,
                  }}
                >
                  {selectedBusiness.name}
                </p>
                {selectedBusiness.is_verified && (
                  <span
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    Verified
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: '11px',
                  color: '#a8a29e',
                  margin: '0 0 8px',
                  textTransform: 'none',
                  letterSpacing: '0',
                  lineHeight: 1.4,
                }}
              >
                {selectedBusiness.suburb} \u00b7 {selectedBusiness.category}
              </p>

              {selectedBusiness.description && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#57534e',
                    margin: '0 0 10px',
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                  }}
                >
                  {selectedBusiness.description}
                </p>
              )}

              <a
                href={`/businesses/${selectedBusiness.slug}`}
                style={{
                  fontSize: '12px',
                  color: '#047857',
                  textDecoration: 'none',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                View listing
                <span style={{ fontSize: '14px' }}>\u2192</span>
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
