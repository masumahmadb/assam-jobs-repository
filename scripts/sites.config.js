// Configuration for each government site we scrape.
// "listUrl" = the page where notifications/vacancies are listed.
// "linkSelector" = CSS selector that matches the <a> tags for individual notifications.
//   We start broad ("a") and rely on keyword filtering (see KEYWORDS below) to pick
//   out real job notifications from menu links, footer links, etc.
//
// NOTE: Government site HTML changes often. If a site stops returning results,
// the fix is almost always here — updating listUrl or linkSelector — not in the
// scraping/parsing logic itself.

export const KEYWORDS = [
  "recruitment", "vacancy", "vacancies", "advertisement", "notification",
  "walk-in", "walk in", "appointment", "job", "post", "engagement",
  "contractual", "written test", "interview", "result", "admit card"
];

export const SITES = [
  {
    id: "assam_gov_portal",
    name: "Assam Government Portal",
    category: "State Govt",
    listUrl: "https://assam.gov.in/",
    linkSelector: "a"
  },
  {
    id: "employment_assam",
    name: "Employment Department Assam",
    category: "State Govt",
    listUrl: "https://employment.assam.gov.in/",
    linkSelector: "a"
  }
  // Next sites to add once these two are confirmed working:
  // APSC, SLPRB Assam, NHM Assam, DME Assam, SSC, RRB Guwahati
];
