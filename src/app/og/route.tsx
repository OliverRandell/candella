import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? 'Candella'
  const suburb = searchParams.get('suburb') ?? 'Melbourne'
  const category = searchParams.get('category') ?? ''
  const color = searchParams.get('color') ?? '#A1EDCA'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafaf9',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            width: '60px',
            height: '6px',
            backgroundColor: color,
            borderRadius: '3px',
            marginBottom: '48px',
          }}
        />

        {/* Category pill */}
        {category && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: color,
                color: '#1c1c1a',
                fontSize: '18px',
                fontWeight: 500,
                padding: '8px 20px',
                borderRadius: '100px',
              }}
            >
              {category}
            </div>
          </div>
        )}

        {/* Business name */}
        <div
          style={{
            fontSize: name.length > 20 ? '64px' : '80px',
            fontWeight: 700,
            color: '#1c1917',
            lineHeight: 1.1,
            marginBottom: '24px',
            flex: 1,
          }}
        >
          {name}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#888780',
            }}
          >
            {suburb} · Melbourne
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#1c1917',
            }}
          >
            candella
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}