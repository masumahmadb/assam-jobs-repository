import fetch from "node-fetch";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = "claude-sonnet-4-6"; // always use this model string

const SYSTEM_PROMPT = `You are a data-extraction assistant for a government job listing website in Assam, India.
You will be given a short piece of text (a link title/snippet) scraped from a government website, plus the link URL.

Your job: decide if this is a genuine job/recruitment notification (not a menu item, tender, press release, or unrelated news).

If it IS a genuine job notification, extract structured fields. If it is NOT, respond with {"isJob": false} only.

Rules:
- NEVER invent or guess information. If a field is not clearly present in the given text, set it to "Not specified".
- Do not hallucinate deadlines, vacancy counts, or syllabus details.
- "employmentType" must be one of: "Permanent", "Contractual", "Not specified".
- "syllabus" should only be filled if syllabus/exam-pattern details are explicitly present in the given text; otherwise "Not specified".
- Respond with ONLY valid JSON, no markdown fences, no preamble, no explanation.

Output JSON shape:
{
  "isJob": true,
  "title": "string",
  "department": "string",
  "deadline": "string (date if found, else 'Not specified')",
  "vacancies": "string (number/count if found, else 'Not specified')",
  "employmentType": "Permanent | Contractual | Not specified",
  "syllabus": "string (brief syllabus/exam pattern if found, else 'Not specified')",
  "summary": "string (1-2 sentence plain-language summary)"
}`;

export async function structureJobWithClaude(candidate) {
  const userContent = `Link text: "${candidate.text}"\nLink URL: ${candidate.link}\nSource site: ${candidate.siteName}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Claude API error:", res.status, errText);
    return null;
  }

  const data = await res.json();
  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock) return null;

  try {
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Claude response as JSON:", textBlock.text);
    return null;
  }
}
