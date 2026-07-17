import { useEffect, useState } from 'react'
import { useDocumentOperation, type DocumentActionComponent } from 'sanity'

/**
 * Publish action that stamps `publishedAt` with the current time the first
 * time a document is published. Uses setIfMissing so re-publishing later edits
 * keeps the original publish date.
 */
export const PublishWithTimestamp: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // Once the draft is gone, publishing has completed.
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, props.draft])

  return {
    disabled: Boolean(publish.disabled),
    label: isPublishing ? 'Publishing…' : 'Publish',
    onHandle: () => {
      setIsPublishing(true)
      patch.execute([{ setIfMissing: { publishedAt: new Date().toISOString() } }])
      publish.execute()
      props.onComplete()
    },
  }
}
