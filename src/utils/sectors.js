// Sector taxonomy for Assam jobs — grouped by administrative control / sector.
// Each job is auto-classified by keyword matching against its fields.

export const SECTORS = [
  {
    id: 'police_defence',
    name: 'Police & Defence',
    keywords: ['slprb', 'police', 'defence', 'assam rifles', 'fire & emergency', 'fire and emergency', 'home guard', 'constable', 'sub-inspector', 'si ', 'commando', 'special police']
  },
  {
    id: 'health',
    name: 'Health & Family Welfare',
    keywords: ['nhm', 'national health mission', 'dhsfw', 'dme', 'health', 'medical', 'hospital', 'nursing', 'ayush', 'paramedic', 'staff nurse', 'pharmacy', 'medical college']
  },
  {
    id: 'education',
    name: 'Education & Teaching',
    keywords: ['education', 'school', 'teacher', 'teaching', 'samagra shiksha', 'ssa', 'scert', 'dse', 'directorate of education', 'university', 'college', 'deled', 'd.el.ed', 'lp school', 'me school', 'madrasa', 'tetu', 'academic', 'professor', 'lecturer']
  },
  {
    id: 'engineering_infra',
    name: 'Engineering & Infrastructure',
    keywords: ['pwd', 'public works', 'wrd', 'water resource', 'phed', 'public health engineering', 'urban development', 'municipal', 'town', 'irrigation', 'construction', 'civil works', 'guwahati metropolitan', 'gmda', 'engineering']
  },
  {
    id: 'power_energy',
    name: 'Power & Energy',
    keywords: ['apdcl', 'apgcl', 'aegcl', 'power', 'electricity', 'energy', 'upper assam electricity', 'distribution company']
  },
  {
    id: 'agriculture_allied',
    name: 'Agriculture & Allied',
    keywords: ['agriculture', 'horticulture', 'veterinary', 'fishery', 'fisheries', 'forest', 'sericulture', 'animal husbandry', 'dairy', 'irrigation scheme', 'farming', 'aad b']
  },
  {
    id: 'admin_civil',
    name: 'Administration & Civil Services',
    keywords: ['apsc', 'public service commission', 'dc office', 'deputy commissioner', 'secretariat', 'panchayat', 'rural development', 'election', 'revenue', 'circle office', 'labour', 'welfare', 'general administration', 'cooperation', 'excise', 'registration', 'collectorate', 'lda', 'umpc']
  },
  {
    id: 'banking_finance',
    name: 'Banking & Finance',
    keywords: ['bank', 'banking', 'ibps', 'sbi', 'financial', 'finance', 'insurance', 'lic ', 'cooperative bank', 'gramin bank']
  },
  {
    id: 'railway_transport',
    name: 'Railways & Transport',
    keywords: ['railway', 'rrb', 'rrcn', 'transport', 'astc', 'assam state transport', 'motor vehicle', 'ports', 'inland waterways']
  },
  {
    id: 'judiciary_law',
    name: 'Judiciary & Law',
    keywords: ['court', 'judicial', 'judiciary', 'legal', 'high court', 'district court', 'advocate', 'law']
  },
  {
    id: 'it_telecom',
    name: 'IT & Telecom',
    keywords: ['information technology', ' it ', 'electronics', 'nic ', 'software', 'computer', 'telecom', 'bsnl', 'digital', 'data entry operator']
  },
  {
    id: 'psu_central',
    name: 'PSU & Central Govt',
    keywords: ['iocl', 'oil india', 'ntpc', 'pgcil', 'csir', 'ssc', 'upsc', 'isro', 'drdo', 'ongc', 'gail', 'bhel', 'central govt', 'government of india', 'psu', 'apprentice', 'north eastern council', 'nec ']
  },
  {
    id: 'skill_employment',
    name: 'Skill Development & Employment',
    keywords: ['skill', 'employment', 'rojgar', 'kaushal', 'apprenticeship', 'training', 'placement', 'mission', 'internship']
  },
  {
    id: 'tourism_culture',
    name: 'Tourism, Culture & Sports',
    keywords: ['tourism', 'culture', 'sports', 'youth welfare', 'museum', 'library', 'archaeology', 'srimanta sankardeva']
  }
]

export const OTHER_SECTOR = { id: 'others', name: 'Others', keywords: [] }

// Classify a job into a sector by scanning its text fields.
export function classifyJob(job) {
  const hay = [
    job.department,
    job.title,
    job.role,
    job.sourceSite,
    job.noticeCategory,
    job.category,
    job.summary
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  let best = null
  let bestScore = 0
  for (const sector of SECTORS) {
    let score = 0
    for (const kw of sector.keywords) {
      if (hay.includes(kw)) score += kw.length // longer/more specific matches weigh more
    }
    if (score > bestScore) {
      bestScore = score
      best = sector
    }
  }
  return best || OTHER_SECTOR
}

export const ALL_SECTORS = [...SECTORS, OTHER_SECTOR]
