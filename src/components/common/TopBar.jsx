import React from 'react'
import { LANGUAGES } from '../../utils/i18n.js'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { useOffline } from '../../hooks/useOffline.js'
import NotificationBell from './NotificationBell.jsx'

export default function TopBar({ title }) {
  const { lang, changeLanguage } = useLanguage()
  const isOffline = useOffline()

  return (
    <header className="sticky top-0 z-30 bg-tea-600 text-white px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between py-3">
        <h1 className="text-lg font-semibold font-display">{title}</h1>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-tea-700 text-white text-sm rounded-lg px-2 py-1 border border-tea-400/40"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
      {isOffline && (
        <div className="text-xs bg-muga-500/90 text-tea-900 rounded-lg px-2 py-1 mb-2 inline-block">
          Offline — showing saved jobs & documents
        </div>
      )}
    </header>
  )
}
