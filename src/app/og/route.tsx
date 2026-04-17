import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
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
            justifyContent: 'space-between',
            backgroundColor: '#fafaf9',
            padding: '80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: '48px',
                height: '5px',
                backgroundColor: color,
                borderRadius: '3px',
                marginBottom: '40px',
              }}
            />
            {category ? (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: color,
                  color: '#1c1c1a',
                  fontSize: '20px',
                  fontWeight: '500',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  marginBottom: '32px',
                  width: 'fit-content',
                }}
              >
                {category}
              </div>
            ) : null}
            <div
              style={{
                fontSize: name.length > 20 ? '60px' : '76px',
                fontWeight: '700',
                color: '#1c1917',
                lineHeight: '1.1',
              }}
            >
              {name}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '24px', color: '#888780' }}>
              {suburb} · Melbourne
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1c1917',
              }}
            >
              candella
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (e) {
    console.error('OG image error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}