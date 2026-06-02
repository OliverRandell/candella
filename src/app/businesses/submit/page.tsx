'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/categories'
import { CRITERIA_NAMES } from '@/lib/criteria'

type SubmissionState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; businessName: string }
  | { kind: 'error'; message: string }

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value: string): boolean {
  if (!value) return true
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    return url.hostname.includes('.')
  } catch {
    return false
  }
}

function normaliseUrl(value: string): string {
  if (!value) return ''
  return value.startsWith('http') ? value : `https://${value}`
}

export default function SubmitBusinessPage() {
  const [name, setName] = useState('')
  const [suburb, setSuburb] = useState('')
  const [category, setCategory] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [submissionNotes, setSubmissionNotes] = useState('')
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([])
  const [state, setState] = useState<SubmissionState>({ kind: 'idle' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function toggleCriterion(criterion: string) {
    setSelectedCriteria(prev =>
      prev.includes(criterion)
        ? prev.filter(c => c !== criterion)
        : [...prev, criterion]
    )
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {}
    if (name.trim().length < 2) errors.name = 'Please enter the business name.'
    if (!suburb.trim()) errors.suburb = 'Please enter the suburb.'
    if (!category) errors.category = 'Please select a category.'
    if (!submitterEmail.trim()) {
      errors.submitterEmail = 'We need an email to follow up.'
    } else if (!isValidEmail(submitterEmail)) {
      errors.submitterEmail = "That email doesn't look right."
    }
    const hasContact = website.trim() || instagram.trim()
    if (!hasContact) errors.website = 'A website or Instagram URL helps us verify the business.'
    if (website && !isValidUrl(website)) errors.website = "That URL doesn't look right."
    if (instagram && !isValidUrl(instagram)) errors.instagram = "That Instagram URL doesn't look right."
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      document.getElementById(Object.keys(errors)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setState({ kind: 'submitting' })
    const supabase = createClient()
    const trimmedName = name.trim()
    const trimmedEmail = submitterEmail.trim()

    const { error } = await supabase.from('businesses').insert({
      name: trimmedName,
      slug: generateSlug(trimmedName),
      suburb: suburb.trim(),
      city: 'Melbourne',
      state: 'VIC',
      category,
      description: description.trim() || null,
      address: address.trim() || null,
      website_url: website ? normaliseUrl(website) : null,
      instagram_url: instagram ? normaliseUrl(instagram) : null,
      criteria: selectedCriteria,
      tags: [],
      submitted_email: trimmedEmail,
      submission_notes: submissionNotes.trim() || null,
      status: 'pending',
    })

    if (error) {
      console.error('[submit] insert failed:', error)
      setState({ kind: 'error', message: 'Something went wrong submitting. Please try again, or email us at hello@henka.com.au if it keeps failing.' })
      return
    }

    fetch('/api/email/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: trimmedName, suburb: suburb.trim(), category,
        website: website ? normaliseUrl(website) : null,
        instagram: instagram ? normaliseUrl(instagram) : null,
        description: description.trim() || null,
        address: address.trim() || null,
        submissionNotes: submissionNotes.trim() || null,
        criteria: selectedCriteria, submitterEmail: trimmedEmail,
      }),
    }).catch(err => console.error('[submit] email notification failed:', err))

    setState({ kind: 'success', businessName: trimmedName })
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-stone-900"
          style={{ letterSpacing: '-0.092em', fontFamily: '"Garet", "Quicksand", sans-serif' }}>
          henka.
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">About</Link>
          <Link href="/businesses" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Browse all</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        {state.kind === 'success' ? (
          <SuccessView businessName={state.businessName} />
        ) : (
          <>
            <header className="mb-10">
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
                Submit a business
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-4">
                Know a business that should be on Henka?
              </h1>
              <p className="text-stone-600 leading-relaxed">
                Tell us about it. We review every submission and follow up by email.
                Submissions don&rsquo;t appear on the directory until we&rsquo;ve checked them.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-7" noValidate>
              <Field id="name" label="Business name" error={fieldErrors.name} required>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Bhumi" className={inputClassName(fieldErrors.name)} required />
              </Field>

              <Field id="suburb" label="Suburb" error={fieldErrors.suburb} required hint="Where in Melbourne are they based?">
                <input id="suburb" type="text" value={suburb} onChange={e => setSuburb(e.target.value)}
                  placeholder="e.g. Collingwood" className={inputClassName(fieldErrors.suburb)} required />
              </Field>

              <Field id="category" label="Category" error={fieldErrors.category} required>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)}
                  className={inputClassName(fieldErrors.category) + ' bg-white'} required>
                  <option value="">Select a category&hellip;</option>
                  {CATEGORY_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>

              <Field id="website" label="Website" error={fieldErrors.website} hint="Either a website or Instagram is required.">
                <input id="website" type="text" value={website} onChange={e => setWebsite(e.target.value)}
                  placeholder="e.g. bhumi.com.au" className={inputClassName(fieldErrors.website)} />
              </Field>

              <Field id="instagram" label="Instagram" error={fieldErrors.instagram}>
                <input id="instagram" type="text" value={instagram} onChange={e => setInstagram(e.target.value)}
                  placeholder="e.g. instagram.com/bhumi" className={inputClassName(fieldErrors.instagram)} />
              </Field>

              <Field id="address" label="Address" hint="Optional. Helps if they have a physical location.">
                <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 108 Wellington St, Collingwood" className={inputClassName()} />
              </Field>

              <Field id="description" label="Short description" hint="Optional. One or two sentences about the business.">
                <textarea id="description" rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="What do they do? What's their thing?"
                  className={inputClassName() + ' resize-none'} />
              </Field>

              <Field id="submissionNotes" label="What makes them sustainable?"
                hint="Optional but helpful. The more specific, the better — suppliers, certifications, materials, practices.">
                <textarea id="submissionNotes" rows={5} value={submissionNotes} onChange={e => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. They source organic cotton from a single farm in NSW, do all their dyeing locally, and the founder is open about which suppliers they're still working to verify."
                  className={inputClassName() + ' resize-y'} />
              </Field>

              <Field id="criteria" label="Which criteria do they meet?" hint="Optional. Pick any that apply — we'll verify before listing.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-1">
                  {CRITERIA_NAMES.map(criterion => (
                    <label key={criterion} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <input type="checkbox" checked={selectedCriteria.includes(criterion)}
                        onChange={() => toggleCriterion(criterion)}
                        className="w-4 h-4 rounded border-stone-300 text-stone-600 focus:ring-stone-400" />
                      <span className="text-sm text-stone-700 group-hover:text-stone-900">{criterion}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field id="submitterEmail" label="Your email" error={fieldErrors.submitterEmail} required
                hint="So we can confirm receipt and follow up. We don't share it.">
                <input id="submitterEmail" type="email" value={submitterEmail}
                  onChange={e => setSubmitterEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClassName(fieldErrors.submitterEmail)} required />
              </Field>

              {state.kind === 'error' && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-800">{state.message}</p>
                </div>
              )}

              <div className="pt-2">
                <button type="submit" disabled={state.kind === 'submitting'}
                  className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {state.kind === 'submitting' ? 'Submitting…' : 'Submit for review'}
                </button>
                <p className="text-xs text-stone-400 mt-3">
                  We review every submission. You'll hear back by email within a few days.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

function Field({ id, label, hint, error, required, children }: {
  id: string; label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-1">
        {label}
        {required && <span className="text-stone-400 ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && !error && <p className="text-xs text-stone-500 mb-2 leading-relaxed">{hint}</p>}
      {error && <p className="text-xs text-red-600 mb-2 leading-relaxed">{error}</p>}
      {children}
    </div>
  )
}

function SuccessView({ businessName }: { businessName: string }) {
  return (
    <div className="py-10 md:py-16">
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-6 h-6 text-stone-700" aria-hidden="true">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.41 0l-3.5-3.5a1 1 0 011.41-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-4">
        Thanks &mdash; we&rsquo;ve got it.
      </h1>
      <div className="text-stone-700 leading-relaxed space-y-4 mb-8">
        <p>
          Your submission for <span className="font-medium">{businessName}</span> is in our queue.
          We review every business by hand &mdash; it might take a few days. We&rsquo;ve sent a
          confirmation to your email. We&rsquo;ll follow up either way.
        </p>
        <p>If you know anyone else who&rsquo;d belong here, we&rsquo;d love to hear about them too.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/businesses" className="inline-block bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors">
          Browse the directory
        </Link>
        <Link href="/about" className="inline-block border border-stone-200 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-full hover:border-stone-400 hover:bg-stone-50 transition-colors">
          Read about our standard
        </Link>
      </div>
    </div>
  )
}

function inputClassName(error?: string): string {
  return [
    'w-full border rounded-xl px-4 py-2.5 text-sm text-stone-900',
    'placeholder:text-stone-300 focus:outline-none transition-colors',
    error ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-stone-400',
  ].join(' ')
}
