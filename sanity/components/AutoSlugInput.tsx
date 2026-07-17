import { useEffect } from 'react'
import { set, unset, useFormValue, PatchEvent, type ObjectInputProps, type SlugValue } from 'sanity'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * Read-only slug input that auto-generates its value from the document title.
 * The user cannot type a slug manually, which prevents invalid slugs (e.g. with
 * spaces) that would cause 404s.
 */
export function AutoSlugInput(props: ObjectInputProps<SlugValue>) {
  const { onChange, value } = props
  const title = useFormValue(['title']) as string | undefined
  const generated = title ? slugify(title) : ''
  const current = value?.current

  useEffect(() => {
    if (generated === current) return
    if (generated) {
      onChange(PatchEvent.from(set({ _type: 'slug', current: generated })))
    } else {
      onChange(PatchEvent.from(unset()))
    }
  }, [generated, current, onChange])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          padding: '10px 12px',
          border: '1px solid var(--card-border-color, #e3e4e8)',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: 13,
          color: current ? 'inherit' : '#8b8f96',
        }}
      >
        {current ? `/posts/${current}` : 'Add a title to generate the slug automatically.'}
      </div>
      <div style={{ fontSize: 12, color: '#8b8f96' }}>
        The slug is generated automatically from the title and cannot be edited manually.
      </div>
    </div>
  )
}
