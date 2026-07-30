import React, { useState } from 'react'
import jsPDF from 'jspdf'
import { useAuth } from '../../contexts/AuthContext.jsx'

const emptyEntry = { title: '', org: '', years: '' }

export default function CVBuilder() {
  const { profile, user } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.displayName || '',
    phone: '', email: user?.email || '', address: '',
    objective: '',
    education: [emptyEntry],
    experience: [emptyEntry],
    skills: ''
  })

  function updateArray(field, index, key, value) {
    const next = [...form[field]]
    next[index] = { ...next[index], [key]: value }
    setForm({ ...form, [field]: next })
  }

  function addRow(field) {
    setForm({ ...form, [field]: [...form[field], emptyEntry] })
  }

  function generatePDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 48
    let y = 60

    doc.setFontSize(20); doc.setFont(undefined, 'bold')
    doc.text(form.fullName || 'Your Name', margin, y); y += 22

    doc.setFontSize(10); doc.setFont(undefined, 'normal')
    doc.text([form.phone, form.email, form.address].filter(Boolean).join('  |  '), margin, y); y += 24

    section('Objective'); doc.setFontSize(10)
    y = wrapText(form.objective, y)

    section('Education')
    form.education.forEach((e) => {
      if (!e.title && !e.org) return
      doc.setFont(undefined, 'bold'); doc.text(e.title, margin, y)
      doc.setFont(undefined, 'normal'); doc.text(`${e.org}  ${e.years}`, margin, y + 14)
      y += 30
    })

    section('Experience')
    form.experience.forEach((e) => {
      if (!e.title && !e.org) return
      doc.setFont(undefined, 'bold'); doc.text(e.title, margin, y)
      doc.setFont(undefined, 'normal'); doc.text(`${e.org}  ${e.years}`, margin, y + 14)
      y += 30
    })

    section('Skills')
    y = wrapText(form.skills, y)

    doc.save(`${(form.fullName || 'cv').replace(/\s+/g, '_')}_CV.pdf`)

    function section(title) {
      y += 10
      doc.setFontSize(12); doc.setFont(undefined, 'bold')
      doc.setTextColor(11, 110, 79) // tea-600
      doc.text(title, margin, y)
      doc.setTextColor(20, 20, 20)
      y += 16
    }
    function wrapText(text, startY) {
      const lines = doc.splitTextToSize(text || '—', 500)
      doc.text(lines, margin, startY)
      return startY + lines.length * 13 + 8
    }
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <h2 className="text-lg font-semibold text-tea-800">Build your CV</h2>

      <div className="card space-y-2">
        <input placeholder="Full name" className="w-full border rounded-lg px-3 py-2"
          value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Phone" className="w-full border rounded-lg px-3 py-2"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" className="w-full border rounded-lg px-3 py-2"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Address / District" className="w-full border rounded-lg px-3 py-2"
          value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea placeholder="Career objective (2-3 lines)" className="w-full border rounded-lg px-3 py-2"
          value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
      </div>

      <EntryList label="Education" field="education" rows={form.education} updateArray={updateArray} addRow={addRow} />
      <EntryList label="Experience" field="experience" rows={form.experience} updateArray={updateArray} addRow={addRow} />

      <div className="card">
        <textarea placeholder="Skills (comma separated)" className="w-full border rounded-lg px-3 py-2"
          value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
      </div>

      <button onClick={generatePDF} className="btn-primary w-full">Download CV as PDF</button>
    </div>
  )
}

function EntryList({ label, field, rows, updateArray, addRow }) {
  return (
    <div className="card space-y-2">
      <h3 className="font-medium text-sm text-tea-800">{label}</h3>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input placeholder="Title / Degree" className="border rounded-lg px-2 py-2 col-span-1"
            value={row.title} onChange={(e) => updateArray(field, i, 'title', e.target.value)} />
          <input placeholder="Institution / Company" className="border rounded-lg px-2 py-2 col-span-1"
            value={row.org} onChange={(e) => updateArray(field, i, 'org', e.target.value)} />
          <input placeholder="Years" className="border rounded-lg px-2 py-2 col-span-1"
            value={row.years} onChange={(e) => updateArray(field, i, 'years', e.target.value)} />
        </div>
      ))}
      <button onClick={() => addRow(field)} className="text-tea-600 text-sm font-medium">+ Add row</button>
    </div>
  )
}
