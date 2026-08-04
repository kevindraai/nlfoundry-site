# N/L Foundry

Public website and documentation hub for N/L Foundry.

> Practical software, forged for real environments.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run check
npm run build
npm run verify:build
```

## Quality gates

```bash
npm run check
npm run build
```

GitHub Pages CI uses explicit environment values and verifies build output is production-safe:

```bash
PUBLIC_SITE_URL=https://nlfoundry.dev
PUBLIC_BASE_PATH=/
```

The site is built with Astro and Starlight and is deployed through GitHub Pages.
