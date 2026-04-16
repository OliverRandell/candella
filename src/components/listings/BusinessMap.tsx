'use client'

import { useState, useCallback } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from '@vis.gl/react-google-maps'
import { Business } from '@/lib/types'
import { getCategoryColor } from '@/lib/categories'

type Props = {
  businesses: Business[]
}

const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 }

export default function BusinessMap({ businesses }: Props) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)

  const handleMarkerClick = useCallback((business: Business) => {
    setSelectedBusiness(prev => prev?.id === business.id ? null : business)
  }, [])

  const mapped = businesses.filter(b => b.lat && b.lng)

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        defaultCenter={MELBOURNE_CENTER}
        defaultZoom={13}
        gestureHandling="greedy"
        style={{ width: '100%', height: '100%' }}
      >
        {mapped.map(business => {
          const color = getCategoryColor(business.category)
          return (
            <AdvancedMarker
              key={business.id}
              position={{ lat: Number(business.lat), lng: Number(business.lng) }}
              onClick={() => handleMarkerClick(business)}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '2px solid white',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
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