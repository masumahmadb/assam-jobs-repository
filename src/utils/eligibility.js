// Core District/Profile Eligibility Engine (used by the Interactive Map).
// Compares a user's profile against a job_listings document and returns
// a verdict plus the specific reasons, so the UI can explain "why".

export function checkEligibility(profile, job) {
  if (!profile) return { eligible: false, reasons: ['Complete your profile to check eligibility.'] }

  const reasons = []
  let eligible = true

  // Age check
  if (job.minAge != null || job.maxAge != null) {
    const age = new Date().getFullYear() - Number(profile.birth_year || 0)
    if (job.minAge != null && age < job.minAge) { eligible = false; reasons.push(`Minimum age is ${job.minAge}`) }
    if (job.maxAge != null && age > job.maxAge) {
      const relaxedMax = job.maxAge + (relaxationYears(profile.caste_status) || 0)
      if (age > relaxedMax) { eligible = false; reasons.push(`Maximum age is ${job.maxAge} (+ category relaxation)`) }
    }
  }

  // Education check
  if (job.requiredEducation && profile.education_level) {
    const rank = { '10th': 1, '12th': 2, diploma: 3, graduate: 4, postgraduate: 5 }
    if ((rank[profile.education_level] ?? 0) < (rank[job.requiredEducation] ?? 0)) {
      eligible = false
      reasons.push(`Requires ${job.requiredEducation} or higher`)
    }
  }

  // District check (some jobs are district-specific / domicile-restricted)
  if (job.districtRestricted && job.assam_district && profile.assam_district) {
    if (job.assam_district !== profile.assam_district) {
      eligible = false
      reasons.push(`Restricted to residents of ${job.assam_district}`)
    }
  }

  if (eligible) reasons.push('Meets all listed criteria')
  return { eligible, reasons }
}

function relaxationYears(casteStatus) {
  const table = { general: 0, obc: 3, sc: 5, st: 5, pwd: 10 }
  return table[(casteStatus || '').toLowerCase()] ?? 0
}
