import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { createRequire } from "module";
import { SITES, KEYWORDS } from "./sites.config.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function fetchPageText(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AssamJobsBot/1.0)" },
      timeout: 15000
    });
    if (!res.ok) return "";

    const contentType = res.headers.get("content-type") || "";
    const isPdf = contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      const buffer = await res.buffer();
      const data = await pdfParse(buffer);
      return data.text.replace(/\s+/g, " ").trim().slice(0, 4000);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return text.slice(0, 3000);
  } catch (err) {
    console.error(`  Failed to extract content from ${url}:`, err.message);
    return "";
  }
}

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

  const seen = new Set();
  const unique = candidates.filter((c) => {
    if (seen.has(c.link)) return false;
    seen.add(c.link);
    return true;
  });

  console.log(`  Fetching page content for ${unique.length} candidates...`);
  for (const candidate of unique) {
    const pageText = await fetchPageText(candidate.link);
    candidate.pageContent = pageText;
    await new Promise(r => setTimeout(r, 1000));
  }

  return unique;
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
