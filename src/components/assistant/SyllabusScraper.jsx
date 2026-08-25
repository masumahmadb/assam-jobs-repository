import React, { useState } from 'react'
import { scrapeDocument, downloadPdf, PDF_ERROR_MESSAGES } from '../../services/docScraper.js'
import { saveToDevice } from '../../utils/download.js'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiDownload, FiLoader, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi'

function LinkInput({ value, onChange }) {
  const { t } = useLanguage()
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={value ? '' : t('paste_link')}
      inputMode="url"
      autoComplete="off"
      className="w-full border border-tea-100 rounded-xl2 px-3 py-2 text-sm"
    />
  )
}

function ActionButton({ busy, onClick, icon, label }) {
  return (
    <button onClick={onClick} disabled={busy} className="btn-outline px-3 py-2 text-xs flex items-center gap-1 whitespace-nowrap disabled:opacity-50">
      {icon}{label}
    </button>
  )
}

function renderValue(v) {
  if (v == null || v === '') return null
  if (Array.isArray(v)) return v.length ? v.map((x, i) => <li key={i} className="ml-4 list-disc">{typeof x === 'object' ? JSON.stringify(x) : String(x)}</li>) : null
  if (typeof v === 'object') {
    const rows = Object.entries(v).filter(([, val]) => renderValue(val) != null)
    if (!rows.length) return null
    return (
      <ul className="space-y-1">
        {rows.map(([k, val]) => (
          <li key={k}><span className="font-medium">{k.replace(/_/g, ' ')}:</span> {val}</li>
        ))}
      </ul>
    )
  }
  return String(v)
}

function ResultCard({ result, title, onPdf }) {
  const [open, setOpen] = useState(true)
  if (!result || result.status === undefined && !result.data) return null
  if (result.status === 'reasoned') {
    return (
      <div className="mt-2 bg-white border border-tea-100 rounded-xl2 p-3 text-sm">
        <p className="font-medium">{title}</p>
        <p className="mt-1.5 text-xs text-tea-900/80">{result.reason}</p>
        {result.sourceUrl && <p className="mt-2 text-[11px] text-tea-900/50 break-all">Source: <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="underline">{result.sourceUrl}</a></p>}
      </div>
    )
  }
  if ((result.status === 'contact' || result.status === 'not_found')) {
    return (
      <div className="mt-2 bg-white border border-tea-100 rounded-xl2 p-3 text-sm">
        <p className="text-xs text-tea-900/80">{result.message}</p>
      </div>
    )
  }
  const entries = Object.entries(result.data || {}).filter(([, v]) => renderValue(v) != null)
  if (!entries.length) return <p className="text-xs text-tea-900/60 mt-2">No structured data found on that page.</p>
  return (
    <div className="mt-2 bg-white border border-tea-100 rounded-xl2 p-3 text-sm">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 font-medium w-full text-left">
        {title}
        {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>
      {result.notice && <p className="mt-1.5 text-[11px] text-amber-700">{result.notice}</p>}
      {open && (
        <ul className="mt-2 space-y-1.5 list-none">
          {entries.map(([k, v]) => (
            <li key={k}>
              <span className="font-medium">{k.replace(/_/g, ' ')}: </span>
              {Array.isArray(v)
                ? <ul className="mt-0.5">{v.map((item, i) => <li key={i} className="ml-4 list-disc">{renderItem(item)}</li>)}</ul>
                : renderItem(v)}
            </li>
          ))}
        </ul>
      )}
      {result.pdfUrl && (
        <button onClick={() => onPdf(result.pdfUrl)} className="mt-2 btn-outline px-3 py-1.5 text-xs flex items-center gap-1">
          <FiDownload size={12} /> Download PDF
        </button>
      )}
      {result.sourceUrl && <p className="mt-2 text-[11px] text-tea-900/50 break-all">Source: <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="underline">{result.sourceUrl}</a></p>}
    </div>
  )
}

function renderItem(item) {
  if (item != null && typeof item === 'object') {
    return Object.entries(item).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k.replace(/_/g, ' ')}: ${Array.isArray(v) || typeof v === 'object' ? JSON.stringify(v) : v}`).join(' — ')
  }
  return String(item)
}

export default function SyllabusScraper() {
  const { lang, t } = useLanguage()
  const [links, setLinks] = useState({ syllabus: '', pyq: '' })
  const [busy, setBusy] = useState(null)
  const [status, setStatus] = useState({})
  const [results, setResults] = useState({})

  function setLink(type, value) {
    setLinks((l) => ({ ...l, [type]: value }))
    setStatus((s) => ({ ...s, [type]: null }))
  }

  async function handleScrape(type) {
    const url = links[type].trim()
    if (!url || busy) return
    setBusy(`${type}-scrape`)
    setStatus((s) => ({ ...s, [type]: { kind: 'info', msg: t('scraping') } }))
    try {
      const result = await scrapeDocument({ url, type, language: lang })
      setResults((r) => ({ ...r, [type]: result }))
      setStatus((s) => ({ ...s, [type]: null }))
    } catch (err) {
      setStatus((s) => ({ ...s, [type]: { kind: 'error', msg: err.message || 'scrape_failed' } }))
    } finally {
      setBusy(null)
    }
  }

  async function handlePdf(type) {
    const url = links[type].trim()
    if (!url || busy) return
    await downloadToDevice(url, `${type}-pdf`)
  }

  async function handlePdfUrl(url) {
    if (busy) return
    await downloadToDevice(url, 'pdf')
  }

  async function downloadToDevice(url, busyKey) {
    setBusy(busyKey)
    setStatus((s) => ({ ...s, [busyKey.split('-')[0]]: { kind: 'info', msg: t('downloading') } }))
    try {
      const { blob, filename } = await downloadPdf(url)
      await saveToDevice(blob, filename || 'document.pdf')
      setStatus((s) => ({ ...s, [busyKey.split('-')[0]]: { kind: 'success', msg: t('pdf_saved') } }))
    } catch (err) {
      const msg = PDF_ERROR_MESSAGES[err.message] || err.message || 'Download failed.'
      setStatus((s) => ({ ...s, [busyKey.split('-')[0]]: { kind: 'error', msg } }))
    } finally {
      setBusy(null)
    }
  }

  const sections = [
    { type: 'syllabus', emoji: '📚', title: t('syllabus_section'), scrapeLabel: t('scrape_syllabus'), pdfLabel: t('download_syllabus_pdf'), resultTitle: t('syllabus_section') },
    { type: 'pyq', emoji: '📝', title: t('pyq_section'), scrapeLabel: t('scrape_pyq'), pdfLabel: t('download_pyq_pdf'), resultTitle: t('pyq_section') }
  ]

  return (
    <div className="bg-white border border-tea-100 rounded-xl2 p-3 space-y-3 mb-3 text-sm">
      {sections.map((sec) => (
        <div key={sec.type}>
          <p className="font-medium mb-1.5">{sec.emoji} {sec.title}</p>
          <LinkInput value={links[sec.type]} onChange={(v) => setLink(sec.type, v)} />
          <div className="flex gap-2 mt-1.5">
            <ActionButton
              busy={busy === `${sec.type}-scrape`}
              onClick={() => handleScrape(sec.type)}
              icon={busy === `${sec.type}-scrape` ? <FiLoader className="animate-spin" /> : <FiSearch />}
              label={busy === `${sec.type}-scrape` ? t('scraping') : sec.scrapeLabel}
            />
            <ActionButton
              busy={busy === `${sec.type}-pdf`}
              onClick={() => handlePdf(sec.type)}
              icon={busy === `${sec.type}-pdf` ? <FiLoader className="animate-spin" /> : <FiDownload />}
              label={sec.pdfLabel}
            />
          </div>
          {status[sec.type] && (
            <p className={`mt-1.5 text-xs ${status[sec.type].kind === 'error' ? 'text-red-600' : status[sec.type].kind === 'success' ? 'text-green-700' : 'text-tea-900/60'}`}>
              {status[sec.type].msg}
            </p>
          )}
          <ResultCard result={results[sec.type]} title={sec.resultTitle} onPdf={handlePdfUrl} />
        </div>
      ))}
    </div>
  )
}
