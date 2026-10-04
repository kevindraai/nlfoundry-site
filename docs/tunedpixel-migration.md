# Migratie naar Tuned.pixel en `tunedpixel.nl`

Status op 14 september 2026: de Tuned.pixel-sitebron staat op `origin/main`; deze branch finaliseert
de actieve namespace en de canonieke URL. `https://tunedpixel.nl` is de canonieke publieke URL.
`https://www.tunedpixel.nl` is uitsluitend een alias die permanent naar de overeenkomstige route
op de apex-host moet verwijzen. De externe DNS/TLS-controle vond voor `www` nog geen passend
certificaat en het oude `nlfoundry.dev` retourneerde nog geen redirect. Deze externe punten zijn
dus migratiewerk, geen afgeronde controles.

De repository heet tijdens deze bronbatch nog `kevindraai/nlfoundry-site`; het migratiedoel is
`kevindraai/tunedpixel-site`. De oude naam in negatieve routecontroles is een tijdelijke
compatibiliteitsuitzondering, niet de actieve identiteit.

## Bronbatch

De site gebruikt de goedgekeurde Tuned.pixel-identiteit, het `tp`-namespace voor actieve CSS- en
componentnamen, en `https://tunedpixel.nl` voor canonical, sitemap, robots, RSS en social
metadata. ClubSolution (voorheen ClubPOS) en ExitLane behouden hun eigen productidentiteit. Routes, zoeken, RSS en het
Stalwart-contactformulier blijven functioneel gelijk.

De machineleesbare site-identiteit staat in `identity.json`: `tunedpixel.nl` is het primaire
domein, `https://tunedpixel.nl` de enige canonical URL en `www.tunedpixel.nl` een redirect-alias
met behoud van pad en querystring.

Valideer vóór integratie:

```bash
npm run check
PUBLIC_SITE_URL=https://tunedpixel.nl PUBLIC_BASE_PATH=/ npm run build
npm run verify:build
```

Controleer daarnaast dat alleen de hieronder geregistreerde compatibility- en historical-hits van
de oude identiteit overblijven. Publiceer geen gegenereerde `dist`-bestanden.

## Repository en Pages

Voer externe wijzigingen als één gecontroleerde batch uit nadat de bronwijziging is beoordeeld:

1. Leg Pages-instelling, repositoryvariabelen, DNS, certificaatstatus en redirectregels vast voor
   rollback.
2. Hernoem de repository naar `kevindraai/tunedpixel-site` en verifieer workflows, Pages, remotes en
   actieve consumenten. Behandel GitHub-repositoryredirects niet als zelfstandig bewijs dat alle
   consumenten werken.
3. Behoud `PUBLIC_SITE_URL=https://tunedpixel.nl`; `PUBLIC_BASE_PATH` blijft `/`.
4. Configureer Pages Custom domain voor `tunedpixel.nl` en verifieer dat Pages het domein
   accepteert voordat verkeer wordt omgezet. De Actions-workflow blijft de deploymentroute.
5. Configureer `www.tunedpixel.nl` als permanente aliasredirect naar `https://tunedpixel.nl`, met
   behoud van pad en querystring. Wijzig geen mailrecords.
6. Wacht op certificaten die de apex en `www.tunedpixel.nl` dekken, schakel Enforce HTTPS in en
   controleer apex, de `www`-redirect, project- en journalroutes, assets, RSS, sitemap en één
   geautoriseerd contactbericht.

DNS- en certificaatpropagatie kan vertraagd zijn. Markeer de batch pas voltooid wanneer de publieke
HTTPS-observatie klopt; een succesvolle Pages-deployment alleen is onvoldoende bewijs.

## Compatibility-register

| Oude identiteit | Classificatie | Consumenten | Verwijdervoorwaarde | Verificatie |
| --- | --- | --- | --- | --- |
| `kevindraai.github.io/nlfoundry-site` en `/nlfoundry-site/` | compatibility | build-verifier, reviewchecklist | alle repository- en Pages-consumenten gebruiken de nieuwe naam en route | negatieve scan van productie-output |
| `www.tunedpixel.nl` | compatibility alias | bestaande gebruikers die de `www`-host gebruiken | behouden zolang de publieke domeininrichting deze alias ondersteunt | HTTPS 301/308 naar dezelfde `tunedpixel.nl`-route met behoud van query; nooit canonical metadata |
| `nlfoundry.dev` en `www.nlfoundry.dev` | compatibility | bestaande bookmarks en externe links | expliciet productbesluit na vastgestelde gebruiksperiode | beide hosts geven HTTPS 301/308 naar dezelfde `tunedpixel.nl`-route met behoud van query |
| oorspronkelijke design-handoff | historical | audit/provenance | nooit herschrijven; alleen archiveren volgens repositorybeleid | document is expliciet als historisch gemarkeerd |

Een resterende oude naam buiten dit register is niet automatisch toegestaan en blokkeert de
identiteits-eindgate.

## Oude domeinredirect

Zodra `tunedpixel.nl` en de `www`-alias via HTTPS werken, configureer in de DNS/proxy-zone van het
oude domein een permanente redirect van `nlfoundry.dev` en `www.nlfoundry.dev` naar
`https://tunedpixel.nl`, met behoud van pad en querystring. Beide oude hostnames moeten een
geldig certificaat houden zolang deze compatibility-route bestaat. Gebruik geen wildcard die mail-
of andere subdomeinen raakt; een CNAME alleen is geen HTTP-redirect.

## Rollback

Bronrollback is het terugdraaien van de migratiecommit via de normale pull-requestprocedure. Voor
de externe batch: zet bij een fout de vastgelegde Pages Custom domain en `PUBLIC_SITE_URL` terug,
herstel de vorige DNS-records, schakel de nieuwe redirect uit en deploy de vorige bewezen versie.
Controleer daarna HTTPS, canonical metadata, een bestaande project-URL en het contactformulier.
Hernoem de repository alleen terug als concrete consumenten niet via een gerichte configuratiefix
hersteld kunnen worden; behoud in beide richtingen de geverifieerde remote- en Pages-koppeling.

## Bronnen

- GitHub Pages custom-domain-documentatie:
  https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Cloudflare redirectvoorbeeld:
  https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-another-domain/
