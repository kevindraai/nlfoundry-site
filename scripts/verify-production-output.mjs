#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const distDir = resolve(process.argv[2] || 'dist');
const siteUrl = 'https://nlfoundry.dev';
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
}

for (const route of requiredHtmlRoutes) {
  const target = join(distDir, route);
  const source = readFileSync(target, 'utf8');

  const canonical = source.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!canonical || !canonical[1].startsWith(siteUrl)) {
    errors.push(`Canonical URL missing/invalid in ${route}`);
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

const sitemap = readFileSync(join(distDir, 'sitemap-index.xml'), 'utf8');
if (!sitemap.includes(siteUrl)) {
  errors.push('sitemap-index.xml does not include canonical domain');
}

if (!readFileSync(join(distDir, 'rss.xml'), 'utf8').includes(siteUrl)) {
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
