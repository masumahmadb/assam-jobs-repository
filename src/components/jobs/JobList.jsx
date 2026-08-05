import React, { useEffect, useState } from 'react'
import { subscribeToJobs, subscribeToPrivateJobs } from '../../firebase/firestore.js'
import { ListSkeleton } from '../common/SkeletonLoader.jsx'
import JobCard from './JobCard.jsx'
import JobDetailModal from './JobDetailModal.jsx'
import { ASSAM_DISTRICTS } from '../../utils/districts.js'

export default function JobList() {
  const [govtJobs, setGovtJobs] = useState(null)
  const [privateJobs, setPrivateJobs] = useState(null)
  const [district, setDistrict] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const unsub = subscribeToJobs({ district }, setGovtJobs)
    return unsub
  }, [district])

  useEffect(() => {
    const unsub = subscribeToPrivateJobs(setPrivateJobs)
    return unsub
  }, [])

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* GOVT SECTION */}
      <div>
        <h2 className="text-lg font-semibold text-tea-800 mb-3">Government Jobs</h2>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border border-tea-100 rounded-xl px-4 py-3 bg-white mb-3"
        >
          <option value="all">All Districts</option>
          {ASSAM_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {govtJobs === null ? (
          <ListSkeleton count={3} />
        ) : govtJobs.length === 0 ? (
          <p className="text-center text-tea-900/50 py-6 text-sm">No government jobs found for this filter.</p>
        ) : (
          <div className="space-y-3">
            {govtJobs.map((job) => <JobCard key={job.id} job={job} onOpen={setSelected} />)}
          </div>
        )}
      </div>

      {/* PRIVATE SECTION */}
      <div className="border-t border-tea-100 pt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-yellow-900">
            <strong>Disclaimer:</strong> We do not verify employers or job authenticity. Never pay money to apply. We are not responsible for fraud or scams.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-tea-800 mb-3">Private Jobs</h2>

        {privateJobs === null ? (
          <ListSkeleton count={2} />
        ) : privateJobs.length === 0 ? (
          <p className="text-center text-tea-900/50 py-6 text-sm">No private jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {privateJobs.map((job) => <JobCard key={job.id} job={job} onOpen={setSelected} />)}
          </div>
        )}
      </div>

      <JobDetailModal job={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
