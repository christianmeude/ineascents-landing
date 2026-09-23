# Inea Scents — Landing

Marketing landing page and inquiry entry point for Inea Scents.

Live: https://ineascents.vercel.app

## Ecosystem

- Landing (this repo): https://ineascents.vercel.app
- App: https://ineascents-app.vercel.app
- Backend API: https://ineascents.onrender.com

This repo relies on the backend for data. It creates Inquiries only, never Bookings.

## Prerequisites

Pinned to `package.json`:

- Node.js (active LTS; satisfies Vite ^8.2.0) + npm
- Dependencies: `react` ^19.2.8, `react-dom` ^19.2.8, `tailwindcss` ^4.3.3, `@tailwindcss/vite` ^4.3.3, `@tailwindcss/postcss` ^4.3.3, `postcss` ^8.5.26
- Dev: `typescript` ~6.0.2, `vite` ^8.2.0, `@vitejs/plugin-react` ^6.0.4, `oxlint` ^1.75.0, `@types/react` ^19.2.17, `@types/react-dom` ^19.2.3, `@types/node` ^24.13.3

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Dev server is typically at `http://localhost:5173`.

## Env contract

Copy `.env.example` to `.env.local` (names only, never real values):

- `VITE_API_URL` — backend base URL.
  - Local: `http://127.0.0.1:8000`
  - Production: `https://ineascents.onrender.com`
- `VITE_FRONTEND_URL` — mobile app base URL for the "Book in App" button.
  - Production: `https://ineascents-app.vercel.app`
  - Local: paste your current Flutter-web URL with its ephemeral port, e.g. `http://localhost:62409` (Flutter web uses ephemeral local ports, so this changes per run). Code appends `/#/login` unless the value already contains a hash (`src/App.tsx:133-137`).

## Inquiry-only contract

- Contact form posts to `POST /api/inquiries` (`src/App.tsx:181-192`).
- This repo creates Inquiries only, never Bookings (no booking references in `src/`).
- Backend rate-limits the endpoint with `throttle:10,1` (`ineascents-backend/routes/api.php:18`).

## Scripts

From `package.json`:

- `npm run dev` — start Vite dev server
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — `oxlint`
- `npm run preview` — `vite preview`

## Book in App

"Book in App" buttons (`src/App.tsx:509-514`, `src/App.tsx:729-734`) link to the app login via `appLoginUrl()` (`src/App.tsx:133-137`): env base `VITE_FRONTEND_URL` (default `https://ineascents-app.vercel.app`) plus `/#/login`, unless the env value already contains a hash.

## Backend dependency

Dynamic data and inquiry submission require the backend running:

- Local: `http://127.0.0.1:8000`
- Production: `https://ineascents.onrender.com`

Without it, package/package-list sections fall back and the form shows "Form not configured. Message us on Facebook." (`src/App.tsx:175-178`).

## Troubleshooting

- Form shows "not configured": `VITE_API_URL` is empty — check `.env.local`, restart `vite` after env changes.
- API errors / CORS: backend must be running and reachable at `VITE_API_URL`; check backend logs.
- "Book in App" lands on wrong port locally: Flutter web picked a new ephemeral port — update `VITE_FRONTEND_URL` in `.env.local` and restart dev.
- Stale env values: Vite inlines `VITE_*` at startup — restart the dev server after edits.
- Lint: run `npm run lint` (oxlint, zero-config).

## License

Proprietary — all rights reserved. No LICENSE file is distributed with this repo.
