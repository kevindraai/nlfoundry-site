#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const distDir = resolve(process.argv[2] || 'dist');
const identity = JSON.parse(readFileSync(new URL('../identity.json', import.meta.url), 'utf8'));
const canonicalSiteUrl = 'https://tunedpixel.nl';
const canonicalOrigin = new URL(canonicalSiteUrl).origin;
const siteUrl = (process.env.PUBLIC_SITE_URL?.trim() || canonicalSiteUrl).replace(/\/+$/, '');
const socialImage = `${siteUrl}/social/og-image.png`;

const requiredRoutes = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'engineering/index.html',
  'journal/index.html',
  'now/index.html',
  'projects/index.html',
  'projects/exitlane/index.html',
  'projects/clubpos/index.html',
  'journal/building-for-real-workflows/index.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'site.webmanifest',
  '404.html',
  'social-card.svg',
  'social/og-image.png',
  'favicons/favicon-16x16.png',
  'favicons/favicon-32x32.png',
  'favicons/apple-touch-icon.png',
  'favicons/web-app-192.png',
  'favicons/web-app-512.png',
];

const missingPathErrors = [];

const requiredHtmlRoutes = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'engineering/index.html',
  'journal/index.html',
  'journal/building-for-real-workflows/index.html',
  'now/index.html',
  'projects/index.html',
  'projects/exitlane/index.html',
  'projects/clubpos/index.html',
];

const requiredSocial = [
  'social/og-image.png',
  'social-card.svg',
];

// Compatibility guard: the former repository route must never leak into canonical production URLs.
const bannedRouteToken = 'kevindraai.github.io/nlfoundry-site';
const forbiddenUrls = [
  'http://127.0.0.1',
  'http://localhost',
  'https://localhost',
  '127.0.0.1:',
  'localhost:',
  '/nlfoundry-site/',
];

const errors = [];
const legacyIdentityPatterns = [
  /N[/]L Foundry/iu,
  /NL ?Foundry/iu,
  /nlfoundry[.]dev/iu,
  /--nlf-/iu,
  /--nl-/iu,
  /\bnlf[-_]/iu,
  /\bfoundry-/iu,
];

if (siteUrl !== canonicalSiteUrl) {
  errors.push(`PUBLIC_SITE_URL must be the canonical ${canonicalSiteUrl}; received ${siteUrl}`);
}

if (identity.canonical_url !== canonicalSiteUrl) {
  errors.push(`identity.json canonical_url must be ${canonicalSiteUrl}`);
}

if (identity.primary_domain !== new URL(canonicalSiteUrl).hostname) {
  errors.push('identity.json primary_domain does not match canonical_url');
}

const wwwAlias = identity.aliases?.find((alias) => alias.host === 'www.tunedpixel.nl');
if (
  !wwwAlias
  || wwwAlias.url !== 'https://www.tunedpixel.nl'
  || wwwAlias.role !== 'redirect'
  || wwwAlias.target !== canonicalSiteUrl
  || wwwAlias.preserve_path !== true
  || wwwAlias.preserve_query !== true
) {
  errors.push('identity.json must define www.tunedpixel.nl only as a redirect to the canonical URL');
}

const hasRouteFile = (relativePath) => {
  const target = join(distDir, relativePath);
  return statSync(target, { throwIfNoEntry: false })?.isFile() ?? false;
};

const collectFiles = (folder) => {
  const output = [];
  const entries = readdirSync(folder, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(folder, entry.name);
    if (entry.isDirectory()) {
      output.push(...collectFiles(entryPath));
      continue;
    }

    if (!/[.](html|xml|txt|js|css|json|svg)$/.test(entry.name)) {
      continue;
    }

    output.push(entryPath);
  }

  return output;
};

for (const route of requiredRoutes) {
  if (!hasRouteFile(route)) {
    missingPathErrors.push(`Missing required output file: /${route}`);
  }
}

for (const requiredAsset of requiredSocial) {
  if (!hasRouteFile(requiredAsset)) {
    missingPathErrors.push(`Missing required social asset: /${requiredAsset}`);
  }
}

const knownPages = collectFiles(distDir);

for (const file of knownPages) {
  const relativeFile = relative(distDir, file);
  const content = readFileSync(file, 'utf8');

  if (content.includes(bannedRouteToken)) {
    errors.push(`Found forbidden production path reference: ${bannedRouteToken} in ${relativeFile}`);
  }

  for (const token of forbiddenUrls) {
    if (content.includes(token)) {
      errors.push(`Found forbidden URL token "${token}" in ${relativeFile}`);
    }
  }

  for (const pattern of legacyIdentityPatterns) {
    if (pattern.test(content)) {
      errors.push(`Found active legacy identity matching ${pattern} in ${relativeFile}`);
    }
  }
}

for (const route of requiredHtmlRoutes) {
  const target = join(distDir, route);
  const source = readFileSync(target, 'utf8');

  const canonical = source.match(/<link rel="canonical" href="([^"]+)"/i);
  const routePath = route === 'index.html' ? '/' : `/${route.replace(/index[.]html$/u, '')}`;
  const expectedRouteUrl = new URL(routePath, `${siteUrl}/`).toString();
  if (!canonical || canonical[1] !== expectedRouteUrl) {
    errors.push(`Canonical URL missing/invalid in ${route}`);
  }

  const openGraphUrl = source.match(/<meta property="og:url" content="([^"]+)"/i);
  if (!openGraphUrl || openGraphUrl[1] !== expectedRouteUrl) {
    errors.push(`OpenGraph URL missing/invalid in ${route}`);
  }

  if (!source.includes(`<meta name="description"`)) {
    errors.push(`Missing description meta in ${route}`);
  }

  if (!source.includes(`property="og:image" content="${socialImage}"`)) {
    errors.push(`Missing/invalid OpenGraph image in ${route}`);
  }

  if (!source.includes(`name="twitter:image" content="${socialImage}"`)) {
    errors.push(`Missing/invalid Twitter image in ${route}`);
  }

  const hasTitle = /<title>[^<]+<\/title>/.test(source);
  if (!hasTitle) {
    errors.push(`Missing title element in ${route}`);
  }

  const hasDescription = /<meta name="description"[^>]+content="[^"]+"/.test(source);
  if (!hasDescription) {
    errors.push(`Missing description content in ${route}`);
  }
}

const index = readFileSync(join(distDir, 'index.html'), 'utf8');
if (!index.includes('application/ld+json') || !/"@type"\s*:\s*"Organization"/u.test(index)) {
  errors.push('Structured data (Organization schema) missing from homepage');
}

const structuredData = index.match(/<script type="application[/]ld[+]json">([\s\S]*?)<[/]script>/u)?.[1];
if (structuredData) {
  try {
    const entries = JSON.parse(structuredData);
    for (const [entryIndex, entry] of entries.entries()) {
      for (const field of ['url', 'logo']) {
        if (!entry[field]) {
          continue;
        }
        if (new URL(entry[field]).origin !== canonicalOrigin) {
          errors.push(`Structured data entry ${entryIndex} uses a non-canonical ${field}`);
        }
      }
    }
  } catch (_err) {
    errors.push('Structured data on homepage is not valid JSON');
  }
}

const contact = readFileSync(join(distDir, 'contact/index.html'), 'utf8');
const contactForm = contact.match(/<form\b[^>]*class="contact-form"[^>]*>/u)?.[0];
const contactEndpoint = process.env.PUBLIC_CONTACT_FORM_ACTION?.trim();

if (!contactForm) {
  errors.push('Contact form missing from contact page');
} else {
  if (!contactForm.includes('method="post"')) {
    errors.push('Contact form is not configured for POST submission');
  }
  if (!contactForm.includes('enctype="application/x-www-form-urlencoded"')) {
    errors.push('Contact form is not using URL-encoded HTML submission');
  }
}

if (!contact.includes('name="company"')) {
  errors.push('Contact form honeypot field is missing');
}

if (contactEndpoint) {
  let endpoint;
  try {
    endpoint = new URL(contactEndpoint);
  } catch {
    errors.push('PUBLIC_CONTACT_FORM_ACTION is not an absolute URL');
  }

  if (endpoint) {
    if (endpoint.protocol !== 'https:') {
      errors.push('PUBLIC_CONTACT_FORM_ACTION is not HTTPS');
    }
    if (endpoint.username || endpoint.password) {
      errors.push('PUBLIC_CONTACT_FORM_ACTION contains credentials');
    }
    if (!endpoint.pathname.endsWith('/form')) {
      errors.push('PUBLIC_CONTACT_FORM_ACTION does not point to a Stalwart /form endpoint');
    }
    if (endpoint.search || endpoint.hash) {
      errors.push('PUBLIC_CONTACT_FORM_ACTION contains a query string or fragment');
    }
    if (contactForm && !contactForm.includes(`action="${endpoint.toString()}"`)) {
      errors.push('Configured Stalwart endpoint is missing from the contact form action');
    }
  }

  if (contact.includes('class="contact-form__fields" disabled')) {
    errors.push('Contact form remains disabled with a configured endpoint');
  }
} else {
  if (contactForm?.includes(' action=')) {
    errors.push('Contact form action is present without a configured endpoint');
  }
  if (!contact.includes('class="contact-form__fields" disabled')) {
    errors.push('Contact form fallback is not disabled without an endpoint');
  }
}

if (!hasRouteFile('site.webmanifest')) {
  errors.push('Missing site.webmanifest');
} else {
  const manifestText = readFileSync(join(distDir, 'site.webmanifest'), 'utf8');
  try {
    const manifest = JSON.parse(manifestText);
    if (!manifest.icons || !Array.isArray(manifest.icons) || manifest.icons.length < 3) {
      errors.push('site.webmanifest does not define at least three icon sizes');
    }
  } catch (_err) {
    errors.push('site.webmanifest is not valid JSON');
  }
}

const robots = readFileSync(join(distDir, 'robots.txt'), 'utf8');
if (!robots.includes(`${siteUrl}/sitemap-index.xml`)) {
  errors.push('robots.txt missing canonical sitemap URL');
}

for (const sitemapFile of ['sitemap-index.xml', 'sitemap-0.xml']) {
  const sitemap = readFileSync(join(distDir, sitemapFile), 'utf8');
  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<[/]loc>/gu)].map((match) => match[1]);
  if (sitemapLocations.length === 0 || sitemapLocations.some((location) => new URL(location).origin !== canonicalOrigin)) {
    errors.push(`${sitemapFile} contains a missing or non-canonical URL`);
  }
}

const rssFeed = readFileSync(join(distDir, 'rss.xml'), 'utf8');
const rssSiteUrls = [...rssFeed.matchAll(/https:\/\/(?:www[.])?tunedpixel[.]nl[^<\s]*/gu)].map((match) => match[0]);
if (rssSiteUrls.length === 0 || rssSiteUrls.some((url) => new URL(url).origin !== canonicalOrigin)) {
  errors.push('rss.xml is not using canonical domain');
}

const titleMap = new Set();
for (const route of requiredHtmlRoutes) {
  const source = readFileSync(join(distDir, route), 'utf8');
  const title = source.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  if (title) {
    if (titleMap.has(title)) {
      errors.push(`Duplicate <title> value detected: ${title}`);
    }
    titleMap.add(title);
  } else {
    errors.push(`Missing title in ${route}`);
  }
}

for (const missing of missingPathErrors) {
  errors.push(missing);
}

if (errors.length > 0) {
  console.error('Production build verification failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Production build verification passed.');
