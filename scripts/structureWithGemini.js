import dotenv from "dotenv";
dotenv.config();
import https from "https";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Free models rotate often on OpenRouter, so try a few in order
const MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free"
];

const SYSTEM_PROMPT = `You are a data-extraction assistant for a government job listing website in Assam, India.
You will be given link text, URL, and page content scraped from a government website.

IMPORTANT: Be GENEROUS in deciding if something is relevant. If the link text contains ANY of these words, mark isRelevant as TRUE:
- recruitment, vacancy, vacancies, job, post, appointment, engagement, interview, notification, circular, walk-in, admit card, hall ticket, verification, result, merit list, selection list

Only mark isRelevant as FALSE if it is clearly a menu item (like "Home", "About Us", "Contact"), tender, or completely unrelated news (e.g. health drives, awareness campaigns, general circulars with no job content).

Then classify into ONE category:
- "new_recruitment": ONLY use this if the notice clearly advertises a SPECIFIC job post/position with at least one of: a named post/designation, a vacancy count, or an application process for candidates to apply. Generic notifications, circulars, or announcements that merely mention the word "notification" or "recruitment" without concrete post-level details do NOT qualify — use "other_update" instead.
- "interview_call": interview call letters or interview schedules for already-applied candidates
- "admit_card": admit card / hall ticket release notices
- "verification": document verification notices
- "result": result, merit list, or selection list notices
- "other_update": any other relevant update that isn't a clearly defined new job posting (including vague/generic notifications, circulars, postings/transfers, health programs, etc.)

When in doubt between "new_recruitment" and "other_update", prefer "other_update" — it is better to under-classify than to wrongly list something as a job opening.

CAREFULLY read the "Page content" and extract REAL values wherever present — numbers, dates, education qualifications, salary, age limits, vacancy counts, employment type. Search thoroughly before giving up on a field.

ONLY use "Not specified" for a field if you carefully checked and the information is genuinely absent.

Respond with ONLY valid JSON, no markdown, no explanation.

Output JSON shape (fill in REAL extracted values, do not copy this example literally):
{
  "isRelevant": boolean,
  "category": "new_recruitment | interview_call | admit_card | verification | result | other_update",
  "title": "extracted or inferred title",
  "department": "extracted department name",
  "deadline": "extracted deadline date, or Not specified",
  "vacancies": "extracted number of vacancies, or Not specified",
  "employmentType": "extracted employment type, or Not specified",
  "requiredEducation": "extracted qualification, or Not specified",
  "salary": "extracted salary/pay scale, or Not specified",
  "minAge": "extracted min age, or Not specified",
  "maxAge": "extracted max age, or Not specified",
  "syllabus": "extracted syllabus info, or Not specified",
  "examPattern": "extracted exam pattern info, or Not specified",
  "summary": "1 sentence summary of this notification"
}`;

function callModel(model, userContent) {
  const body = JSON.stringify({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent }
    ],
    max_tokens: 2048
  });

  const options = {
    hostname: "openrouter.ai",
    path: "/api/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Length": Buffer.byteLength(body)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.choices?.[0]?.message?.content;
          if (!text) {
            console.error(`  [${model}] No text in response:`, JSON.stringify(parsed).slice(0, 200));
            resolve(null);
            return;
          }
          const cleaned = text.replace(/```json|```/g, "").trim();
          resolve(JSON.parse(cleaned));
        } catch (err) {
          console.error(`  [${model}] Failed to parse response:`, data.slice(0, 200));
          resolve(null);
        }
      });
    });

    req.on("error", (err) => {
      console.error(`  [${model}] Request error:`, err.message);
      resolve(null);
    });

    req.write(body);
    req.end();
  });
}

export async function structureJobWithGemini(candidate) {
  const userContent = `Link text: "${candidate.text}"
Link URL: ${candidate.link}
Source site: ${candidate.siteName}

Page content:
${candidate.pageContent || "Not available"}`;

  for (const model of MODELS) {
    const result = await callModel(model, userContent);
    if (result) return result;
  }

  console.error("  All models failed for:", candidate.text);
  return null;
}
