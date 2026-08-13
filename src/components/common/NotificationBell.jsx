import React, { useState, useEffect, useRef } from 'react'
import { FiBell, FiX, FiBriefcase, FiCalendar, FiFileText, FiAlertCircle } from 'react-icons/fi'
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/config.js'

function getIcon(type) {
  switch (type) {
    case 'new_job': return <FiBriefcase size={16} className="text-tea-600" />
    case 'deadline': return <FiAlertCircle size={16} className="text-red-500" />
    case 'admit_card': return <FiFileText size={16} className="text-blue-500" />
    case 'syllabus': return <FiCalendar size={16} className="text-purple-500" />
    default: return <FiBell size={16} className="text-tea-600" />
  }
}

function timeAgo(date) {
  if (!date) return ''
  const now = new Date()
  const d = date.toDate ? date.toDate() : new Date(date)
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('readNotifs') || '[]') } catch { return [] }
  })
  const panelRef = useRef(null)

  useEffect(() => {
    // Get jobs from last 7 days
    const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const q = query(
      collection(db, 'job_listings'),
      where('status', '==', 'active'),
      orderBy('postedAt', 'desc'),
      limit(20)
    )

    const unsub = onSnapshot(q, (snap) => {
      const notifs = []
      snap.docs.forEach(doc => {
        const job = { id: doc.id, ...doc.data() }

        // New job notification
        if (job.postedAt && job.postedAt.toDate() > sevenDaysAgo.toDate()) {
          notifs.push({
            id: `new_${job.id}`,
            type: 'new_job',
            title: `New Job: ${job.role || job.department}`,
            body: job.sourceSite || job.department,
            time: job.postedAt,
            link: '/jobs'
          })
        }

        // Deadline close notification
        if (job.deadline && job.deadline !== 'Not specified') {
          const deadlineDate = new Date(job.deadline)
          const daysLeft = Math.floor((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
          if (daysLeft >= 0 && daysLeft <= 3) {
            notifs.push({
              id: `deadline_${job.id}`,
              type: 'deadline',
              title: `⚠️ Deadline in ${daysLeft === 0 ? 'Today!' : daysLeft + ' days'}`,
              body: job.role || job.department,
              time: job.postedAt,
              link: '/jobs'
            })
          }
        }

        // Admit card
        if (job.role && job.role.toLowerCase().includes('admit card')) {
          notifs.push({
            id: `admit_${job.id}`,
            type: 'admit_card',
            title: `🎫 Admit Card Available`,
            body: job.role,
            time: job.postedAt,
            link: '/jobs'
          })
        }

        // Syllabus update
        if (job.syllabus && job.syllabus !== 'Not specified') {
          notifs.push({
            id: `syllabus_${job.id}`,
            type: 'syllabus',
            title: `📚 Syllabus Updated`,
            body: job.role || job.department,
            time: job.postedAt,
            link: '/jobs'
          })
        }
      })

      // Sort by time
      notifs.sort((a, b) => {
        const ta = a.time?.toDate ? a.time.toDate() : new Date(a.time || 0)
        const tb = b.time?.toDate ? b.time.toDate() : new Date(b.time || 0)
        return tb - ta
      })

      setNotifications(notifs.slice(0, 15))
    })

    return unsub
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length

  function markRead(id) {
    const newIds = [...readIds, id]
    setReadIds(newIds)
    localStorage.setItem('readNotifs', JSON.stringify(newIds))
  }

  function markAllRead() {
    const allIds = notifications.map(n => n.id)
    setReadIds(allIds)
    localStorage.setItem('readNotifs', JSON.stringify(allIds))
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1"
        aria-label="Notifications"
      >
        <FiBell size={22} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-tea-100 z-50 max-h-[70vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-tea-50">
            <h3 className="font-semibold text-tea-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-tea-600 underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <FiX size={18} className="text-tea-900/50" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="text-center text-tea-900/50 py-8 text-sm">No notifications yet</p>
            ) : (
              notifications.map(notif => {
                const isUnread = !readIds.includes(notif.id)
                return (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-tea-50 cursor-pointer hover:bg-tea-50 ${isUnread ? 'bg-tea-50/60' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-tea-900 truncate">{notif.title}</p>
                        {isUnread && (
                          <span className="shrink-0 bg-tea-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                        )}
                      </div>
                      <p className="text-xs text-tea-900/60 truncate">{notif.body}</p>
                      <p className="text-xs text-tea-900/40 mt-0.5">{timeAgo(notif.time)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
