# Eddyson Partner Landing Page

Angular implementation of the eddyson web developer assessment. The page is rendered with Angular and receives section content and images from Prismic.

## Stack

- Angular 22 standalone app
- SCSS component styles
- Prismic custom type and shared slices
- Firebase Hosting
- Vitest via Angular test runner

## Project Structure

- `src/app/features/partner-landing` - landing page route, sections, and UI components
- `src/app/core/prismic` - Prismic client, types, and field helpers
- `customtypes/partner_landing_page` - Prismic page custom type
- `slices/*` - Prismic shared slice models
- `scripts/prismic` - content seeding scripts and source assets for Prismic
- `public/assets` - static UI assets still bundled with the app

## Commands

```bash
npm start
npm run build
npm test -- --watch=false
```

Local app: `http://localhost:4200/`

## Prismic

Repository: `eddyson`

Seed content with a Migration API write token:

```bash
PRISMIC_WRITE_TOKEN=... PRISMIC_PARTNER_LANDING_PAGE_ID=... npm run prismic:seed:page
```

## Firebase

Hosting project: `eddyson-15ff0`

```bash
npm run build
npx firebase-tools deploy --only hosting --project eddyson-15ff0
```

Live URL: `https://eddyson-15ff0.web.app`
