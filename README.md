# DevLink

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue)](https://dev-link-eight-jet.vercel.app)

**Live Demo**: https://dev-link-eight-jet.vercel.app

DevLink is a modern job marketplace that connects **job seekers** and **employers** in a single platform. Seekers can discover roles, save and share jobs, and manage their profile and resume. Employers can manage company presence and job postings from a dedicated dashboard.

## Features

### Job Seeker

- Browse job listings
- Save / unsave jobs
- Share jobs via a dedicated share page
- Profile editor (skills, experience, education)
- Resume upload and management
- Settings and notifications pages

### Employer

- Employer dashboard
- Company profile management
- Create and manage job listings
- Candidate / application workflow (via API + dashboard screens)

### Admin

- Admin dashboard and user settings screens

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React, Tailwind CSS, Radix UI
- **Data fetching / caching**: TanStack React Query
- **Auth & backend**: Supabase
- **Icons & UI utilities**: lucide-react, sonner, react-hot-toast

## Demo Login

- **Seeker**
  - Email: `lenehod633@alibto.com`
  - Password: `090909`

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- pnpm

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Open: http://localhost:3000

### Production build

```bash
pnpm build
pnpm start
```

## Environment Variables

Create a `.env.local` file in the `job-marketplace/` folder.

### Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Demo / Test Accounts (shown on the Login page)

```bash
NEXT_PUBLIC_DEMO_SEEKER_EMAIL=lenehod633@alibto.com
NEXT_PUBLIC_DEMO_SEEKER_PASSWORD=090909

# Optional employer demo (only if you have a real Supabase Auth user for it)
NEXT_PUBLIC_DEMO_EMPLOYER_EMAIL=hotaviv151@alibto.com
NEXT_PUBLIC_DEMO_EMPLOYER_PASSWORD=090909
```

Important:
- Demo credentials must correspond to **real Supabase Auth users** (Supabase Dashboard → Authentication → Users).
- The app routes based on `user_metadata.role` (for example: `seeker`, `employer`). Make sure demo users have the correct role metadata.

## Deployment (Vercel)

- Add the same environment variables in Vercel Project Settings.
- Recommended:
  - Install Command: `pnpm install`
  - Build Command: `pnpm build`

### Lockfile note

If you see “multiple lockfiles” warnings, keep `pnpm-lock.yaml` and remove stray `package-lock.json` files so Vercel installs consistently.

## Security

Keep Next.js and dependencies updated to receive security patches.

## License

MIT (or replace with your preferred license)
