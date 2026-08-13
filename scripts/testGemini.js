import dotenv from "dotenv";
dotenv.config();
import { structureJobWithGemini } from "./structureWithGemini.js";

const test = {
  text: "Recruitment of Staff Nurse - NHM Assam",
  link: "https://nhm.assam.gov.in/",
  siteName: "NHM Assam",
  pageContent: "Applications are invited for the post of Staff Nurse, 25 vacancies, salary Rs 20000-25000, minimum age 21 years maximum age 38 years, qualification B.Sc Nursing, last date to apply 30 August 2026."
};

const result = await structureJobWithGemini(test);
console.log("RESULT:", JSON.stringify(result, null, 2));
