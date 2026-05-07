import { NextRequest, NextResponse } from 'next/server'
import {
  notifyAdminOfSubmission,
  confirmSubmissionToSubmitter,
  type SubmissionPayload,
} from '@/lib/email'

/**
 * POST /api/email/submission
 *
 * Called by the /businesses/submit form after a successful Supabase insert.
 * Fires two emails:
 *   1. Notification to the admin (so we don't miss submissions)
 *   2. Confirmation to the submitter (so they know we got it)
 *
 * Both sends are best-effort. If they fail, we still return success to the
 * caller \u2014 a successful DB insert without a successful email is still a
 * better outcome than a failed submission.
 */
export async function POST(request: NextRequest) {
  let payload: SubmissionPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Minimal validation. The form already validates client-side; this is just
  // a defensive check against malformed bodies hitting the endpoint directly.
  if (!payload.businessName || !payload.submitterEmail) {
    return NextResponse.json(
      { error: 'businessName and submitterEmail are required' },
      { status: 400 }
    )
  }

  // Fire both emails concurrently. We don't await, but Promise.allSettled
  // lets us log any failures without bubbling them up to the caller.
  await Promise.allSettled([
    notifyAdminOfSubmission(payload),
    confirmSubmissionToSubmitter(payload),
  ])

  return NextResponse.json({ ok: true })
}
