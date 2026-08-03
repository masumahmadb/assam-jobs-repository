import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { SITES, KEYWORDS } from "./sites.config.js";

// Fetches a page and returns candidate "notification items": link text + href + a bit of
// surrounding context, filtered by keyword match so we don't send menu/footer junk to Claude.
async function fetchCandidates(site) {
  const candidates = [];
  try {
    const res = await fetch(site.listUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AssamJobsBot/1.0)" },
      timeout: 20000
    });
    if (!res.ok) {
      console.error(`[${site.id}] Failed to fetch: HTTP ${res.status}`);
      return candidates;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    $(site.linkSelector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      let href = $(el).attr("href");
      if (!text || !href) return;

      const lowerText = text.toLowerCase();
      const isRelevant = KEYWORDS.some((kw) => lowerText.includes(kw));
      if (!isRelevant) return;

      // Resolve relative links to absolute URLs
      try {
        href = new URL(href, site.listUrl).toString();
      } catch {
        return;
      }

      candidates.push({
        siteId: site.id,
        siteName: site.name,
        category: site.category,
        text,
        link: href
      });
    });
  } catch (err) {
    console.error(`[${site.id}] Error fetching ${site.listUrl}:`, err.message);
  }

  // De-duplicate by link
  const seen = new Set();
  return candidates.filter((c) => {
    if (seen.has(c.link)) return false;
    seen.add(c.link);
    return true;
  });
}

export async function scrapeAllSites() {
  const allCandidates = [];
  for (const site of SITES) {
    console.log(`Scraping: ${site.name} (${site.listUrl})`);
    const candidates = await fetchCandidates(site);
    console.log(`  Found ${candidates.length} candidate notifications`);
    allCandidates.push(...candidates);
  }
  return allCandidates;
}
