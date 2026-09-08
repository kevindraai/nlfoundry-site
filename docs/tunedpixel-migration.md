# Voorstel en overstap naar tunedpixel.nl

Status: werkend lokaal voorstel, nog niet gepubliceerd. Repo: kevindraai/nlfoundry-site. Voorstelbranch: design/tunedpixel-proposal, gebaseerd op origin/main d3b741f. Geen DNS, GitHub Pages-instelling of productievariabele gewijzigd.

## Wat verandert

De site gebruikt de goedgekeurde Tuned point-identiteit: woordmerk, klein t-teken, Inter en het lichte Night/Ice-palet. De teksten zijn Nederlands en vanuit Kevin geschreven. ClubPOS en ExitLane behouden hun eigen identiteit en eerlijke ontwikkelstatus. De eerdere N/L-herkomsttekst is vervangen door Kevins verhaal over de terugkeer van Tuned.pixel. Bestaande routes, zoeken, RSS en het contactformulier blijven behouden.

De bestaande socialkaart is niet vernieuwd als onderdeel van dit websitevoorstel en bevat nog de oude identiteit. Die meenemen in de definitieve publicatieronde. De contactkoppeling bestaat op de huidige publieke website; berichten zijn niet daadwerkelijk ingestuurd tijdens controle.

## Eerst beoordelen

Bekijk homepage, projectpagina's, Over Kevin, Notities en Contact. Na akkoord kan de wijziging via een pull request in deze bestaande repository worden klaargezet voor productie. Geen verhuizing naar een andere host en geen hernoeming van de repo nodig.

## Wanneer Cloudflare aanpassen

Nog niet voor het voorstel. Doe de overstap als de website is goedgekeurd, de productiebuild klaarstaat en de contactkoppeling klaar is voor het nieuwe domein.

1. Verifieer tunedpixel.nl in de persoonlijke GitHub Pages-instellingen; GitHub geeft daarvoor een TXT-record. Die verificatie kan vooraf, zonder websiteverkeer om te zetten.
2. Leg huidige Pages-instelling, repositoryvariabelen, DNS en redirectregels vast voor rollback. De broncode kan al op het huidige domein draaien: `PUBLIC_SITE_URL` bepaalt canonical, sitemap, robots en RSS.
3. Op het afgesproken overstapmoment: wijzig Settings → Pages → Custom domain van de bestaande repository naar `tunedpixel.nl`. De bestaande GitHub Actions-deployment blijft in gebruik. Een CNAME-bestand in de repo is bij deze workflow niet de gezaghebbende instelling.
4. Pas daarna de webrecords in Cloudflare aan. Gebruik voor @ de vier GitHub Pages A-records: 185.199.108.153, 185.199.109.153, 185.199.110.153 en 185.199.111.153. Voor www: CNAME naar `kevindraai.github.io` (zonder repositorypad). Gebruik DNS only tijdens de GitHub-domein- en certificaatcontrole. Een bestaande Cloudflare-apex-CNAME met flattening kan een alternatief zijn; controleer eerst de aanwezige records. Wijzig geen mailrecords.
5. Zet repositoryvariabele `PUBLIC_SITE_URL` op `https://tunedpixel.nl`; `PUBLIC_BASE_PATH` blijft `/`. Bouw en deploy de beoordeelde wijziging. Behoud `PUBLIC_CONTACT_FORM_ACTION` en controleer aan Stalwart-zijde of het nieuwe domein is toegestaan. Een eventueel nieuw e-mailadres pas instellen nadat het bestaat.
6. Wacht op een geldig certificaat en zet Enforce HTTPS aan. Controleer apex en www, project- en journalroutes, assets, RSS, sitemap en één echt contactbericht met toestemming. Certificaat/DNS-propagatie kan tot 24 uur duren; beloof geen onderbrekingsloze omzetting met één Pages-site.
7. Zodra tunedpixel.nl via HTTPS werkt: maak in de Cloudflare-zone van nlfoundry.dev een 301-redirect voor nlfoundry.dev en www.nlfoundry.dev naar `https://tunedpixel.nl`, met behoud van pad en querystring. Deze oude hostnames moeten via Cloudflare geproxied zijn. Een CNAME op zichzelf is geen HTTP-redirect. Vermijd een wildcard die ook mail- of andere subdomeinen raakt.

## Rollback

Bewaar de oude DNS-waarden. Bij een probleem: oude Pages Custom domain en PUBLIC_SITE_URL terugzetten, de oude redirect uitschakelen en de vorige werkende versie opnieuw deployen. Controleer daarna HTTPS en een bestaande project-URL. DNS/certificaten kunnen ook bij herstel vertraging geven.

## Bronnen

- GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site (8 september 2026 geraadpleegd). Bij Actions is CNAME niet vereist en wordt het genegeerd; configureer de domeinnaam in Pages vóór de DNS-omzetting.
- Cloudflare: https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-another-domain/ (8 september 2026 geraadpleegd). Gebruik een domeinredirect met behoud van pad en querystring.
