import React, { useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiClock, FiGrid, FiLayers, FiX } from 'react-icons/fi'
import { subscribeToJobs } from '../../firebase/firestore.js'
import { ALL_SECTORS, classifyJob } from '../../utils/sectors.js'
import JobCard from './JobCard.jsx'
import JobDetailModal from './JobDetailModal.jsx'

function RollingBar({ icon, title, subtitle, open, onToggle, children }) {
  return (
    <div className="bg-white border border-tea-100 rounded-xl2 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="w-9 h-9 rounded-full bg-tea-50 text-tea-700 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-tea-900">{title}</span>
          {subtitle && <span className="block text-xs text-tea-900/60 mt-0.5">{subtitle}</span>}
        </span>
        <FiChevronDown size={20} className={`text-tea-900/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '2400px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-4 pb-4 border-t border-tea-100/70 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function SectorExplorer() {
  const [jobs, setJobs] = useState(null)
  const [openPanel, setOpenPanel] = useState(null) // 'sectors' | 'upcoming' | null
  const [activeSector, setActiveSector] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const unsub = subscribeToJobs({ district: 'all' }, setJobs)
    return unsub
  }, [])

  // Group every live job into its sector once.
  const sectorCounts = useMemo(() => {
    if (!jobs) return {}
    const counts = {}
    for (const s of ALL_SECTORS) counts[s.id] = []
    for (const job of jobs) {
      const sec = classifyJob(job)
      counts[sec.id]?.push(job)
    }
    return counts
  }, [jobs])

  const activeJobs = activeSector ? (sectorCounts[activeSector] || []) : null
  const activeName = ALL_SECTORS.find((s) => s.id === activeSector)?.name

  return (
    <div className="space-y-3 mb-6">
      {/* SECTOR WISE CATEGORISATION */}
      <RollingBar
        icon={<FiGrid size={18} />}
        title="Sector Wise Categorisation"
        subtitle={jobs ? `${jobs.length} live jobs across ${ALL_SECTORS.length - 1}+ sectors` : 'Loading…'}
        open={openPanel === 'sectors'}
        onToggle={() => { setOpenPanel(openPanel === 'sectors' ? null : 'sectors'); setActiveSector(null) }}
      >
        {!activeSector ? (
          <>
            <p className="text-xs text-tea-900/50 mb-3">Pick a sector to see all its current openings:</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_SECTORS.map((s) => {
                const count = sectorCounts[s.id]?.length || 0
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSector(s.id)}
                    disabled={count === 0}
                    className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      count > 0
                        ? 'border-tea-100 hover:border-tea-400 hover:bg-tea-50 active:bg-tea-100'
                        : 'border-tea-100/60 opacity-40 cursor-default'
                    }`}
                  >
                    <span className="text-sm font-medium text-tea-900 leading-tight">{s.name}</span>
                    <span className="text-[11px] text-tea-900/50 mt-1">
                      {count > 0 ? `${count} job${count > 1 ? 's' : ''}` : 'No openings'}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-tea-800">
                {activeName} · {activeJobs?.length || 0} job{(activeJobs?.length || 0) !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setActiveSector(null)}
                className="btn-outline px-3 py-1 text-xs flex items-center gap-1"
              >
                <FiX size={12} /> All Sectors
              </button>
            </div>
            {activeJobs === null || activeJobs.length === 0 ? (
              <p className="text-center text-tea-900/50 py-4 text-sm">No jobs in this sector right now.</p>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => <JobCard key={job.id} job={job} onOpen={setSelected} />)}
              </div>
            )}
          </>
        )}
      </RollingBar>

      {/* UPCOMING JOBS */}
      <RollingBar
        icon={<FiClock size={18} />}
        title="Upcoming Jobs"
        subtitle="Notifications expected soon — before they're officially out"
        open={openPanel === 'upcoming'}
        onToggle={() => setOpenPanel(openPanel === 'upcoming' ? null : 'upcoming')}
      >
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-tea-200 bg-tea-50/40 px-4 py-5">
          <FiLayers size={22} className="text-tea-600 shrink-0" />
          <p className="text-sm text-tea-900/70 leading-relaxed">
            We're tracking official portals for upcoming notifications.
            As soon as a new recruitment is announced, it will appear here first.
          </p>
        </div>
      </RollingBar>

      <JobDetailModal job={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
