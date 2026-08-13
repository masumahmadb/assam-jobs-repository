import dotenv from "dotenv";
dotenv.config();
import https from "https";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.5-flash";

const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const body = JSON.stringify({
  contents: [{ role: "user", parts: [{ text: "Say hello in one word" }] }]
});

const urlObj = new URL(url);
const options = {
  hostname: urlObj.hostname,
  path: urlObj.pathname + urlObj.search,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  console.log("STATUS:", res.statusCode);
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    console.log("RAW RESPONSE:", data);
  });
});

req.on("error", (err) => console.error("REQUEST ERROR:", err.message));
req.write(body);
req.end();
