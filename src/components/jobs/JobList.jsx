import React, { useEffect, useState } from 'react'
import { subscribeToJobs } from '../../firebase/firestore.js'
import { ListSkeleton } from '../common/SkeletonLoader.jsx'
import JobCard from './JobCard.jsx'
import JobDetailModal from './JobDetailModal.jsx'
import { ASSAM_DISTRICTS } from '../../utils/districts.js'

export default function JobList() {
  const [jobs, setJobs] = useState(null)
  const [district, setDistrict] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const unsub = subscribeToJobs({ district }, setJobs)
    return unsub
  }, [district])

  return (
    <div className="p-4 pb-24 space-y-3">
      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="w-full border border-tea-100 rounded-xl2 px-4 py-3 bg-white"
      >
        <option value="all">All Districts</option>
        {ASSAM_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      {jobs === null ? (
        <ListSkeleton count={5} />
      ) : jobs.length === 0 ? (
        <p className="text-center text-tea-900/50 py-10">No active jobs found for this filter.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} onOpen={setSelected} />)
      )}

      <JobDetailModal job={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
