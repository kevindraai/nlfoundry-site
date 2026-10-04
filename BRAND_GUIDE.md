# Tuned.pixel — Tuned point

Approved by Kevin in this design session, 8 September 2026. The supplied Tuned.pixel brand package
replaces the former N/L Foundry identity for this website. The repository is being renamed from
`kevindraai/nlfoundry-site` to `kevindraai/tunedpixel-site`; hosting remains GitHub Pages.

## Identity

Write `Tuned.pixel`, with capital T and lowercase p, no spaces. Use the outlined wordmark in `public/brand/tp-wordmark.svg` as the primary signature. Its square point is custom geometry; do not replace it with ordinary typeset text. Use `tp-mark.svg` for compact applications and the dedicated favicon at 16 px. Minimum wordmark width 140 px; clear space at least half the capital height. No N/L monogram, enclosing pixel block, glow or industrial imagery in the site layout.

The isolated t-sign has a curved foot and a detached square. It is a secondary mark, not a symbol that has to precede every wordmark.

## Typography and colour

Inter locally hosted, with the included SIL OFL licence. Body 400, display 500, controls 600. Body at least 16 px, regular labels at least 14 px. Headlines use restrained negative tracking; paragraphs use standard kerning. Straight-edged controls, visible focus, generous spacing on a 4 px base.

Night #020914, Ice #F7FAFE, Steel #21384A, Electric Blue #63C4FF and dark Link Blue #215E86 are the
Tuned.pixel palette. Their values retain design provenance from the superseded identity; active CSS
tokens use the `tp` namespace. Light blue is decorative on light surfaces; use dark Link Blue for
text and focus on light. On the Night contact panel use Ice text and light blue controls/focus. The
light appearance is fixed and remains usable without JavaScript.

## Voice and composition

Dutch, in Kevin's own first-person voice. Describe the actual work: ClubSolution for associations (a modular product: ClubSolution Kassa, Basis, Boekhouden and so on), ExitLane for network-wide VPN routing. Keep status truthful; do not invent customers, testimonials, availability, screenshots or release dates. The return of the older Tuned.pixel name is the personal story, supplied by Kevin.

Homepage: a Night hero in which the t-sign is built from pixels that visitors can disturb and that tune themselves back into place, with labels for the t and the pixel and a ruler-style bar listing current projects. The shape is read from `tp-mark.svg`; with reduced motion the sign stands still. Below the hero the page is light and calm: what I do, actual project identities, notes and the existing contact form, closed by the full-width wordmark. Product accents stay local. Product pages, search, navigation, journal, RSS and content schemas remain functional. Existing routes stay stable for domain redirects.

## Contact and delivery

Keep the existing Stalwart native POST integration, field names, honeypot, URL validation and
disabled fallback. No third-party tracking or new backend. Identity and domain changes follow the
pull-request and external cutover gates in `docs/tunedpixel-migration.md`.

The social-preview assets use the approved wordmark and canonical `tunedpixel.nl` URL. No stock
portrait or generated campaign image is part of the production identity.
