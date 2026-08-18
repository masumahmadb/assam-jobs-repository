import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiBriefcase, FiTool, FiMessageCircle, FiUser } from 'react-icons/fi'
import { useLanguage } from '../../contexts/LanguageContext.jsx'

const items = [
  { to: '/', icon: FiHome, key: 'home' },
  { to: '/jobs', icon: FiBriefcase, key: 'jobs' },
  { to: '/utilities', icon: FiTool, key: 'utilities' },
  { to: '/newjobsnews', icon: FiMessageCircle, key: 'newjobsnews' },
  { to: '/assistant', icon: FiMessageCircle, key: 'assistant' },
  { to: '/profile', icon: FiUser, key: 'profile' }
]

export default function BottomNav() {
  const { t } = useLanguage()
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-tea-100 flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-40 overflow-x-auto animate-navPulse">
      {items.map(({ to, icon: Icon, key }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>

            `flex flex-col items-center gap-1 text-xs px-2 py-1 rounded-lg shrink-0 ${
              isActive ? 'text-tea-700 font-semibold' : 'text-tea-900/50'
            }`
          }
        >
          <Icon size={20} />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  )
}