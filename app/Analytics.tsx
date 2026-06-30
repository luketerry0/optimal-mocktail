'use client'

import { usePathname } from 'next/navigation'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

// Pass the real pathname as both `route` and `path` so Vercel Web Analytics
// records each page individually instead of collapsing dynamic routes (e.g.
// every article under "/posts/[slug]"). Each article then appears as its own
// entry in the dashboard.
export function Analytics() {
  const pathname = usePathname()
  return <VercelAnalytics framework="next" route={pathname} path={pathname} />
}
