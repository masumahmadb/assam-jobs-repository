const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || '/api'

export async function scrapeDocument({ url, type, language = 'en' }) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type, language })
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'scrape_failed')
  return body
}

export async function checkPdf(url) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/pdf?url=${encodeURIComponent(url)}`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'pdf_failed')
  return body
}

export async function downloadPdf(url) {
  const { filename } = await checkPdf(url)
  const res = await fetch(`${FUNCTIONS_BASE_URL}/pdf?url=${encodeURIComponent(url)}&download=1`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'pdf_failed')
  }
  return { blob: await res.blob(), filename }
}

export const PDF_ERROR_MESSAGES = {
  invalid_url: 'That link does not look valid.',
  invalid_protocol: 'Only http/https links are supported.',
  blocked_host: 'This link is not allowed for security reasons.',
  dns_lookup_failed: 'Could not resolve that link.',
  fetch_failed: 'Could not reach that link.',
  upstream_error: 'The site returned an error for that link.',
  file_too_large: 'The PDF is too large to download.',
  not_a_pdf: 'That link is not a PDF file.',
  pdf_failed: 'Something went wrong while fetching the PDF.'
}
