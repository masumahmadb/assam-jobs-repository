import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAIL = 'masumahmadb@gmail.com'

export default function AdminPanel() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/login'); return }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return }

    const q = query(collection(db, 'private_jobs'), where('status', '==', filter))
    const unsub = onSnapshot(q, (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setJobsLoading(false)
    })
    return unsub
  }, [user, loading, filter])

  async function handleStatus(jobId, status) {
    await updateDoc(doc(db, 'private_jobs', jobId), { status })
  }

  if (loading) return <div className="p-10 text-center text-tea-900/50">Loading...</div>
  if (!user || user.email !== ADMIN_EMAIL) return null

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white border-b border-tea-50 p-4">
        <h1 className="text-lg font-semibold text-tea-800">Admin Panel</h1>
        <div className="flex gap-2 mt-3">
          {['pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === s ? 'bg-tea-800 text-white' : 'bg-tea-50 text-tea-800'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {jobsLoading && <p className="text-center text-tea-900/50 py-6">Loading...</p>}
        {!jobsLoading && jobs.length === 0 && (
          <p className="text-center text-tea-900/50 py-6">No {filter} jobs.</p>
        )}
        {jobs.map(job => (
          <div key={job.id} className="card p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-tea-900">{job.jobTitle}</h3>
                <p className="text-sm text-tea-900/60">{job.companyName}</p>
                <p className="text-sm text-tea-900/60">{job.location}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                job.status === 'approved' ? 'bg-green-50 text-green-700' :
                job.status === 'rejected' ? 'bg-red-50 text-red-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {job.status}
              </span>
            </div>

            <p className="text-sm text-tea-900/70">{job.description?.slice(0, 100)}...</p>

            <div className="text-xs text-tea-900/50 space-y-1">
              <p>📧 {job.contactEmail}</p>
              <p>📞 {job.contactPhone}</p>
              {job.deadline && <p>⏰ Deadline: {job.deadline}</p>}
            </div>

            {filter === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleStatus(job.id, 'approved')}
                  className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium">
                  ✅ Approve
                </button>
                <button onClick={() => handleStatus(job.id, 'rejected')}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium">
                  ❌ Reject
                </button>
              </div>
            )}
            {filter === 'approved' && (
              <button onClick={() => handleStatus(job.id, 'rejected')}
                className="w-full py-2 rounded-lg bg-red-500 text-white text-sm font-medium">
                ❌ Reject
              </button>
            )}
            {filter === 'rejected' && (
              <button onClick={() => handleStatus(job.id, 'approved')}
                className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-medium">
                ✅ Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
