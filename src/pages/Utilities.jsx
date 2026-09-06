import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/common/TopBar.jsx'
import CVBuilder from '../components/cv/CVBuilder.jsx'
import PhotoResizer from '../components/vault/PhotoResizer.jsx'
import DocumentScanner from '../components/vault/DocumentScanner.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '../components/ui/21st'
import { FiFileText, FiCamera, FiScan, FiFile, FiDownload, FiUpload, FiEdit, FiImage, FiRotateCw, FiCrop, FiSave, FiShare2, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const TOOLS = [
  {
    id: 'cv',
    label: 'CV Builder',
    icon: FiFileText,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    description: 'Create professional CVs with templates',
    features: ['Multiple templates', 'Auto-formatting', 'PDF export', 'Multi-language'],
    component: CVBuilder,
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    id: 'resizer',
    label: 'Photo Resizer',
    icon: FiCamera,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    description: 'Resize & compress photos for applications',
    features: ['Custom dimensions', 'Aspect ratio lock', 'Quality control', 'Batch processing'],
    component: PhotoResizer,
    badge: 'New',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  {
    id: 'scanner',
    label: 'Document Scanner',
    icon: FiScan,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    description: 'Scan & enhance documents with OCR',
    features: ['Auto-crop', 'Perspective correction', 'OCR text extraction', 'PDF export'],
    component: DocumentScanner,
    badge: 'Beta',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    id: 'converter',
    label: 'File Converter',
    icon: FiFile,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    description: 'Convert between PDF, JPG, PNG, DOCX',
    features: ['Multiple formats', 'Batch convert', 'Quality settings', 'Secure processing'],
    component: null,
    badge: 'Coming Soon',
    badgeColor: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
    disabled: true,
  },
  {
    id: 'compressor',
    label: 'Image Compressor',
    icon: FiImage,
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    description: 'Compress images without quality loss',
    features: ['Smart compression', 'Preserve quality', 'Batch compress', 'Format conversion'],
    component: null,
    badge: 'Coming Soon',
    badgeColor: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
    disabled: true,
  },
  {
    id: 'certificate',
    label: 'Certificate Maker',
    icon: FiAward,
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    description: 'Generate certificates & certificates',
    features: ['Templates', 'Bulk generate', 'QR codes', 'PDF export'],
    component: null,
    badge: 'Coming Soon',
    badgeColor: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
    disabled: true,
  },
]

export default function Utilities() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'cv')
  const [showToolInfo, setShowToolInfo] = useState(null)

  const currentTool = TOOLS.find(t => t.id === activeTab)

  return (
    <div>
      <TopBar title={t('utilities')} />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-tea-900 dark:text-tea-100">
                Career Tools & Utilities
              </h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">
                Essential tools for job applications, document management & career growth
              </p>
            </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-tea-100 dark:bg-tea-800 rounded-xl text-sm text-tea-700 dark:text-tea-300">
                <FiStar size={14} className="text-amber-500" />
                <span>All tools are 100% free</span>
              </div>
            </div>
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.id}
                className={`card-hover group relative overflow-hidden ${tool.disabled ? 'opacity-50' : ''}`}
                style={{animationDelay: `${i * 50}ms`}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 group-hover:from-black/10 transition-colors" />
                {tool.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className={tool.badgeColor} size="sm">{tool.badge}</Badge>
                  </div>
                )}
                <div className="p-5 h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${tool.color} group-hover:scale-110 transition-transform`}>
                    <tool.icon size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-1">{tool.label}</h3>
                  <p className="text-sm text-tea-600 dark:text-tea-400 mb-3 line-clamp-2 flex-1">{tool.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="ghost" size="sm" className="text-xs">{feature}</Badge>
                    ))}
                    {tool.features.length > 3 && (
                      <Badge variant="ghost" size="sm" className="text-xs">+{tool.features.length - 3} more</Badge>
                    )}
                  </div>
                  <div className="mt-auto pt-4 border-t border-tea-100 dark:border-tea-700">
                    {tool.disabled ? (
                      <Button variant="outline" className="w-full" disabled>
                        <FiLock size={16} className="mr-2" /> Coming Soon
                      </Button>
                    ) : (
                      <Button onClick={() => setActiveTab(tool.id)} className="w-full" variant="primary">
                        <FiArrowRight className="mr-2" /> Launch Tool
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tool Detail View */}
          {showToolInfo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-tea-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-tea-100 dark:border-tea-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${showToolInfo.color}`}>
                      <showToolInfo.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-tea-900 dark:text-tea-100">{showToolInfo.label}</h3>
                      <p className="text-sm text-tea-600 dark:text-tea-400">{showToolInfo.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowToolInfo(null)}
                    className="p-2 rounded-xl text-tea-400 hover:text-tea-600 hover:bg-tea-100 dark:hover:bg-tea-800 transition-colors"
                    aria-label="Close"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {showToolInfo.features.map((feature, idx) => (
                      <Badge key={idx} variant="ghost" size="sm">{feature}</Badge>
                    ))}
                  </div>
                  {showToolInfo.disabled ? (
                    <Button variant="outline" className="w-full" disabled>
                      <FiLock size={16} className="mr-2" /> Coming Soon
                    </Button>
                  ) : (
                    <Button onClick={() => { setShowToolInfo(null); setActiveTab(showToolInfo.id) }} className="w-full" size="lg" variant="primary">
                      <FiArrowRight className="mr-2" /> Launch {showToolInfo.label}
                    </Button>
                  )}
</div>
            </div>
          </div>
        )}

          {/* Features Highlight */}
          <section className="animate-slide-up" style={{animationDelay: '200ms'}}>
            <h2 className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100 mb-6 text-center">
              Why Use Our Tools?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, i) => {
            return (
              <div key={i} className="card-hover p-6 text-center group" style={{animationDelay: `${i * 100}ms`}}>
                <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-tea-600 dark:text-tea-400">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">{feature.title}</h3>
                <p className="text-tea-600 dark:text-tea-400 text-sm">{feature.desc}</p>
              </div>
            )
          })}
          </div>
        </section>

          {/* Active Tool View */}
          {currentTool && currentTool.component && !showToolInfo && (
            <section className="mt-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTool.color}`}>
                    <currentTool.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-tea-900 dark:text-tea-100">{currentTool.label}</h2>
                    <p className="text-tea-600 dark:text-tea-400 text-sm">{currentTool.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('cv')}>
                  <FiArrowLeft size={16} className="mr-1" /> Back to Tools
                </Button>
              </div>
              <div className="card p-6">
                <currentTool.component />
              </div>
            </section>
        )}
      </div>
    </div>
  )
}

export default Utilities