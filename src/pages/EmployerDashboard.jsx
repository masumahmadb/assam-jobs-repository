import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { employerLogOut } from '../firebase/employerAuth.js'
import PostJobForm from '../components/jobs/PostJobForm.jsx'

export default function EmployerDashboard({ user }) {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'private_jobs'),
      where('employerId', '==', user.uid),
      orderBy('postedAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [user])

  async function handleDelete(jobId) {
    if (confirm('Delete this job?')) {
      await deleteDoc(doc(db, 'private_jobs', jobId))
    }
  }

  async function handleLogout() {
    await employerLogOut()
    navigate('/jobs')
  }

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white border-b border-tea-50 p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-tea-800">My Jobs</h1>
        <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
      </div>
      {successMsg && (
        <div className="m-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMsg}
          <button onClick={() => setSuccessMsg('')} className="ml-2 underline">Dismiss</button>
        </div>
      )}
      {showForm ? (
        <PostJobForm employerId={user.uid} onSuccess={() => {
          setShowForm(false)
          setSuccessMsg('Job posted! Awaiting admin approval.')
        }} />
      ) : (
        <button onClick={() => setShowForm(true)} className="btn-primary m-4 w-[calc(100%-2rem)] py-3">+ Post New Job</button>
      )}
      <div className="space-y-3 p-4">
        {jobs.length === 0 ? (
          <p className="text-tea-900/60 text-center py-6">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="card p-4 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-tea-900">{job.jobTitle}</h3>
                  <p className="text-sm text-tea-900/60">{job.companyName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.status === 'approved' ? 'bg-green-50 text-green-700' : job.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {job.status === 'pending' ? 'Awaiting Approval' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-tea-900/60">{job.location}</p>
              {job.deadline && <p className="text-xs text-red-600">Deadline: {job.deadline}</p>}
              <div className="flex gap-2 pt-2">
                <button onClick={() => navigate(`/private-jobs/${job.id}`)} className="btn-outline py-2 px-3 text-sm flex-1">View</button>
                <button onClick={() => handleDelete(job.id)} className="btn-outline py-2 px-3 text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
