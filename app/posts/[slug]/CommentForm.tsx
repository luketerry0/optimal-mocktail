'use client'

import { useState, type FormEvent } from 'react'

export function CommentForm({ postId }: { postId: string }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, postId, website }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
      setName('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          Thanks! Your comment was submitted and will appear after it&apos;s approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment-name" className="mb-1 block text-sm font-medium text-navy">
          Name
        </label>
        <input
          id="comment-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          className="w-full rounded-lg border border-navy-100 px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div>
        <label htmlFor="comment-message" className="mb-1 block text-sm font-medium text-navy">
          Comment
        </label>
        <textarea
          id="comment-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={2}
          maxLength={2000}
          rows={4}
          className="w-full rounded-lg border border-navy-100 px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Honeypot field — hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="comment-website">Website</label>
        <input
          id="comment-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-full bg-accent px-6 py-2.5 font-semibold text-white transition hover:bg-accent-dark disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting…' : 'Post Comment'}
      </button>
    </form>
  )
}
