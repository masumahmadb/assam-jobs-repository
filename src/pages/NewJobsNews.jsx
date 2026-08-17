import React, { useEffect, useState } from 'react'
import TopBar from '../components/common/TopBar.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useSearchParams } from 'react-router-dom'
import { FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi'
import { useToast } from '../components/common/Toast.jsx'

export default function NewJobsNews() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [params] = useSearchParams()
  const [category, setCategory] = useState(params.get('category') || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [newsItems, setNewsItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch news from Firebase (updates collection)
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const { getUpdates } = require('../firebase/firestore.js')
        // Get updates from Firestore and treat as news
        const q = query(
          collection(db, 'updates'),
          orderBy('postedAt', 'desc'),
          limit(50)
        )
        const snap = await getDocs(q)
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))

        // Filter by category if specified
        let filtered = items
        if (category) {
          filtered = items.filter(
            (item) =>
              (item.noticeCategory && item.noticeCategory.toLowerCase().includes(category.toLowerCase())) ||
              (item.title && item.title.toLowerCase().includes(category.toLowerCase()))
          )
        }

        // Filter by search query
        if (searchQuery) {
          filtered = filtered.filter(
            (item) =>
              (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (item.body && item.body.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        }

        setNewsItems(filtered)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news. Please try again.')
        setLoading(false)
      }
    }

    fetchNews()
  }, [category, searchQuery])

  const handleRefresh = () => {
    setNewsItems(null)
    setLoading(true)
    setTimeout(() => {
      // Re-fetch
      const fetchNews = async () => {
        try {
          const { getUpdates } = require('../firebase/firestore.js')
          const q = query(
            collection(db, 'updates'),
            orderBy('postedAt', 'desc'),
            limit(50)
          )
          const snap = await getDocs(q)
          const items = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))

          let filtered = items
          if (category) {
            filtered = filtered.filter(
              (item) =>
                (item.noticeCategory && item.noticeCategory.toLowerCase().includes(category.toLowerCase())) ||
                (item.title && item.title.toLowerCase().includes(category.toLowerCase()))
            )
          }

          if (searchQuery) {
            filtered = filtered.filter(
              (item) =>
                (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.body && item.body.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          }

          setNewsItems(filtered)
          setLoading(false)
        } catch (err) {
          setError('Failed to reload news.')
          setLoading(false)
        }
      }
      fetchNews()
    }, 500)
  }

  if (loading && !newsItems) {
    return (
      <div>
        <TopBar title={t('newjobsnews')} />
        <div className="p-8 text-center">
          <div className="spinner-border text-tea-600" role="status" />
          <p className="mt-3 text-tea-900/60">{t('loading')}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <TopBar title={t('newjobsnews')} />
        <div className="p-8">
          <p className="text-red-600">{error}</p>
          <button onClick={handleRefresh} className="btn-primary mt-3">{t('refresh')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <TopBar title={t('newjobsnews')} />

      <div className="space-y-4">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl2 px-4 py-2 flex-1"
          >
            <option value="">{t('all_categories')}</option>
            <option value="recruitment">{t('recruitment')}</option>
            <option value="exam">{t('exam')}</option>
            <option value="policy">{t('policy')}</option>
            <option value="announcement">{t('announcement')}</option>
          </select>

          <div className="relative">
            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-tea-900/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_news')}
              className="pl-8 border rounded-xl2 px-4 py-2 w-full"
            />
          </div>
        </div>

        {/* News list */}
        {newsItems === null ? (
          <p className="text-tea-900/50 text-sm">{t('no_news_yet')}</p>
        ) : newsItems.length === 0 ? (
          <p className="text-tea-900/50 text-center">{t('no_news_matched')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((item) => {
              const title = item.title || item.role || 'Untitled'
              const summary = item.summary || item.body || ''
              const date = item.postedAt ? new Date(item.postedAt.toDate ? item.postedAt.toDate() : item.postedAt).toLocaleDateString() : ''
              const source = item.sourceSite || item.department || 'Assam Jobs Repository'
              const categoryLabel = item.noticeCategory || 'General'

              return (
                <div
                  key={item.id}
                  className="card border-tea-100 rounded-xl2 p-4 hover:bg-tea-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-tea-800 line-clamp-2">{title}</h3>
                    <span className="text-xs text-tea-900/50">{categoryLabel}</span>
                  </div>
                  {summary && (
                    <p className="text-tea-900/70 text-sm line-clamp-3 mb-3">
                      {summary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-tea-900/60">
                    <span>{date}</span>
                    <span>{t('from')}: {source}</span>
                  </div>
                  <a
                    href={item.applyUrl || item.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-tea-600 underline text-sm flex items-center gap-1"
                  >
                    {t('read_more')}
                    <FiArrowRight size={14} />
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination/load more could be added here */}
      </div>
    </div>
  )
}