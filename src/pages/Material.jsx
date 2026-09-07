import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { Card, CardHeader, CardTitle, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/21st'
import SyllabusScraper from '../components/assistant/SyllabusScraper.jsx'
import { FiBookOpen, FiFileText, FiDownload, FiSearch, FiStar } from 'react-icons/fi'

const MATERIAL_CATEGORIES = [
  {
    id: 'syllabus',
    label: 'Syllabus',
    icon: FiBookOpen,
    description: 'Find detailed syllabi for Assam government exams',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  },
  {
    id: 'pyq',
    label: 'Previous Year Questions',
    icon: FiFileText,
    description: 'Access PYQ papers for exam preparation',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  },
  {
    id: 'resources',
    label: 'Study Resources',
    icon: FiDownload,
    description: 'Download study materials and guides',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  }
]

function Material() {
  const { t } = useLanguage()

  return (
    <>
      <TopBar title={t('material')} />
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-tea-900 dark:text-tea-100 flex items-center gap-2">
                <FiStar size={24} className="text-tea-600 dark:text-tea-400" />
                Study Material
              </h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">
                Syllabus, Previous Year Questions & Study Resources for Assam Government Exams
              </p>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            {MATERIAL_CATEGORIES.map((cat, i) => (
              <Card key={cat.id} className="card-hover h-full group" style={{animationDelay: `${i * 100}ms`}}>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                    <cat.icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">{cat.label}</h3>
                  <p className="text-sm text-tea-600 dark:text-tea-400 mb-4">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Syllabus & PYQ Tools */}
        <div className="animate-slide-up">
          <SyllabusScraper />
        </div>

        {/* Additional Resources */}
        <section className="mt-12 animate-slide-up">
          <h2 className="text-xl font-display font-bold text-tea-900 dark:text-tea-100 mb-6 flex items-center gap-2">
            <FiDownload size={22} className="text-tea-600 dark:text-tea-400" />
            Quick Downloads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'APSC CCE Syllabus 2026', icon: FiFileText, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
              { label: 'PNRD Previous Papers', icon: FiFileText, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
              { label: 'Assam Police SI Syllabus', icon: FiBookOpen, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
              { label: 'ASSAM TET Papers', icon: FiFileText, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
              { label: 'APDCL Exam Pattern', icon: FiBookOpen, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
              { label: 'Guwahati MC Papers', icon: FiFileText, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
            ].map((resource, i) => (
              <Card key={resource.label} className="card-hover group" style={{animationDelay: `${i * 50}ms`}}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.color} group-hover:scale-110 transition-transform`}>
                    <resource.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-tea-900 dark:text-tea-100">{resource.label}</h4>
                    <p className="text-sm text-tea-600 dark:text-tea-400 mt-0.5">Click to search & download</p>
                  </div>
                  <FiSearch size={20} className="text-tea-400 group-hover:text-tea-600 transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default Material