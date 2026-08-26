# N/L Foundry

Public website, project portfolio and engineering journal for N/L Foundry.

> Practical software, forged for real environments.

The site is a static Astro and Starlight build. Markdown is the publication layer, Git is the
source of truth and pull requests are the publishing boundary. There is no database, CMS login,
tracking script or server-side content store.

## Local development

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

Run the same production gates used by CI:

```bash
npm run check
PUBLIC_SITE_URL=https://nlfoundry.dev PUBLIC_BASE_PATH=/ npm run build
npm run verify:build
```

`npm run check` validates TypeScript, Astro components and all collection frontmatter. The final
verification checks required routes, canonical metadata, social images and production-safe URLs.

## Content model

- `src/content/posts/` contains journal entries.
- `src/content/projects/` contains project pages.
- `src/content/docs/` contains durable site and engineering pages managed by Starlight.

A new post starts as a draft:

```yaml
---
title: A clear, specific title
description: A short summary for listings and metadata.
date: 2026-08-25
updated: 2026-08-25
draft: true
tags:
  - engineering
---
```

Project frontmatter is schema-validated as well:

```yaml
---
title: Example project
description: A concise project description.
status: in-development
startDate: 2026-08-25
tags:
  - astro
links: []
featured: false
draft: true
product: exitlane
deliveryModel: open-source
focus: The practical outcome this project is designed around.
---
```

The current `product` field uses the two existing visual identities: `exitlane` and `clubpos`.
Extending that enum requires reviewed visual assets and schema changes.

## Publishing workflow

Humans and AI-assisted agents use the same reviewable route:

1. Fetch and verify the current `origin/main`.
2. Create a new branch from that commit; never work directly on `main`.
3. Add or edit content with valid frontmatter. AI-authored posts remain `draft: true` unless the
   work order explicitly authorizes publication.
4. Run `npm run check`, `npm run build` and `npm run verify:build`.
5. Review the diff for private information, secrets, untrusted scripts, external links and image
   alternative text.
6. Open a pull request. Required CI must pass before a human reviews and merges it.

Agents must also follow the repository contract in `AGENTS.md`. Direct pushes or merges to `main`
are not part of the content workflow.

## Contact integration

The contact UI posts native HTML form data directly to Stalwart's `/form` endpoint. Submission stays
disabled until the public endpoint is supplied at build time:

```bash
PUBLIC_CONTACT_FORM_ACTION=https://mail.example.test/form
PUBLIC_CONTACT_EMAIL=hello@example.test
```

`PUBLIC_CONTACT_FORM_ACTION` must be an absolute HTTPS URL ending in `/form`, without credentials,
a query string or a fragment. Both variables are public build configuration, never secret storage.
`PUBLIC_CONTACT_EMAIL` only enables the fallback mail link; `PUBLIC_CONTACT_FORM_ACTION` enables the
form. Configure both as GitHub Actions repository variables for the deployed build.

The required Stalwart-side settings, field mapping, proxy safeguards and test procedure are in
[`docs/stalwart-contact-form.md`](docs/stalwart-contact-form.md). Those operational changes are
applied on the Stalwart host, not by this repository.

## Hosting

GitHub Pages remains the deployment target. CI and deployment use:

```bash
PUBLIC_SITE_URL=https://nlfoundry.dev
PUBLIC_BASE_PATH=/
```

The deploy workflow runs only from `main` or by an explicit manual dispatch and contains no
deployment secrets.
