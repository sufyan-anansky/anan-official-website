# Anan Sustainability

A bilingual, Arabic-first single-page website for Anan Sustainability.

## Requirements

- Node.js 20.9 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
Arabic (`/ar`); English is available at `/en`.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`DESIGN.md` is the visual source of truth. Its tokens are mirrored in
`src/app/globals.css` and mapped to utility classes in `tailwind.config.ts`.
