// Single-tap sharing via native share sheet (falls back to WhatsApp/SMS deep links)
export async function shareJob(job) {
  const text = `${job.role} — ${job.department}\nDistrict: ${job.assam_district || 'Entire Assam'}\nDeadline: ${job.deadline || 'N/A'}\n${job.applyUrl || ''}`

  if (navigator.share) {
    try {
      await navigator.share({ title: job.role, text })
      return
    } catch (_) { /* user cancelled */ }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

export function shareViaSMS(text) {
  window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank')
}
