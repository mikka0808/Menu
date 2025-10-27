# MenuMagique
> **WARNING:** No binary assets in repo. Use SVG only or generate icons at build-time.

MenuMagique is a mobile-first meal planning companion built with React, Vite, TypeScript, and Tailwind CSS. It focuses on quick planning, smart shopping lists, and flexible recipe organization without storing any binary assets in the repository.

## Project Goals
- Plan weekly meals with drag-and-drop interactions and smart scheduling.
- Capture and normalize recipes using readability parsing.
- Generate organized shopping lists and shareable exports like PDFs.
- Operate fully offline-ready via a progressive web app shell.

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

Additional scripts include `npm run build`, `npm run preview`, `npm run lint`, `npm run format`, and `npm run typecheck` for project maintenance.

## No-Binary Policy
This repository intentionally stores only text-based assets. Icons, splash screens, and other binary PWA resources will be generated during the build or deployment process rather than committed to version control. Please keep contributions limited to text formats (code, JSON, Markdown, SVG, etc.).

## Roadmap Notes
- Implement recipe clipping and parsing workflows.
- Build planner interactions backed by Zustand state management.
- Add offline caching and installability polish with custom generated icons (excluded from the repo).
