import { canonicalSiteUrl } from '../config/identity';

export function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? canonicalSiteUrl;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
