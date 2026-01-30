# Chess Tournament App

- **Objective** – Goals of the assignment  
- **Problem Statement** – What to build  
- **Technical Requirements** – Tech stack and constraints  
- **Tournament Data** – Use `tournament.json` (in parent folder) for tournament listing  
- **Features to Implement** – Required functionality  
- **UI/UX Expectations** – Design and interaction guidelines  
- **Submission** – How to submit  

## Tech Stack

- **Next.js** (App Router)
- **React 18**
- **TypeScript**
- **SCSS** – Global styles in `app/globals.scss`, component modules as `*.module.scss`

## Tournament Data: Mocked API

The dummy JSON dataset is **exposed via a mocked API** using a Next.js route handler instead of importing the file directly.

- **Route:** `GET /api/tournaments` (see `app/api/tournaments/route.ts`) returns the contents of `data/tournaments.json`.
- **Client:** The tournament list page fetches this data with `fetch('/api/tournaments')` on mount and handles loading and error states.
**Approach:** It mirrors a real app where the UI talks to an API. Using route handlers keeps the same data shape and makes it easy to swap in a real backend later. The client code (fetch, loading/error handling) is what we’d use with a live API, so we avoid branching logic or a second “real API” path.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – Start development server  
- `npm run build` – Build for production  
- `npm run start` – Start production server  
- `npm run lint` – Run ESLint  

## Project Structure

```
chess-tournament-app/
├── app/
│   ├── api/
│   │   └── tournaments/
│   │       └── route.ts   # GET /api/tournaments – mocked API
│   ├── globals.scss
│   ├── layout.tsx
│   ├── page.tsx
│   └── page.module.scss
├── components/
│   └── TournamentCard/
├── data/
│   └── tournaments.json  # Dummy dataset (served via API)
├── types/
│   └── tournament.ts
├── next.config.mjs
├── package.json
├── tsconfig.json
└── .gitignore
```
