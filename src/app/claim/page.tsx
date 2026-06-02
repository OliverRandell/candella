'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ClaimState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; businessName: string; email: string }
  | { kind: 'error'; message: string }

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function ClaimForm() {
  const searchParams = useSearchParams()
  const prefillSlug = searchParams.get('business') ?? ''

  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<ClaimState>({ kind: 'idle' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {}
    if (businessName.trim().length < 2) errors.businessName = 'Please enter the business name.'
    if (!email.trim()) {
      errors.email = 'We need an email to verify your claim.'
    } else if (!isValidEmail(email)) {
      errors.email = "That email doesn't look right."
    }
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
    const trimmedName = businessName.trim()
    const trimmedEmail = email.trim()

    let businessId: string | null = null
    if (prefillSlug) {
      const { data } = await supabase.from('businesses').select('id').eq('slug', prefillSlug).single()
      businessId = data?.id ?? null
    }

    const { error } = await supabase.from('claims').insert({
      business_id: businessId,
      email: trimmedEmail,
      business_name: trimmedName,
      status: 'pending',
    })

    if (error) {
      console.error('[claim] insert failed:', error)
      setState({ kind: 'error', message: 'Something went wrong. Please try again, or email us at hello@henka.com.au.' })
      return
    }

    fetch('/api/email/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: trimmedName,
        businessSlug: prefillSlug || null,
        ownerEmail: trimmedEmail,
        message: message.trim() || null,
      }),
    }).catch(err => console.error('[claim] email notification failed:', err))

    setState({ kind: 'success', businessName: trimmedName, email: trimmedEmail })
  }

  if (state.kind === 'success') {
    return <SuccessView businessName={state.businessName} email={state.email} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      <Field id="businessName" label="Business name" error={fieldErrors.businessName} required
        hint={prefillSlug ? "We've prefilled this from the listing you came from." : "The name as it appears on your listing."}>
        <input id="businessName" type="text" value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="e.g. Monk Bodhi Dharma" className={inputClassName(fieldErrors.businessName)} required />
      </Field>

      <Field id="email" label="Your email" error={fieldErrors.email} required
        hint="Use an email associated with the business — we'll verify ownership through this address.">
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@yourbusiness.com.au" className={inputClassName(fieldErrors.email)} required />
      </Field>

      <Field id="message" label="Anything you'd like to add?"
        hint="Optional. Tell us about your sustainability practices, certifications, or anything that helps us verify your claim.">
        <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)}
          placeholder="e.g. We're B Corp certified, we source organic ingredients from local growers, and we've been operating since 2018."
          className={inputClassName() + ' resize-y'} />
      </Field>

      {state.kind === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <div className="pt-2">
        <button type="submit" disabled={state.kind === 'submitting'}
          className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {state.kind === 'submitting' ? 'Submitting…' : 'Submit claim request'}
        </button>
        <p className="text-xs text-stone-400 mt-3">
          We verify all claims before granting access. No spam, ever.
        </p>
      </div>
    </form>
  )
}

export default function ClaimPage() {
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
        <header className="mb-10">
          <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-3">
            Claim a listing
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-4">
            Claim your business on Henka.
          </h1>
          <p className="text-stone-600 leading-relaxed">
            Own or manage a business that&rsquo;s already on Henka? Claim your listing to
            update your details, add photos, and get a verified owner badge. We verify
            every claim before granting access.
          </p>
        </header>
        <Suspense fallback={<div className="text-sm text-stone-400">Loading&hellip;</div>}>
          <ClaimForm />
        </Suspense>
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

function SuccessView({ businessName, email }: { businessName: string; email: string }) {
  return (
    <div className="py-10 md:py-16">
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-6 h-6 text-stone-700" aria-hidden="true">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.41 0l-3.5-3.5a1 1 0 011.41-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-4">
        Claim received.
      </h1>
      <div className="text-stone-700 leading-relaxed space-y-4 mb-8">
        <p>
          Your claim for <span className="font-medium">{businessName}</span> is in our queue.
          We&rsquo;ve sent a confirmation to <span className="font-medium">{email}</span>.
          We&rsquo;ll usually be in touch within a couple of days.
        </p>
        <p>
          If we need to verify ownership another way &mdash; a quick DM from your business
          account, for example &mdash; we&rsquo;ll let you know.
        </p>
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
