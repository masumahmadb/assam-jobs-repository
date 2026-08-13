import React, { useEffect, useState } from 'react'
import { FiBell, FiX } from 'react-icons/fi'
import { subscribeToUpdates } from '../../firebase/firestore.js'

const CATEGORY_LABELS = {
  interview_call: 'Interview',
  admit_card: 'Admit Card',
  verification: 'Verification',
  result: 'Result',
  other_update: 'Update'
}

export default function UpdatesTicker() {
  const [updates, setUpdates] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const unsub = subscribeToUpdates(setUpdates)
    return unsub
  }, [])

  if (!updates || updates.length === 0) return null

  return (
    <>
      <div className="bg-tea-800 text-white rounded-xl2 overflow-hidden flex items-center">
        <div className="flex items-center gap-1 px-3 py-2 bg-tea-900 shrink-0 text-xs font-semibold">
          <FiBell size={14} />
          <span>LATEST</span>
        </div>
        <div className="overflow-hidden flex-1 whitespace-nowrap relative py-2">
          <div className="inline-flex animate-marquee">
            {[...updates, ...updates].map((u, i) => (
              <button
                key={`${u.id}-${i}`}
                onClick={() => setSelected(u)}
                className="mx-4 text-sm text-tea-50/90 hover:text-white shrink-0"
              >
                <span className="text-gamosa-300 font-medium">
                  [{CATEGORY_LABELS[u.noticeCategory] || 'Update'}]
                </span>{' '}
                {u.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-display font-semibold text-tea-800 pr-4">{selected.title}</h3>
              <button onClick={() => setSelected(null)}><FiX size={22} /></button>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Category" value={CATEGORY_LABELS[selected.noticeCategory] || 'Update'} />
              <Row label="Department" value={selected.department} />
              <Row label="Summary" value={selected.summary} />
              <Row label="Deadline" value={selected.deadline} />
            </div>
            {selected.applyUrl && (
              <a
                href={selected.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center bg-tea-700 text-white rounded-xl2 py-3 font-medium"
              >
                Open Official Notification
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-tea-100 pb-2">
      <span className="text-tea-900/50">{label}</span>
      <span className="text-tea-900 text-right">{value || 'Not specified'}</span>
    </div>
  )
}
