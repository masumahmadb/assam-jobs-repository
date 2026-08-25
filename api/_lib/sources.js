// Official Assam job/recruitment sources monitored by the cron watcher.
// Order matters: higher-priority sources are crawled first within each batch window.
export const SOURCES = [
  { id: 'slprb', name: 'SLPRB Assam', category: 'State Govt', url: 'https://slprbassam.in/' },
  { id: 'apsc', name: 'Assam Public Service Commission', category: 'State Govt', url: 'https://apsc.nic.in/' },
  { id: 'nhm_assam', name: 'NHM Assam', category: 'State Govt', url: 'https://nhm.assam.gov.in/' },
  { id: 'dme_assam', name: 'DME Assam', category: 'State Govt', url: 'https://dme.assam.gov.in/' },
  { id: 'dhsfw_assam', name: 'DHSFW Assam', category: 'State Govt', url: 'https://dhsfw.assam.gov.in/' },
  { id: 'ssa_assam', name: 'Samagra Shiksha Assam', category: 'State Govt', url: 'https://ssa.assam.gov.in/' },
  { id: 'apdcl', name: 'APDCL Assam', category: 'PSU', url: 'https://www.apdcl.org/' },
  { id: 'rrb_guwahati', name: 'RRB Guwahati', category: 'Central Govt', url: 'https://www.rrbguwahati.gov.in/' },
  { id: 'ssc_ner', name: 'SSC NER Guwahati', category: 'Central Govt', url: 'https://www.sscner.org.in/' },
  { id: 'assam_gov_portal', name: 'Assam Government Portal', category: 'State Govt', url: 'https://assam.gov.in/' }
]

// Link text / href patterns that suggest a recruitment-related notice.
export const NOTICE_STRONG = [
  'recruitment', 'vacancy', 'vacancies', 'advertisement', 'notification',
  'walk-in', 'walk in', 'engagement', 'appointment',
  'भर्ती', 'নিযুক্তি', 'নিয়োগ'
]
export const NOTICE_WEAK = [
  'result', 'admit card', 'merit list', 'written test', 'selection', 'apply online',
  'job', 'post', 'contractual', 'application', 'tender', 'notice',
  'ফলাফল', 'প্ৰৱেশ পত্ৰ'
]

const JUNK_RE = /(?:facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com|t\.me|whatsapp\.com|mailto:|tel:|javascript:|google\.com|twitter|\/login|\/signup|\.(?:jpg|jpeg|png|gif|webp|svg|css|js|mp4|zip)(?:[?#]|$))/i

const NAV_RE = /^(?:home|about(?: us)?|contact(?: us)?|disclaimer|privacy|terms|faq|sitemap|login|sign ?in|register|feedback|help|accessibility|archive|tenders?|rti|skip to)/i

export function scoreNoticeLink(text, href) {
  const t = String(text || '').toLowerCase()
  const h = String(href || '').toLowerCase()
  if (!text && !/\.pdf(?:[?#]|$)/i.test(h)) return -1
  if (NAV_RE.test(t.trim())) return -1
  let s = 0
  for (const k of NOTICE_STRONG) if (t.includes(k) || h.includes(k)) s += 5
  for (const k of NOTICE_WEAK) if (t.includes(k) || h.includes(k)) s += 2
  if (/\.pdf(?:[?#]|$)/i.test(h)) s += 4
  // assam.gov.in-style portals expose notices under predictable content paths
  if (/\/(document|file-store|node|content)\//.test(h)) s += 1
  return s
}

export function isJunkHref(href) {
  return JUNK_RE.test(href)
}
