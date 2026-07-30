import React from 'react'
import { FiMapPin, FiShare2 } from 'react-icons/fi'
import { shareJob } from '../../utils/share.js'

export default function JobCard({ job, onOpen }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-tea-900">{job.role}</h3>
          <p className="text-sm text-tea-900/60">{job.department}</p>
        </div>
        {job.status === 'archived' && (
          <span className="text-xs bg-tea-100 text-tea-700 px-2 py-1 rounded-full">Closed</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-tea-900/60 mt-2">
        <FiMapPin size={14} /> {job.assam_district || 'Entire Assam'}
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => onOpen(job)} className="btn-primary flex-1 py-2 text-sm">View Details</button>
        <button onClick={() => shareJob(job)} className="btn-outline py-2 px-3" aria-label="Share job">
          <FiShare2 size={16} />
        </button>
      </div>
    </div>
  )
}
