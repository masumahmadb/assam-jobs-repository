import React from 'react'
import { FiX } from 'react-icons/fi'

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-display font-semibold text-tea-800">{job.role}</h2>
          <button onClick={onClose} aria-label="Close"><FiX size={22} /></button>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Department" value={job.department} />
          <Row label="District" value={job.assam_district || 'Entire Assam'} />
          <Row label="Salary" value={job.salary} />
          <Row label="Age Limit" value={job.minAge != null || job.maxAge != null ? `${job.minAge ?? '—'}–${job.maxAge ?? '—'} yrs` : '—'} />
          <Row label="Required Education" value={job.requiredEducation} />
          <Row label="Application Deadline" value={job.deadline} />
        </dl>

        {job.applyUrl && (
          <a href={job.applyUrl} target="_blank" rel="noreferrer" className="btn-primary w-full mt-4 block text-center">
            Open Official Notification
          </a>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-tea-50 pb-2">
      <dt className="text-tea-900/50">{label}</dt>
      <dd className="font-medium text-right">{value || '—'}</dd>
    </div>
  )
}
