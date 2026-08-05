import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

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

export async function structureJobWithGemini(candidate) {
  const userContent = `Link text: "${candidate.text}"\nLink URL: ${candidate.link}\nSource site: ${candidate.siteName}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig: { maxOutputTokens: 500 }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini API error:", res.status, errText);
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", text);
    return null;
  }
}
