# Eddyson Web Developer Assessment

Angular implementation of the eddyson partner landing page assessment.

## Current Structure

- Angular standalone application with SCSS and routing enabled
- Root app shell kept minimal and route-driven
- Partner landing page isolated in `src/app/features/partner-landing`
- Page-level layout components live in `src/app/layout`
- Landing page sections live in `src/app/features/partner-landing/sections`
- Reusable landing page UI shells live in `src/app/features/partner-landing/ui`
- Global base styles prepared in `src/styles.scss`

## Development Server

Run the app locally with:

```bash
npm start
```

Then open `http://localhost:4200/`.

## Code Scaffolding

Generate new Angular building blocks with:

```bash
npm run ng -- generate component component-name
```

## Building

Create a production build with:

```bash
npm run build
```

## Tests

Run unit tests with:

```bash
npm test
```
