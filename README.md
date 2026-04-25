# GeoScore

A web app to track and score my world travel experiences.
Data is saved locally in the browser (`localStorage`).

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- `react-simple-maps` (SVG map)
- `html2canvas` (Image export)

## Getting Started

Install dependencies (use `--legacy-peer-deps` for map library)

```bash
npm install --legacy-peer-deps
```

Run the development server

```Bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Available Commands

- `npm run dev`: Start dev server
- `npm run build`: Build for production (outputs to /out for Cloudflare Pages)
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
