import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { updateUserProfile } from '../../firebase/firestore.js'
import { ASSAM_DISTRICTS } from '../../utils/districts.js'

export default function ProfileSetup() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    education_level: 'graduate', birth_year: 2000, caste_status: 'general', assam_district: ASSAM_DISTRICTS[0]
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await updateUserProfile(user.uid, form)
    await refreshProfile()
    setSaving(false)
    navigate('/map')
  }

  return (
    <div className="min-h-screen bg-sand-50 px-6 py-10">
      <h1 className="text-2xl font-display font-semibold text-tea-700 mb-1">Set up your profile</h1>
      <p className="text-sm text-tea-900/60 mb-6">Used only to check job eligibility for you.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Education level</label>
          <select className="w-full border border-tea-100 rounded-xl2 px-4 py-3 mt-1"
            value={form.education_level}
            onChange={(e) => setForm({ ...form, education_level: e.target.value })}>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="diploma">Diploma</option>
            <option value="graduate">Graduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Birth year</label>
          <input type="number" min="1960" max="2012" className="w-full border border-tea-100 rounded-xl2 px-4 py-3 mt-1"
            value={form.birth_year} onChange={(e) => setForm({ ...form, birth_year: Number(e.target.value) })} />
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <select className="w-full border border-tea-100 rounded-xl2 px-4 py-3 mt-1"
            value={form.caste_status} onChange={(e) => setForm({ ...form, caste_status: e.target.value })}>
            <option value="general">General</option>
            <option value="obc">OBC/MOBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="pwd">PwD</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">District</label>
          <select className="w-full border border-tea-100 rounded-xl2 px-4 py-3 mt-1"
            value={form.assam_district} onChange={(e) => setForm({ ...form, assam_district: e.target.value })}>
            {ASSAM_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <button disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save & Continue'}</button>
      </form>
    </div>
  )
}
