# N/L Foundry site agent contract

This contract applies to the entire repository. Current user or work-order instructions take
precedence, followed by this file, accepted project standards, current implementation/tests and
historical material. Report material contradictions instead of resolving them silently.

## Repository and authorization

- Establish the canonical workspace, remote, branch, `origin/main` and working-tree status before
  editing.
- Preserve unrelated work. Never reset, clean, stash, restore, overwrite or include user changes
  without explicit authorization.
- Start each task on a new branch from the verified current `origin/main`.
- Never commit, push or merge directly to `main`. Pushing, opening or merging a pull request and
  deploying all require explicit authorization for that concrete action.
- Stage explicit paths only and review the final diff. Do not commit generated `dist`, dependency
  directories, supplied archives, credentials or secrets.

## Content publication

- Posts live in `src/content/posts`; projects live in `src/content/projects`.
- New AI-authored posts and projects default to `draft: true`. Set `draft: false` only when the
  current work order explicitly authorizes publication.
- Keep frontmatter valid against `src/content.config.ts`; do not bypass or weaken the schema to
  publish malformed content.
- Do not publish credentials, tokens, private information or identifying user/customer data.
- Do not add tracking, uncontrolled external scripts, embedded third-party widgets, comments or a
  CMS/backend unless the work order explicitly requires and authorizes them.
- Choose external links deliberately. Informative local images require useful alt text; decorative
  images use an empty alt value and must not carry essential information.
- Preserve the brand authority in `BRAND_GUIDE.md` and `src/styles/tokens.css`. Product accent
  colours do not become master-brand colours.

## Validation and review

Run the relevant gates before handoff:

```bash
npm run check
PUBLIC_SITE_URL=https://nlfoundry.dev PUBLIC_BASE_PATH=/ npm run build
npm run verify:build
```

Treat failures as evidence to investigate. Review scope, rendered routes, responsive UX,
keyboard/focus behaviour, contrast, metadata and accidental draft exposure. Report what changed,
the evidence used, anything not verified and remaining risks.
