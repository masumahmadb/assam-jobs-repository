import { scrapeAllSites } from "./fetchCandidates.js";
import { structureJobWithClaude } from "./structureWithClaude.js";
import { pushJobToFirestore } from "./pushToFirestore.js";

async function main() {
  const candidates = await scrapeAllSites();
  console.log(`\nTotal candidates across all sites: ${candidates.length}\n`);

  let savedCount = 0;
  let skippedCount = 0;

  for (const candidate of candidates) {
    const structured = await structureJobWithClaude(candidate);

    if (!structured || structured.isJob !== true) {
      skippedCount++;
      continue;
    }

    await pushJobToFirestore(candidate, structured);
    savedCount++;

    // Small delay to avoid hammering the Claude API rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. Saved: ${savedCount}, Skipped (not real jobs): ${skippedCount}`);
}

main().catch((err) => {
  console.error("Fatal error in scraper run:", err);
  process.exit(1);
});
