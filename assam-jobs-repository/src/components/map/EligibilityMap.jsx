import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { subscribeToJobs } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useEligibility } from '../../hooks/useEligibility.js'
import { buildPinIcon } from './MapPin3D.jsx'
import { ListSkeleton } from '../common/SkeletonLoader.jsx'

const ASSAM_CENTER = [26.2006, 92.9376] // geographic centre of Assam

export default function EligibilityMap() {
  const { profile } = useAuth()
  const [jobs, setJobs] = useState(null)
  const [radius, setRadius] = useState('all')
  const [onlyEligible, setOnlyEligible] = useState(false)

  useEffect(() => {
    const unsub = subscribeToJobs({}, setJobs)
    return unsub
  }, [])

  const results = useEligibility(profile, jobs || [])
  const visible = onlyEligible ? results.filter((r) => r.eligible) : results

  if (jobs === null) return <div className="p-4"><ListSkeleton count={3} /></div>

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="p-3 flex gap-2 bg-white border-b border-tea-100 overflow-x-auto">
        {['10km', '50km', 'all'].map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={`text-xs px-3 py-2 rounded-full whitespace-nowrap ${radius === r ? 'bg-tea-600 text-white' : 'bg-tea-50 text-tea-700'}`}
          >
            {r === 'all' ? 'Entire Assam' : `Within ${r}`}
          </button>
        ))}
        <button
          onClick={() => setOnlyEligible((v) => !v)}
          className={`text-xs px-3 py-2 rounded-full whitespace-nowrap ml-auto ${onlyEligible ? 'bg-gamosa-500 text-white' : 'bg-tea-50 text-tea-700'}`}
        >
          {onlyEligible ? 'Showing Eligible Only' : 'Show Only Eligible'}
        </button>
      </div>

      <MapContainer center={ASSAM_CENTER} zoom={7} className="flex-1">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visible.map(({ job, eligible, reasons }) => (
          job.lat && job.lng ? (
            <Marker key={job.id} position={[job.lat, job.lng]} icon={buildPinIcon(eligible)}>
              <Popup>
                <strong>{job.role}</strong><br />
                {job.department}<br />
                Salary: {job.salary || 'N/A'}<br />
                <span style={{ color: eligible ? '#0B6E4F' : '#C0392B', fontWeight: 600 }}>
                  {eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                </span>
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                {job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noreferrer">Apply link</a>}
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}
