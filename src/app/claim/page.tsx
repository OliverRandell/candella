'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function ClaimForm() {
  const searchParams = useSearchParams()
  const prefillSlug = searchParams.get('business') ?? ''

  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const supabase = createClient()

    // Find the business by slug if prefilled
    let businessId: string | null = null
    if (prefillSlug) {
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', prefillSlug)
        .single()
      businessId = data?.id ?? null
    }

    const { error } = await supabase
      .from('claims')
      .insert({
        business_id: businessId,
        email,
        business_name: businessName,
        status: 'pending',
      })

    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-stone-900 mb-2">
          Request received
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          We'll be in touch at {email} within 2 business days.
        </p>
        <Link
          href="/businesses"
          className="text-sm text-emerald-600 hover:underline"
        >
          Back to listings
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5">
          Business name
        </label>
        <input
          type="text"
          required
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="e.g. Monk Bodhi Dharma"
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5">
          Your email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@yourbusiness.com.au"
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5">
          Anything you'd like to add? <span className="text-stone-300">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tell us about your sustainability practices..."
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
        />
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-500">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit claim request'}
      </button>
      <p className="text-xs text-stone-400 text-center">
        We verify all claims before granting access. No spam, ever.
      </p>
    </form>
  )
}

export default function ClaimPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          candella
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-400">Claim your listing</span>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Claim your listing
        </h1>
        <p className="text-stone-500 text-sm mb-8">
          Own or manage a business on Candella? Claim it to update your details,
          add sustainability credentials, and get a verified badge.
        </p>
        <Suspense fallback={<div className="text-sm text-stone-400">Loading...</div>}>
          <ClaimForm />
        </Suspense>
      </div>
    </main>
  )
}