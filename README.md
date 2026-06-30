# Optimal Mocktail - Food Blog

A modern food blog for mocktail recipes built with **Next.js**, **Tailwind CSS**, and **Sanity CMS**.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity (headless)
- **Content Delivery**: Sanity CDN
- **Analytics**: Vercel Analytics (per-page tracking)
- **Hosting**: Vercel
- **CI/CD**: GitHub + Vercel (auto-deploy `main` → production)

### Live URLs

- **Production** (published content only): https://optimalmocktail.com
- **Permanent preview** (shows draft content, access-protected for the client): https://optimal-mocktail-preview.vercel.app

### Vercel project

- Team: `luke-terry-s-projects`
- Project: `optimal-mocktail`
- Sanity project ID: `nk7k994x` / dataset `production`

## Getting Started

### Prerequisites

- Node.js 20+ (verified)
- npm or yarn
- A Sanity.io account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/luketerry0/optimal-mocktail.git
cd optimal-mocktail
npm install
```

2. **Set up environment variables**

Create a `.env.local` file in the project root with the values below. The same
variables must also be configured in the Vercel project (Settings → Environment
Variables) for Production **and** Preview environments.

```
# --- Sanity (public, required everywhere) ---
NEXT_PUBLIC_SANITY_PROJECT_ID=nk7k994x
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-01

# --- Draft / preview support ---
# Token with read access to drafts. Required for preview deployments and the
# Studio "Preview" button. Create at https://www.sanity.io/manage (Project → API → Tokens).
SANITY_API_TOKEN=sk_your_read_token

# Token with write access. Required only for the comments feature.
SANITY_API_WRITE_TOKEN=sk_your_write_token

# Shared secret guarding the /api/draft-mode route used by the Studio preview button.
NEXT_PUBLIC_PREVIEW_SECRET=any_random_string

# Set to 'true' ONLY on the permanent preview deployment to always serve drafts.
# Leave unset locally and in production. (On normal Vercel previews, VERCEL_ENV=preview
# already enables drafts automatically.)
# PREVIEW_SITE=true

# --- Sanity Studio (sanity.config.ts / sanity.cli.ts) ---
SANITY_STUDIO_PROJECT_ID=nk7k994x
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

> **How drafts get shown:** `lib/draft-mode.ts` enables draft content when
> `PREVIEW_SITE=true`, when `VERCEL_ENV=preview`, or when Next.js draft mode is
> toggled via the Studio preview button. The home/posts listings use
> `force-dynamic` so drafts always appear on preview deployments.

3. **Create a Sanity project**

- Go to [sanity.io](https://www.sanity.io/)
- Create a new project
- Note your Project ID and Dataset name
- Add these to `.env.local`

### Development

```bash
# Start the Next.js dev server
npm run dev

# In another terminal, start the Sanity Studio
npm run studio
```

- App will be available at `http://localhost:3000`
- Sanity Studio will be available at `http://localhost:3333` (or as configured)

### Building

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout with header/footer + Analytics
│   ├── page.tsx         # Homepage (force-dynamic for drafts)
│   ├── SiteHeader.tsx   # Navy nav bar
│   ├── Analytics.tsx    # Per-page Vercel Analytics wrapper
│   ├── about/
│   │   └── page.tsx     # About page (CDN + ISR)
│   ├── posts/
│   │   ├── page.tsx     # All posts listing
│   │   └── [slug]/
│   │       └── page.tsx # Single post (recipe card, internal links)
│   ├── api/draft-mode/  # Studio preview-button entry point
│   └── globals.css      # Tailwind styles
├── lib/
│   ├── sanity.client.ts # Sanity clients (public CDN, preview, write)
│   ├── sanity.image.ts  # Image URL builder
│   └── draft-mode.ts    # isPreviewEnabled() draft logic
├── sanity/
│   └── schema/          # Content schema definitions
│       ├── index.ts
│       ├── post.ts      # Post schema (internal/external link marks)
│       ├── recipe.ts    # Recipe block (ingredients, relatedPosts)
│       └── about.ts     # About page document
├── sanity.config.ts     # Sanity Studio configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── package.json
```

## Content Model

Schemas live in `sanity/schema/`. After changing any schema you must redeploy the
Studio: `npx sanity deploy`.

### Post

- `title` (string, required) – Post title
- `slug` (slug, required) – URL-friendly identifier
- `excerpt` (string) – Short description (max 200 chars)
- `image` (image) – Featured image
- `body` (portable text) – Rich text with images, YouTube embeds, and recipe cards
- `publishedAt` (datetime, required) – Publication date
- `author` (string) – Author name

**Body links:** the portable-text editor supports two link marks:
- `internalLink` – reference to another post (renders an in-app `next/link`)
- `link` – external URL (opens in a new tab)

### Recipe (inline block within a post body)

- `ingredients`, `instructions` – lists rendered on the recipe card
- `relatedPosts` – references to other posts, rendered as clickable chips

### About

Single `about` document powering `/about`, fetched from the Sanity CDN with 60s
ISR. Fields: `heading` (required), `subheading`, `body`, `ctaHeading`, `ctaText`,
`ctaButtonLabel`. If no `about` document exists, the page renders built-in
fallback copy.

## Deployment

### Production

Pushing to `main` auto-deploys to production (https://optimalmocktail.com).
Make sure every environment variable listed above is configured in the Vercel
project for the **Production** environment.

### Permanent preview deployment (for the client)

There is a stable, always-on preview URL that shows **draft** content so a
non-technical client can review unpublished work:

> https://optimal-mocktail-preview.vercel.app

To push the current local code to that preview URL:

```bash
npm run publish-preview
```

This runs `vercel alias set $(vercel deploy --yes) optimal-mocktail-preview.vercel.app`
– it builds a fresh Vercel **preview** deployment and re-points the permanent
alias to it. (Content edits in Sanity appear automatically; you only need this
script to ship code changes.)

**First-time setup on a new device:**

1. Install the Vercel CLI: `sudo npm i -g vercel` (or `npx vercel`)
2. Log in: `vercel login`
3. Link the local folder to the project: `vercel link`
   (team `luke-terry-s-projects`, project `optimal-mocktail`)
4. Confirm Preview-env variables exist: `vercel env ls preview`
   – must include `SANITY_API_TOKEN` and the `NEXT_PUBLIC_SANITY_*` vars.

**Client access control:** the preview is gated by Vercel Deployment Protection.
For a non-technical client, enable **Password Protection** (Vercel Pro) under
Project → Settings → Deployment Protection so they only need a shared password
(otherwise the default Vercel Authentication requires a Vercel account/invite).

### Analytics

Vercel Analytics is wired up in `app/Analytics.tsx` and passes the current
pathname so each page (including individual posts) is tracked separately instead
of being grouped under `/posts/[slug]`.

### CI/CD Flow

1. Write/edit content in Sanity Studio (drafts visible on the preview URL)
2. Push code to `main` → Vercel auto-deploys production
3. Run `npm run publish-preview` to update the client preview URL with code changes

## Next Steps

- [ ] Set up Sanity project and get Project ID
- [ ] Connect GitHub repo to Vercel
- [ ] Add Supabase for comments (future)
- [ ] Add Supabase for auth (future)
- [ ] Customize styling and branding

## Environment Variables

See `.env.local.example` for all available options.

## Troubleshooting

### "Cannot find module" errors

Make sure you've run `npm install` and the `.env.local` file is properly configured.

### Sanity Studio errors

Verify your project ID and dataset name in `.env.local` match your Sanity project.

### Images not loading

Ensure your Next.js config allows Sanity CDN (`cdn.sanity.io`). Check `next.config.js`.

## License

ISC

## Support

For issues or questions, please open a GitHub issue.
