# Lara Aoieong's Nutrition Blog

Personal blog for Lara Aoieong, a dietitian student, built with Next.js App Router.

## Overview
- Dynamic post pages at `/posts/[slug]`
- Homepage with topic filters and keyword search
- AI translation toolbar on each article page
- Bilingual reading modes: Original, Translation, and Bilingual
- Server-side translation API with in-memory caching by post + language
- Global site settings loaded from Sanity (with fallback defaults)

## AI Translation Experience
Each post page includes a translation toolbar with:
- Target language selector (Traditional Chinese, English, Japanese)
- `Translate this article` button (manual, no auto-translate on page load)
- Display mode switch (`Original`, `Translation`, `Bilingual`)

Behavior:
- Translation is generated only after user action.
- Paragraphs are translated and returned as structured pairs:

```json
[
  { "original": "paragraph 1", "translated": "..." },
  { "original": "paragraph 2", "translated": "..." }
]
```

- `Bilingual` mode renders each translated paragraph directly below its original paragraph.
- Loading, success, and error/retry states are shown in the toolbar.
- If translation fails, original content still renders normally.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- Docker / Docker Compose (optional)

## Project Structure
- `app/page.js`: homepage
- `app/posts/[slug]/page.js`: post detail page
- `app/api/translate/route.js`: secure server-side translation endpoint
- `components/PostTranslator.js`: translation orchestration on post page
- `components/TranslationToolbar.js`: reusable translation controls
- `components/BilingualParagraphRenderer.js`: reusable paragraph rendering modes
- `lib/posts.js`: post data and helper functions
- `lib/translation.js`: shared translation config/helpers
- `lib/siteSettings.js`: Sanity-backed global settings fetch + defaults
- `sanity/schemaTypes/siteSettings.js`: singleton global settings schema
- `sanity/deskStructure.js`: singleton desk structure for settings
- `sanity.config.js`: Sanity Studio config
- `app/globals.css`: global styles

## Local Development
1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Configure `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=
```

Notes:
- `SANITY_API_READ_TOKEN` is optional. Add it if your dataset is private or if you need authenticated reads.
- If Sanity env vars are missing or Sanity is unavailable, the app falls back to built-in defaults.

## Editable Global Site Settings (Sanity)
MVP editable fields:
- `siteTitle`
- `navigationItems` (`label`, `href`)
- `heroTitle`
- `heroSubtitle`
- `aboutTitle`
- `aboutBody`
- `newsletterTitle`
- `newsletterDescription`
- `footerCopyrightText`
- `footerRightText`

The frontend reads these fields from a singleton `siteSettings` document and safely falls back to defaults when values are missing.

## How To Edit These Fields In CMS
1. Ensure your Sanity project has the schema from `sanity/schemaTypes/siteSettings.js`.
2. Ensure your Studio uses `sanity.config.js` and `sanity/deskStructure.js` (this enforces a singleton settings doc).
3. Open Sanity Studio and go to `Site Settings`.
4. Edit the fields and publish.
5. Refresh your site; changes appear after cache revalidation (up to about 60 seconds).

3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Docker
1. Ensure Docker Desktop is running.
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
3. Build and run:

```bash
docker compose up --build
```

4. Open `http://localhost:3000`.

## Adding a New Post
Create a new entry in `lib/posts.js` with:
- `slug`
- `title`
- `excerpt`
- `topic`
- `date` (`YYYY-MM-DD`)
- `readTime`
- `content` (array of paragraph strings)

New posts are automatically available at `/posts/<slug>`.
