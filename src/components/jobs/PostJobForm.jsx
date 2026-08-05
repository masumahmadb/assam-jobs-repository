import React, { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config.js'

const CATEGORIES = ['State Govt', 'Central Govt', 'PSU', 'Institute', 'Private', 'Other']

export default function PostJobForm({ employerId, onSuccess }) {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    category: 'Private',
    location: '',
    description: '',
    salary: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    applyMethod: 'email',
    applyUrl: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await addDoc(collection(db, 'private_jobs'), {
        ...formData,
        employerId,
        status: 'pending',
        postedAt: serverTimestamp(),
        jobType: 'private'
      })
      setFormData({
        companyName: '', jobTitle: '', category: 'Private', location: '', description: '', salary: '',
        contactName: '', contactPhone: '', contactEmail: '', applyMethod: 'email', applyUrl: '', deadline: ''
      })
      onSuccess()
    } catch (err) {
      setError('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      <h2 className="text-lg font-semibold text-tea-800">Post a Job</h2>
      <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-tea-100 rounded-lg px-4 py-2">
        {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
      </select>
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required rows="4" className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <input type="text" name="salary" placeholder="Salary (optional)" value={formData.salary} onChange={handleChange} className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <input type="text" name="contactName" placeholder="Contact Person Name" value={formData.contactName} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <input type="tel" name="contactPhone" placeholder="Contact Phone" value={formData.contactPhone} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <input type="email" name="contactEmail" placeholder="Contact Email" value={formData.contactEmail} onChange={handleChange} required className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      <fieldset className="border border-tea-100 rounded-lg p-3">
        <legend className="text-sm font-medium">How to Apply?</legend>
        <label className="flex items-center gap-2"><input type="radio" name="applyMethod" value="email" checked={formData.applyMethod === 'email'} onChange={handleChange} /><span className="text-sm">Email</span></label>
        <label className="flex items-center gap-2"><input type="radio" name="applyMethod" value="website" checked={formData.applyMethod === 'website'} onChange={handleChange} /><span className="text-sm">Website/Form</span></label>
        {formData.applyMethod === 'website' && <input type="url" name="applyUrl" placeholder="Application URL" value={formData.applyUrl} onChange={handleChange} className="w-full border border-tea-100 rounded-lg px-4 py-2 mt-2" />}
      </fieldset>
      <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border border-tea-100 rounded-lg px-4 py-2" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Posting...' : 'Post Job'}</button>
    </form>
  )
}
