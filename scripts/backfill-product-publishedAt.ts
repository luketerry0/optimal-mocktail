import { getCliClient } from 'sanity/cli'

// One-off migration: stamp `publishedAt` on already-published products that
// predate the auto-timestamp publish action. Only touches non-draft product
// documents that are missing `publishedAt`. Run with:
//   npx sanity exec scripts/backfill-product-publishedAt.ts --with-user-token
const client = getCliClient()

async function run() {
  const products: { _id: string; title?: string }[] = await client.fetch(
    `*[_type == "product" && !(_id in path("drafts.**")) && !defined(publishedAt)]{ _id, title }`
  )

  if (products.length === 0) {
    console.log('No published products missing publishedAt. Nothing to do.')
    return
  }

  const now = new Date().toISOString()
  let tx = client.transaction()
  for (const p of products) {
    console.log(`Stamping publishedAt on "${p.title ?? p._id}" (${p._id})`)
    tx = tx.patch(p._id, (patch) => patch.setIfMissing({ publishedAt: now }))
  }

  await tx.commit()
  console.log(`Done. Updated ${products.length} product(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
