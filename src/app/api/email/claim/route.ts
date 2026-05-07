import { NextRequest, NextResponse } from 'next/server'
import {
  notifyAdminOfClaim,
  confirmClaimToOwner,
  type ClaimPayload,
} from '@/lib/email'

/**
 * POST /api/email/claim
 *
 * Called by the /claim form after a successful Supabase insert into the
 * claims table. Fires two emails:
 *   1. Notification to the admin
 *   2. Confirmation to the business owner
 */
export async function POST(request: NextRequest) {
  let payload: ClaimPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload.businessName || !payload.ownerEmail) {
    return NextResponse.json(
      { error: 'businessName and ownerEmail are required' },
      { status: 400 }
    )
  }

  await Promise.allSettled([
    notifyAdminOfClaim(payload),
    confirmClaimToOwner(payload),
  ])

  return NextResponse.json({ ok: true })
}
