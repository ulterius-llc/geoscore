# GeoScore

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/demo-geoscore.ulterius.dev-blue)](https://geoscore.ulterius.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

A web app to track and score your world travel experiences.

GeoScore runs **fully on the client** — all data is stored in your browser's `localStorage`, with no backend, no account, and no tracking. It is a Progressive Web App (PWA), so on mobile you can install it to your home screen and use it **offline** after the first load.

**Live App:** [geoscore.ulterius.dev](https://geoscore.ulterius.dev)

## Features

- Interactive world map with click-to-score interface
- Five-tier scoring system (Live / Stay / Visit / Transit / Never)
- Covers 206 countries and territories
- Bilingual UI (English / Japanese)
- Local-only persistence — no account required
- Export your map as a shareable image
- Installable PWA with offline support

## Scoring System

| Score | Label | Meaning |
| :---: | :---- | :------ |
| 4 | Live | Lived there |
| 3 | Stay | Stayed overnight |
| 2 | Visit | Day visit |
| 1 | Transit | Transit only |
| 0 | Never | Never been |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [react-simple-maps](https://www.react-simple-maps.io/) — SVG world map
- [html2canvas](https://html2canvas.hertzen.com/) — Image export
- [i18next](https://www.i18next.com/) — Localization
- [Lucide React](https://lucide.dev/) — Icons

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ulterius-llc/geoscore.git
cd geoscore
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is required because `react-simple-maps` peer-depends on an older React version.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

Outputs a static site to `/out`, ready to deploy to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

## Available Commands

| Command | Description |
| :------ | :---------- |
| `npm run dev` | Start the development server |
| `npm run build` | Build a static export to `/out` |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
geoscore/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/
│   ├── countries.ts  # Country data (ISO codes, names, regions)
│   ├── locales/      # i18n translation files
│   ├── storage.ts    # localStorage helpers
│   └── types.ts      # Shared TypeScript types
├── public/           # Static assets (map data, manifest)
└── out/              # Build output (gitignored)
```

## Contributing

Contributions are welcome. Please open an issue first for major changes.

- Found a bug? [Open a bug report](https://github.com/ulterius-llc/geoscore/issues/new?template=bug_report.yml)
- Have an idea? [Suggest a feature](https://github.com/ulterius-llc/geoscore/issues/new?template=feature_request.yml)
- Country data issue? [Report it here](https://github.com/ulterius-llc/geoscore/issues/new?template=country_data.yml)

## License

[MIT](./LICENSE) © [Ulterius LLC](https://github.com/ulterius-llc)
