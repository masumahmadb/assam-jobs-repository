import React from 'react'
import { Link } from 'react-router-dom'
import { FiBriefcase, FiFileText, FiCamera, FiBookOpen, FiTarget, FiTrendingUp, FiAward, FiZap, FiShield, FiHeart, FiStar, FiClock, FiMessageSquare, FiTool, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext.jsx'
import UpdatesTicker from '../common/UpdatesTicker.jsx'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, AvatarGroup } from '../ui/21st'

const shortcuts = [
  { to: '/jobs', icon: FiBriefcase, label: 'Latest Jobs', color: 'bg-tea-600', description: 'Browse 10,000+ govt & private jobs' },
  { to: '/utilities?tab=cv', icon: FiFileText, label: 'Build CV', color: 'bg-muga-500', description: 'Create professional CV in minutes' },
  { to: '/utilities?tab=resizer', icon: FiCamera, label: 'Photo Resizer', color: 'bg-gamosa-500', description: 'Resize photos for applications' },
  { to: '/utilities?tab=scanner', icon: FiFileText, label: 'Doc Scanner', color: 'bg-emerald-500', description: 'Scan & optimize documents' },
  { to: '/assistant', icon: FiMessageSquare, label: 'AI Assistant', color: 'bg-purple-500', description: 'Get career guidance & syllabus help' },
  { to: '/utilities?tab=cv', icon: FiTarget, label: 'Mock Tests', color: 'bg-pink-500', description: 'Practice with mock exams' },
]

const features = [
  { icon: FiShield, title: 'Verified Listings', desc: 'Every job verified from official sources' },
  { icon: FiZap, title: 'Lightning Fast', desc: 'Works on 2G/3G, offline-first design' },
  { icon: FiAward, title: 'Smart Matching', desc: 'AI-powered job recommendations for you' },
  { icon: FiHeart, title: 'Student First', desc: 'Built for Assam students, by Assam students' },
]

const stats = [
  { value: '15,000+', label: 'Active Listings' },
  { value: '50,000+', label: 'Active Students' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '24/7', label: 'Support Available' },
]

function Home() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-tea-50 via-sand-50 to-white dark:from-tea-900 dark:via-tea-950 dark:to-tea-900">
      <UpdatesTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-tea-500/10 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-muga-500/10 blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-tea-100/20 dark:bg-tea-800/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
          {/* Welcome Section */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tea-100/80 dark:bg-tea-800/50 border border-tea-200 dark:border-tea-700 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tea-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tea-500"></span>
              </span>
              <span className="text-sm font-medium text-tea-700 dark:text-tea-300">New: AI-Powered Job Matching Now Live!</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-tea-900 dark:text-tea-50 mb-4 animate-slide-up">
              {profile?.name ? `Namaskar, ${profile.name}` : 'Namaskar! 🙏'}
            </h1>
            <p className="text-lg lg:text-xl text-tea-600 dark:text-tea-400 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '100ms'}}>
              Your one-stop hub for Assam's Sarkari & Private jobs. Smart matching, instant alerts, and tools built for Assam's students.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{animationDelay: '200ms'}}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="card-hover text-center p-6 group">
                <div className="text-3xl lg:text-4xl font-display font-bold text-tea-600 dark:text-tea-400 mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-tea-600 dark:text-tea-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Card */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="card bg-gradient-to-r from-tea-600 via-tea-700 to-tea-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-muga-500/20 blur-3xl" />
          </div>
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-display font-bold mb-2">Welcome to Your Career Hub</h2>
                <p className="text-white/90 text-lg max-w-xl">
                  Discover 15,000+ verified jobs, build your perfect CV, practice with mock tests, and get AI-powered career guidance — all in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                <Link to="/jobs" className="btn-primary btn-lg group">
                  Explore Jobs Now
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link to="/utilities?tab=cv" className="btn-outline btn-lg border-white/30 text-white hover:bg-white/10">
                  Build My CV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="card-hover text-center p-6 group">
              <div className="text-3xl lg:text-4xl font-display font-bold text-tea-600 dark:text-tea-400 mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm text-tea-600 dark:text-tea-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-tea-900 dark:text-tea-100 mb-2">Quick Actions</h2>
            <p className="text-tea-600 dark:text-tea-400">Everything you need for your career journey</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {shortcuts.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-hover group relative overflow-hidden"
              style={{animationDelay: `${i * 50}ms`}}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 group-hover:from-black/10 transition-colors" />
              <div className="relative p-5 h-full flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-1 group-hover:text-tea-600 dark:group-hover:text-tea-300 transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-tea-600 dark:text-tea-400 line-clamp-2">{item.description}</p>
                <div className="mt-auto pt-3 border-t border-tea-100 dark:border-tea-700 flex items-center justify-between">
                  <span className="text-xs text-tea-500 dark:text-tea-500">Open</span>
                  <FiArrowRight size={14} className="text-tea-400 group-hover:translate-x-1 transition-transform text-tea-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-tea-900 dark:text-tea-100 mb-3">
            Why Choose Assam Jobs Repository?
          </h2>
          <p className="text-tea-600 dark:text-tea-400 text-lg max-w-2xl mx-auto">
            Built specifically for Assam's students with features that matter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={feature.title} className="card-hover p-6 group" style={{animationDelay: `${i * 100}ms`}}>
              <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-tea-600 dark:text-tea-400">
                <feature.icon size={24} />
              </div>
              <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">{feature.title}</h3>
              <p className="text-tea-600 dark:text-tea-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-tea-900 dark:text-tea-100 mb-3">
            Trusted by 50,000+ Students Across Assam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { quote: "Found my dream teaching job through this app. The district filter saved me hours!", author: "Priya Deka", role: "Teacher, Dibrugarh", avatar: "PD" },
            { quote: "CV builder is amazing — got my resume ready in 10 minutes for the PNRD recruitment.", author: "Rahul Bora", role: "Graduate, Jorhat", avatar: "RB" },
            { quote: "AI Assistant helped me understand the syllabus for APSC. Free and accurate!", author: "Ananya Saikia", role: "APSC Aspirant, Guwahati", avatar: "AS" },
          ].map((testimonial, i) => (
            <div key={i} className="card-hover p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <Avatar fallback={testimonial.avatar} size="sm" />
                  <Avatar fallback="⭐" size="sm" className="bg-amber-100 text-amber-600" />
                  <Avatar fallback="⭐" size="sm" className="bg-amber-100 text-amber-600" />
                  <Avatar fallback="⭐" size="sm" className="bg-amber-100 text-amber-600" />
                  <Avatar fallback="⭐" size="sm" className="bg-amber-100 text-amber-600" />
                </div>
              </div>
              <p className="text-tea-700 dark:text-tea-300 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar fallback={testimonial.avatar} size="sm" />
                <div>
                  <p className="font-medium text-tea-900 dark:text-tea-100 text-sm">{testimonial.author}</p>
                  <p className="text-tea-500 dark:text-tea-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-tea-700 via-tea-800 to-tea-900 text-white relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-muga-500/20 blur-3xl" />
          </div>
          <div className="relative p-6 lg:p-10 lg:px-16 text-center lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Ready to Launch Your Career?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl">
                Join 50,000+ students who found their dream jobs through Assam Jobs Repository. Free forever, built for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs" className="btn-primary btn-xl group">
                  Start Job Hunting
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link to="/utilities?tab=cv" className="btn-outline btn-xl border-white/30 text-white hover:bg-white/10">
                  Build My CV Free
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <FiShield size={18} className="text-muga-400" />
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiZap className="text-muga-400" size={18} />
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="text-muga-400" size={18} />
                  <span>No Ads Ever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home