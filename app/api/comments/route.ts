import { NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity.client'

// Simple per-instance rate limiting (best-effort; resets on cold start).
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many comments. Please try again shortly.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const postId = typeof body.postId === 'string' ? body.postId.trim() : ''

  if (!name || name.length > 80) {
    return NextResponse.json({ error: 'A valid name is required.' }, { status: 400 })
  }
  if (!message || message.length < 2 || message.length > 2000) {
    return NextResponse.json(
      { error: 'Message must be between 2 and 2000 characters.' },
      { status: 400 }
    )
  }
  if (!postId) {
    return NextResponse.json({ error: 'Missing post reference.' }, { status: 400 })
  }

  try {
    await sanityWriteClient().create({
      _type: 'comment',
      name,
      message,
      post: { _type: 'reference', _ref: postId },
      approved: false,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json(
      { error: 'Could not submit comment. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
