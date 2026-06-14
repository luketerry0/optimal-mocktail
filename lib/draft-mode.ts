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
