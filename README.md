# Optimal Mocktail - Food Blog

A modern food blog for mocktail recipes built with **Next.js**, **Tailwind CSS**, and **Sanity CMS**.

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Sanity (headless)
- **Content Delivery**: Sanity CDN
- **Hosting**: Vercel (recommended)
- **CI/CD**: GitHub + Vercel (auto-deploy on push)

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

Copy `.env.local.example` to `.env.local` and fill in your Sanity project details:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-01
```

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
│   ├── layout.tsx       # Root layout with header/footer
│   ├── page.tsx         # Homepage
│   ├── posts/
│   │   ├── page.tsx     # All posts listing
│   │   └── [slug]/
│   │       └── page.tsx # Single post page
│   └── globals.css      # Tailwind styles
├── lib/
│   └── sanity.client.ts # Sanity client configuration
├── sanity/
│   ├── schema/          # Content schema definitions
│   │   ├── index.ts
│   │   └── post.ts      # Blog post schema
│   └── ...
├── sanity.config.ts     # Sanity Studio configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── package.json
```

## Content Model

### Post

The blog uses a simple `Post` schema with the following fields:

- `title` (string, required) - Post title
- `slug` (slug, required) - URL-friendly identifier
- `excerpt` (string) - Short description (max 200 chars)
- `image` (image) - Featured image
- `body` (portable text) - Rich text content with images
- `publishedAt` (datetime, required) - Publication date
- `author` (string) - Author name

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Sign in to [vercel.com](https://vercel.com/)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
5. Deploy!

Vercel will automatically deploy on every push to `main` branch.

### CI/CD Flow

1. Write/edit content in Sanity Studio
2. Push code changes to GitHub
3. Vercel automatically builds and deploys the site
4. Site updates are live

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
