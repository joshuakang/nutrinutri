# NutriNotes Next.js Blog

This project is now a React/Next.js blog starter using the App Router, with real dynamic post pages.

## Features
- Next.js App Router structure (`app/`)
- Dynamic article routes at `/posts/[slug]`
- Homepage topic filters + search
- AI post translator on each article page (`/api/translate`)
- Shared post data module (`lib/posts.js`)
- Reused visual style from your original static design

## Project Structure
- `app/page.js` - homepage
- `app/posts/[slug]/page.js` - single post template
- `components/PostsExplorer.js` - filter/search + post cards
- `lib/posts.js` - post data and helper functions
- `app/globals.css` - global styles

## Run locally
0. Add environment variable:

```bash
cp .env.example .env.local
```

Then set `OPENAI_API_KEY` in `.env.local`.

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Run with Docker
1. Ensure Docker Desktop is running.
2. Create `.env` from the example and set `OPENAI_API_KEY`.
3. Build and start:

```bash
docker compose up --build
```

4. Open `http://localhost:3000`.

## Add new blog posts
Add entries in `lib/posts.js` with:
- `slug`
- `title`
- `excerpt`
- `topic`
- `date` (`YYYY-MM-DD`)
- `readTime`
- `content` (array of paragraphs)

Each post is automatically available at `/posts/<slug>`.
