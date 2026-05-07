/**
 * Email module — sends transactional emails via Resend.
 *
 * Architecture notes:
 * - This file is server-only. The Resend API key MUST stay on the server.
 *   It's only imported by API route handlers, never directly from client
 *   components.
 * - Emails are plain text. We chose plain over HTML because for a small,
 *   editorial product like this, plain emails feel more personal and are
 *   less likely to be filtered as bulk mail.
 * - Sends are fire-and-forget from the caller's perspective. If Resend
 *   fails, we log the error but don't throw — submissions/claims should
 *   never fail because email infrastructure is down.
 * - The from-address is configurable via env var so the same code works
 *   in dev (using Resend's onboarding@resend.dev test address) and
 *   production (using a verified domain like hello@candella.com.au).
 */

import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL

const resend = resendApiKey ? new Resend(resendApiKey) : null

function logEmailError(context: string, error: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[email] ${context} failed:`, error)
}

/**
 * Send safely — never throws. Returns true on success, false on any failure.
 * Callers should treat this as fire-and-forget: don't await the result if
 * email failure shouldn't block the user-facing flow.
 */
async function sendEmail(args: {
  to: string
  subject: string
  text: string
  context: string
}): Promise<boolean> {
  if (!resend) {
    logEmailError(args.context, 'RESEND_API_KEY not configured')
    return false
  }
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: args.to,
      subject: args.subject,
      text: args.text,
    })
    if (error) {
      logEmailError(args.context, error)
      return false
    }
    return true
  } catch (err) {
    logEmailError(args.context, err)
    return false
  }
}

/* ---------- Submissions ---------- */

export type SubmissionPayload = {
  businessName: string
  suburb: string
  category: string
  website?: string | null
  instagram?: string | null
  description?: string | null
  address?: string | null
  submissionNotes?: string | null
  criteria: string[]
  submitterEmail: string
}

export async function notifyAdminOfSubmission(payload: SubmissionPayload): Promise<boolean> {
  if (!adminEmail) {
    logEmailError('notifyAdminOfSubmission', 'ADMIN_NOTIFICATION_EMAIL not configured')
    return false
  }

  const lines = [
    `New business submission: ${payload.businessName}`,
    '',
    `Suburb:     ${payload.suburb}`,
    `Category:   ${payload.category}`,
  ]
  if (payload.website) lines.push(`Website:    ${payload.website}`)
  if (payload.instagram) lines.push(`Instagram:  ${payload.instagram}`)
  if (payload.address) lines.push(`Address:    ${payload.address}`)
  lines.push(`Submitter:  ${payload.submitterEmail}`)

  if (payload.description) {
    lines.push('', 'Description:', payload.description)
  }
  if (payload.submissionNotes) {
    lines.push('', 'Why sustainable:', payload.submissionNotes)
  }
  if (payload.criteria.length > 0) {
    lines.push('', `Criteria claimed: ${payload.criteria.join(', ')}`)
  }

  lines.push(
    '',
    '\u2014',
    'Review at: https://supabase.com/dashboard \u2192 businesses \u2192 filter status=pending'
  )

  return sendEmail({
    to: adminEmail,
    subject: `New submission: ${payload.businessName}`,
    text: lines.join('\n'),
    context: 'notifyAdminOfSubmission',
  })
}

export async function confirmSubmissionToSubmitter(payload: SubmissionPayload): Promise<boolean> {
  const text = [
    `Hi,`,
    '',
    `Thanks for submitting ${payload.businessName} to Candella. We've got it.`,
    '',
    `We review every submission by hand, which means it might take a few days. We'll get back to you either way \u2014 if we're approving the listing, if we need more information from you, or if we've decided not to include it.`,
    '',
    `If you've got more businesses you'd like to suggest, send them through.`,
    '',
    `Thanks,`,
    `Candella`,
    `https://candella-six.vercel.app`,
  ].join('\n')

  return sendEmail({
    to: payload.submitterEmail,
    subject: `Thanks for submitting ${payload.businessName}`,
    text,
    context: 'confirmSubmissionToSubmitter',
  })
}

/* ---------- Claims ---------- */

export type ClaimPayload = {
  businessName: string
  businessSlug: string | null
  ownerEmail: string
  message?: string | null
}

export async function notifyAdminOfClaim(payload: ClaimPayload): Promise<boolean> {
  if (!adminEmail) {
    logEmailError('notifyAdminOfClaim', 'ADMIN_NOTIFICATION_EMAIL not configured')
    return false
  }

  const lines = [
    `New listing claim: ${payload.businessName}`,
    '',
    `Owner email: ${payload.ownerEmail}`,
  ]
  if (payload.businessSlug) {
    lines.push(`Listing:     https://candella-six.vercel.app/businesses/${payload.businessSlug}`)
  }
  if (payload.message) {
    lines.push('', 'Message from owner:', payload.message)
  }

  lines.push(
    '',
    '\u2014',
    'Review at: https://supabase.com/dashboard \u2192 claims table'
  )

  return sendEmail({
    to: adminEmail,
    subject: `New claim: ${payload.businessName}`,
    text: lines.join('\n'),
    context: 'notifyAdminOfClaim',
  })
}

export async function confirmClaimToOwner(payload: ClaimPayload): Promise<boolean> {
  const text = [
    `Hi,`,
    '',
    `Thanks for claiming the listing for ${payload.businessName} on Candella.`,
    '',
    `We verify every claim before granting access \u2014 it usually takes a couple of days. We'll be in touch from this email address once we've checked. If we need to verify ownership another way (a quick DM from your business account, for example), we'll let you know.`,
    '',
    `In the meantime, if you have any questions or want to share specifics about your sustainability practices, just reply to this email.`,
    '',
    `Thanks,`,
    `Candella`,
    `https://candella-six.vercel.app`,
  ].join('\n')

  return sendEmail({
    to: payload.ownerEmail,
    subject: `Your claim for ${payload.businessName} is in review`,
    text,
    context: 'confirmClaimToOwner',
  })
}
