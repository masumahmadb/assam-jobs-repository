import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { logOut } from '../firebase/auth.js'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  async function handleSignOut() {
    await logOut()
    navigate('/login')
  }

  return (
    <>
      <TopBar title={t('profile')} />
      <div className="p-4 space-y-3">
        <div className="card">
          <p className="font-semibold">{profile?.name || user?.displayName}</p>
          <p className="text-sm text-tea-900/60">{user?.email}</p>
        </div>
        <div className="card grid grid-cols-2 gap-2 text-sm">
          <Info label="Education" value={profile?.education_level} />
          <Info label="Birth year" value={profile?.birth_year} />
          <Info label="Category" value={profile?.caste_status} />
          <Info label="District" value={profile?.assam_district} />
        </div>
        <button onClick={handleSignOut} className="btn-outline w-full">{t('signOut')}</button>
      </div>
    </>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-tea-900/40 text-xs">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  )
}
