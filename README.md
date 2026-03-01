# Mystery Object

A web-based daily puzzle game where everyone in the world gets the same object each day and has up to 3 clues to solve it.

## Features

- Daily global puzzle based on date
- Progressive reveal (clue 1 → clue 2 → clue 3 → full reveal)
- Guess validation through API
- Result view with clue count used
- Shareable results (Web Share API or clipboard fallback)
- Local streak tracking
- Mobile-first minimalist UI inspired by Wordle
- Admin page to add/edit daily puzzles
- MongoDB-backed puzzle storage
- Vercel-ready Next.js setup

## Tech Stack

- **Frontend:** Next.js (React, App Router)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB

## Folder Structure

```text
.
├── app
│   ├── admin/page.js                  # Admin UI for creating daily puzzles
│   ├── api
│   │   ├── admin/puzzle/route.js      # Save or update a puzzle by date
│   │   └── puzzle
│   │       ├── guess/route.js         # Validate player guess
│   │       └── today/route.js         # Return today's puzzle clues
│   ├── globals.css                    # Mobile-friendly minimalist styling
│   ├── layout.js                      # Root layout and metadata
│   └── page.js                        # Main game UI/logic
├── lib/mongodb.js                     # Shared MongoDB client utility
├── models/puzzle.js                   # Puzzle payload + guess normalization helpers
├── scripts/seed.js                    # Starter puzzle seeding script
├── .env.example
├── next.config.mjs
└── package.json
```

## MongoDB Puzzle Schema

Collection: `puzzles`

```js
{
  date: "2026-03-01",         // YYYY-MM-DD, unique
  objectName: "Rubiks Cube",  // canonical answer
  clue1Image: "https://...",  // hardest clue
  clue2Image: "https://...",
  clue3Image: "https://...",  // easiest clue before full reveal
  fullImage: "https://...",   // full object image
  createdAt: "ISO timestamp",
  updatedAt: "ISO timestamp"
}
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
cp .env.example .env.local
```

3. Set your MongoDB values in `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=mystery-object
```

4. Seed starter puzzles:

```bash
npm run seed
```

5. Start dev server:

```bash
npm run dev
```

Open:

- Game: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## API Endpoints

- `GET /api/puzzle/today`: returns today's puzzle images (without answer)
- `POST /api/puzzle/guess`: body `{ guess }` → returns `{ isCorrect }`
- `POST /api/admin/puzzle`: creates/updates puzzle by `date`

## Deployment (Vercel)

1. Push to GitHub.
2. Import project in Vercel.
3. Add environment variables in Vercel project settings:
   - `MONGODB_URI`
   - `MONGODB_DB`
4. Deploy.

Because this is a standard Next.js app with API routes, it deploys directly on Vercel without extra server setup.
