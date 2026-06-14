import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  // Validate the secret
  if (secret !== process.env.NEXT_PUBLIC_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // Redirect to the referrer or home
  const redirectTo = searchParams.get('redirect') || '/'
  redirect(redirectTo)
}
