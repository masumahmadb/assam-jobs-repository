import React from 'react'
import { FiX, FiExternalLink, FiShare2 } from 'react-icons/fi'

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: job.role || job.title,
        text: `${job.role || job.title} - ${job.department}`,
        url: job.applyUrl || window.location.href
      })
    } else {
      navigator.clipboard.writeText(job.applyUrl || window.location.href)
      alert('Link copied!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-display font-semibold text-tea-800 pr-4">
            {job.role || job.title}
          </h2>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleShare} aria-label="Share">
              <FiShare2 size={20} className="text-tea-600" />
            </button>
            <button onClick={onClose} aria-label="Close">
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* Summary */}
        {job.summary && job.summary !== 'Not specified' && (
          <p className="text-sm text-tea-900/70 bg-tea-50 rounded-xl p-3 mb-4">
            {job.summary}
          </p>
        )}


        {/* Details */}
        <dl className="space-y-2 text-sm">
          <Row label="Department" value={job.department} />
          <Row label="District" value={job.assam_district || 'Entire Assam'} />
          <Row label="Vacancies" value={job.vacancies} highlight="blue" />
          <Row label="Employment Type" value={job.employmentType} highlight="purple" />
          <Row label="Salary" value={job.salary} />
          <Row label="Age Limit" value={
            job.minAge != null || job.maxAge != null
              ? `${job.minAge ?? '–'} - ${job.maxAge ?? '–'} yrs`
              : null
          } />
          <Row label="Required Education" value={job.requiredEducation} />
          <Row label="Exam Pattern" value={job.examPattern} />
          <Row label="Application Deadline" value={job.deadline} highlight="red" />
        </dl>

        {/* Syllabus */}
        {job.syllabus && job.syllabus !== 'Not specified' && (
          <div className="mt-4 border border-tea-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-tea-800 mb-1">📚 Syllabus / Exam Pattern</p>
            <p className="text-sm text-tea-900/70">{job.syllabus}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full block text-center flex items-center justify-center gap-2"
            >
              <FiExternalLink size={16} />
              Open Official Notification
            </a>
          )}
          <p className="text-xs text-tea-900/40 text-center">
            Always verify details on the official website before applying.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  if (!value || value === 'Not specified' || value === '–-– yrs') return null
  const highlightClasses = {
    red: 'text-red-700 bg-red-50 px-2 py-0.5 rounded-full',
    blue: 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full',
    purple: 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full'
  }
  return (
    <div className="flex justify-between border-b border-tea-50 pb-2 items-center gap-2">
      <dt className="text-tea-900/50 shrink-0">{label}</dt>
      <dd className={`font-medium text-right ${highlight ? highlightClasses[highlight] : ''}`}>
        {value}
      </dd>
    </div>
  )
}