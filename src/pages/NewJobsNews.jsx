import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/common/TopBar.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useToast } from '../components/common/Toast.jsx'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { FiRefreshCw, FiSearch, FiFilter, FiArrowRight, FiFilterOff, FiGrid, FiList, FiExternalLink, FiBookmark, FiShare2 } from 'react-icons/fi'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input, Select, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, Modal, Avatar, AvatarGroup, Pagination } from '../components/ui/21st'
import { formatDate, getCategoryColor } from '../components/ui/21st'

const NEWS_COLLECTION = import.meta.env.VITE_NEWS_COLLECTION === 'scrapegraph_test' ? 'new_jobs_news_scrapegraph_test' : 'updates'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'exam', label: 'Exam' },
  { value: 'policy', label: 'Policy' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'admit_card', label: 'Admit Card' },
  { value: 'walk_in', label: 'Walk-in' },
]

export default function NewJobsNews() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [newsItems, setNewsItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const q = query(
          collection(db, NEWS_COLLECTION),
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
          filtered = items.filter(
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
        console.error('Error fetching news:', err)
        setError('Failed to load news. Please try again.')
        setLoading(false)
      }
    }

    fetchNews()
  }, [category, searchQuery])

  const formatDate = (date) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getCategoryColor = (cat) => {
    const colors = {
      recruitment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      exam: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      result: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      admit_card: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      announcement: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
      policy: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
      walk_in: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      default: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
    }
    return colors[cat?.toLowerCase()] || colors.default
  }

  function renderNewsContent() {
    if (newsItems === null) {
      return (
        <p className="text-tea-900/50 text-center py-12">{t('no_news_yet')}</p>
      )
    }

    if (newsItems.length === 0) {
      return (
        <div className="text-center py-12">
          <FiFilterOff size={48} className="text-tea-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-tea-900 dark:text-tea-100 mb-2">
            No matching news found
          </h3>
          <p className="text-tea-600 dark:text-tea-400 mb-4">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={() => { setCategory(''); setSearchQuery('') }}>
            Clear Filters
          </Button>
        </div>
      )
    }

    return (
      <>
        {/* View Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="text-sm text-tea-600 dark:text-tea-400">
            {newsItems.length} {newsItems.length === 1 ? 'result' : 'results'} found
            {category && <span className="ml-2">{`in ${category}`}</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode('grid')}>
              <FiGrid size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
              <FiList size={16} />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((item) => (
              const title = item.title || item.role || 'Untitled'
              const summary = item.summary || item.body || ''
              const date = item.postedAt ? formatDate(item.postedAt) : ''
              const source = item.sourceSite || item.department || 'Assam Jobs Repository'
              const categoryLabel = item.noticeCategory || 'General'

              return (
                <article
                  key={item.id}
                  className="card-hover group relative"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item) }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="View details"
                      >
                        <FiExternalLink size={16} className="text-tea-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); showToast('Saved!', 'success') }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="Bookmark"
                      >
                        <FiBookmark size={16} className="text-tea-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowShareModal(true) }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="Share"
                      >
                        <FiShare2 size={16} className="text-tea-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(categoryLabel)}>{categoryLabel}</Badge>
                    </div>

                    <h3 className="font-semibold text-tea-900 dark:text-tea-100 line-clamp-2 mb-2 group-hover:text-tea-600 dark:group-hover:text-tea-400 transition-colors">
                      {title}
                    </h3>

                    {summary && (
                      <p className="text-tea-700 dark:text-tea-300 text-sm line-clamp-3 mb-3">
                        {summary}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-tea-500 dark:text-tea-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTag size={12} /> {source}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-tea-100 dark:border-tea-700 flex items-center justify-between">
                      <span className="text-tea-600 dark:text-tea-400 text-sm">Read more</span>
                      <FiArrowRight size={14} className="text-tea-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
</article>
              )
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {newsItems.map((item) => {
              const title = item.title || item.role || 'Untitled'
              const summary = item.summary || item.body || ''
              const date = item.postedAt ? formatDate(item.postedAt) : ''
              const source = item.sourceSite || item.department || 'Assam Jobs Repository'
              const categoryLabel = item.noticeCategory || 'General'

              return (
                <article key={item.id} className="card-hover group relative" onClick={() => setSelectedItem(item)}>
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item) }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="View details"
                      >
                        <FiExternalLink size={16} className="text-tea-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); showToast('Saved!', 'success') }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="Bookmark"
                      >
                        <FiBookmark size={16} className="text-tea-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowShareModal(true) }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-tea-800/90 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
                        aria-label="Share"
                      >
                        <FiShare2 size={16} className="text-tea-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(categoryLabel)}>{categoryLabel}</Badge>
                    </div>

                    <h3 className="font-semibold text-tea-900 dark:text-tea-100 line-clamp-2 mb-2 group-hover:text-tea-600 dark:group-hover:text-tea-400 transition-colors">
                      {title}
                    </h3>

                    {summary && (
                      <p className="text-tea-700 dark:text-tea-300 text-sm line-clamp-3 mb-3">
                        {summary}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-tea-500 dark:text-tea-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTag size={12} /> {source}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-tea-100 dark:border-tea-700 flex items-center justify-between">
                      <span className="text-tea-600 dark:text-tea-400 text-sm">Read more</span>
                      <FiArrowRight size={14} className="text-tea-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
</article>
                )
              )}
            </div>
          )}
        )}
      )
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-tea-900">
      <TopBar title={t('newjobsnews')} />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-tea-900 dark:text-tea-100">
                {t('newjobsnews')}
              </h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">
                {t('latest_news_and_updates')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full sm:w-auto">
                  <Filter size={18} className="mr-2" />
                  Filters
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-tea-700 mb-2">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-tea-200 rounded-lg focus:ring-2 focus:ring-tea-500 focus:border-tea-500"
                      >
                        <option value="">All Categories</option>
                        <option value="recruitment">{t('recruitment')}</option>
                        <option value="exam">{t('exam')}</option>
                        <option value="policy">{t('policy')}</option>
                        <option value='announcement'>{t('announcement')}</option>
                        <option value="admit_card">{t('admit_card')}</option>
                        <option value="result">{t('result')}</option>
                        <option value="walk_in">{t('walk_in')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tea-700 mb-2">Search</label>
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_news')}
                      />
                    </div>
                    <Button variant="outline" onClick={() => { setCategory(''); setSearchQuery('') }} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="animate-fade-in">
          {renderNewsContent()}
        </div>
      </div>
    </div>
  )
}

export default NewJobsNews