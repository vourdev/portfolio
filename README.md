# vour.dev — Portfolio

A dark-mode, sidebar-style developer portfolio (inspired by aadi.is-a.dev) built
with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Aceternity UI**
components, and a **Prisma + SQLite** contact form.

## Sections

- **About** — animated hero (Aceternity `Spotlight`, `TextGenerateEffect`, `AnimatedTooltip`)
- **Projects** — Aceternity `BentoGrid`
- **Skills** — grouped badges + `InfiniteMovingCards` marquee
- **Experience** — Aceternity scroll `Timeline`
- **Stats** — live GitHub profile stats + `Meteors` cards
- **Contact** — `BackgroundBeams` + a working form that stores messages in a database

## Getting started

```bash
npm install
npm run db:push   # creates the SQLite database (prisma/dev.db)
npm run dev       # http://localhost:3000
```

## Editing your content

**Everything lives in [`src/lib/site.ts`](src/lib/site.ts)** — name, title, bio,
socials, projects, skills, experience and your GitHub handle. No JSX required.

| What | Where |
| --- | --- |
| Name, title, bio, email, socials | `src/lib/site.ts` → `siteConfig`, `socials`, `aboutParagraphs` |
| Projects / Skills / Experience | `src/lib/site.ts` → `projects`, `skillGroups`, `experiences` |
| Avatar | replace `public/avatar.svg` |
| Résumé | replace `public/resume.pdf` |
| GitHub stats handle | `siteConfig.githubUsername` |

## Contact form & database

The form posts to a **Server Action** (`src/app/actions.ts`) which validates the
input (plus a honeypot) and stores it via Prisma. View stored messages with:

```bash
npm run db:studio   # opens Prisma Studio
```

Local dev uses **SQLite** so it works with zero setup. **For production on
Vercel**, SQLite won't persist — switch to hosted Postgres:

1. Add a Postgres database (Neon / Supabase via the Vercel Marketplace).
2. In `prisma/schema.prisma` change `provider = "sqlite"` → `provider = "postgresql"`.
3. Set `DATABASE_URL` to your Postgres connection string.
4. Run `npx prisma db push`.

## GitHub Stats

The Stats section fetches public profile data from the GitHub API (cached 1h). If
the handle doesn't resolve it shows placeholder numbers. Set
`siteConfig.githubUsername` to your handle to show live contribution graphs.

> Real **traffic** (repo views/clones) requires an authenticated token and only
> works for repos you own. Set `GITHUB_TOKEN` in `.env` to raise the rate limit
> and enable token-based requests.
