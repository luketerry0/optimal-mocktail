import { draftMode } from 'next/headers'

// Revalidate tags used by posts
export const POST_REVALIDATE_TAG = 'posts'

export async function enableDraftMode() {
  const draft = await draftMode()
  draft.enable()
}

export async function disableDraftMode() {
  const draft = await draftMode()
  draft.disable()
}

export async function isDraftMode() {
  const draft = await draftMode()
  return draft.isEnabled
}

// Preview is on when draft mode is explicitly enabled (via the draft-mode
// route), when running on a Vercel preview deployment, OR when the deployment
// is explicitly flagged as a permanent preview site via PREVIEW_SITE=true.
// The PREVIEW_SITE flag lets a dedicated, always-on hosted deployment surface
// drafts without depending on the branch/commit it was built from.
export async function isPreviewEnabled() {
  if (process.env.PREVIEW_SITE === 'true') return true
  if (process.env.VERCEL_ENV === 'preview') return true
  const draft = await draftMode()
  return draft.isEnabled
}
