import React from 'react'
import { Link } from 'react-router-dom'
import { FiBriefcase, FiFileText, FiCamera } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext.jsx'

const shortcuts = [
  { to: '/jobs', icon: FiBriefcase, label: 'Latest Jobs', color: 'bg-tea-600' },
  { to: '/utilities?tab=cv', icon: FiFileText, label: 'Build CV', color: 'bg-muga-500' },
  { to: '/utilities?tab=resizer', icon: FiCamera, label: 'Photo Resizer', color: 'bg-gamosa-500' }
]

export default function Home() {
  const { profile } = useAuth()
  return (
    <div className="p-4 pb-24 space-y-5">
      <div className="card bg-tea-700 text-white border-none">
        <h2 className="text-xl font-display font-semibold">
          {profile?.name ? `Namaskar, ${profile.name}` : 'Namaskar!'}
        </h2>
        <p className="text-sm text-tea-50/80 mt-1">Your one-stop hub for Assam's Sarkari & Private jobs.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className={`${color} text-white rounded-xl2 p-4 flex flex-col gap-2`}>
            <Icon size={22} />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Why Assam Jobs Repository?</h3>
        <ul className="text-sm text-tea-900/70 space-y-1 list-disc pl-5">
          <li>District-wise eligibility checked automatically against your profile</li>
          <li>Works on slow 2G/3G connections with offline saved jobs</li>
          <li>Available in English, Assamese, Hindi and Bengali</li>
        </ul>
      </div>
    </div>
  )
}
