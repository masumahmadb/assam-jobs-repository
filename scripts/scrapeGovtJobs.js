import dotenv from "dotenv";
dotenv.config();
import { scrapeAllSites } from "./fetchCandidates.js";
import { structureJobWithGemini } from "./structureWithGemini.js";
import { pushJobToFirestore } from "./pushToFirestore.js";

async function main() {
  const candidates = await scrapeAllSites();
  console.log(`\nTotal candidates across all sites: ${candidates.length}\n`);

  let savedCount = 0;
  let skippedCount = 0;

  for (const candidate of candidates) {
    const structured = await structureJobWithGemini(candidate);
    if (!structured || structured.isRelevant !== true) {
      skippedCount++;
      continue;
    }
    await pushJobToFirestore(candidate, structured);
    savedCount++;
    await new Promise((r) => setTimeout(r, 4000));
  }

  console.log(`\nDone. Saved: ${savedCount}, Skipped (not real jobs): ${skippedCount}`);
}

main().catch((err) => {
  console.error("Fatal error in scraper run:", err);
  process.exit(1);
});
