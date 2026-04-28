# GeoScore Development Guide

## Build Scripts

- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint
- Format: npm run format

## Tech Stack

- Framework: Next.js App Router with TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Libraries: react-simple-maps, html2canvas, i18next

## Code Style

- Comments: Write comments in English using a single clear sentence without special symbols
- Components: Functional components with TypeScript interfaces
- Storage: Use localStorage for data persistence
- Export: Project must be fully functional as a static export without a backend
- Icons: Use SVG icons exclusively and do not use emojis

## Scoring Logic

- Live: 4
- Stay: 3
- Visit: 2
- Transit: 1
- Never: 0
