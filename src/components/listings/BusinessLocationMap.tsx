'use client'

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { Business } from '@/lib/types'
import { getCategoryColor } from '@/lib/categories'

type Props = {
  business: Pick<Business, 'lat' | 'lng' | 'category' | 'name'>
}

/**
 * Compact map showing a single business's location. Used on the detail
 * page beneath the practical info. Different from BusinessMap (the listings
 * map) because that one assumes a list of businesses, hover state, click
 * handlers, suburb panning, radius circles — none of which apply here.
 *
 * Kept small and intentionally non-interactive so it doesn't compete with
 * the page content.
 */
export default function BusinessLocationMap({ business }: Props) {
  if (!business.lat || !business.lng) return null

  const lat = Number(business.lat)
  const lng = Number(business.lng)
  const color = getCategoryColor(business.category)

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-72 rounded-xl overflow-hidden border border-stone-100">
        <Map
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={true}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker position={{ lat, lng }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: color,
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}
            />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  )
}
