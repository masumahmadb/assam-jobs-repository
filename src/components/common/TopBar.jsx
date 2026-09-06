import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings, FiHelpCircle, FiMoon, FiSun } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { useOffline } from '../../hooks/useOffline.js'
import NotificationBell from '../common/NotificationBell.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
]

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'FiHome' },
  { path: '/jobs', label: 'Jobs', icon: 'FiBriefcase' },
  { path: '/newjobsnews', label: 'News', icon: 'FiFileText' },
  { path: '/utilities', label: 'Tools', icon: 'FiTool' },
  { path: '/assistant', label: 'Assistant', icon: 'FiMessageSquare' },
]

export default function TopBar({ title }) {
  const { lang, changeLanguage } = useLanguage()
  const { user, profile, logOut } = useAuth()
  const isOffline = useOffline()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: 'FiHome' },
    { path: '/jobs', label: 'Jobs', icon: 'FiBriefcase' },
    { path: '/newjobsnews', label: 'News', icon: 'FiFileText' },
    { path: '/utilities', label: 'Tools', icon: 'FiTool' },
    { path: '/assistant', label: 'Assistant', icon: 'FiMessageSquare' },
  ]

  const handleSignOut = async () => {
    try {
      const { logOut: doLogOut } = await import('../../firebase/auth.js')
      await doLogOut()
      window.location.href = '/login'
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-tea-600 text-white shadow-lg">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-14">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center justify-between w-full lg:justify-start gap-4">
            <button
              className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white" aria-label="Assam Jobs Repository Home">
              <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              <span className="hidden sm:block font-display font-bold text-lg">Assam Jobs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-8" aria-label="Main navigation">
            {NAV_ITEMS.map(({ path, label }) => {
              const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${location.pathname === path
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                  aria-current={location.pathname === path ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 lg:ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white/10 text-white text-sm rounded-xl px-3 py-1.5 border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Select language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-medium">
                  {profile?.name?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium">{profile?.name || user?.displayName || 'User'}</span>
                <FiUser size={16} className="text-white/60" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="fixed right-4 top-16 z-50 w-56 animate-scale-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-tea-100 overflow-hidden">
                      <div className="p-4 border-b border-tea-100">
                        <p className="font-semibold text-tea-900">{profile?.name || user?.displayName || 'User'}</p>
                        <p className="text-sm text-tea-600 truncate">{user?.email}</p>
                      </div>
                      <nav className="py-1">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-tea-700 hover:bg-tea-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiUser size={18} /> Profile
                        </Link>
                        <Link to="/profile-setup" className="flex items-center gap-3 px-4 py-2.5 text-tea-700 hover:bg-tea-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiSettings size={18} /> Edit Profile
                        </Link>
                        <Link to="/utilities" className="flex items-center gap-3 px-4 py-2.5 text-tea-700 hover:bg-tea-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiTool size={18} /> Tools
                        </Link>
                        <Link to="/assistant" className="flex items-center gap-3 px-4 py-2.5 text-tea-700 hover:bg-tea-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiMessageSquare size={18} /> Assistant
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-tea-700 hover:bg-tea-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiHelpCircle size={18} /> Help
                        </Link>
                        <div className="border-t border-tea-100 my-1" />
                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 text-muga-600 hover:bg-muga-50 transition-colors">
                          <FiLogOut size={18} /> Sign Out
                        </button>
                      </nav>
                    </div>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down border-t border-white/10">
          <nav className="py-4 space-y-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors
                  ${location.pathname === path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {label}
                </Link>
              ))}
            <div className="pt-4 border-t border-white/10">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-left text-muga-600 hover:bg-muga-50/50 rounded-xl transition-colors">
                <FiLogOut size={20} /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-muga-500/90 text-tea-900 text-xs rounded-lg px-3 py-1.5 mx-4 -mb-3 inline-block animate-slide-down" role="alert">
          <FiWifiOff size={12} className="inline mr-1" /> Offline — showing saved data
        </div>
      )}

      {/* Mobile Bottom Nav (Alternative) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-tea-600 border-t border-white/10 safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {NAV_ITEMS.map(({ path, label }) => {
            const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl text-xs transition-colors
                  ${location.pathname === path ? 'text-white bg-white/10' : 'text-white/70'}`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}

export default TopBar