import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { PDFEditorProvider, usePDFEditor } from '../../context/PDFEditorContext'
import { FiFilePlus, FiRotateCw, FiTrash2, FiArrowUp, FiArrowDown, FiDownload, FiSave, FiX, FiPlus, FiUpload, FiEye, FiEdit, FiPrinter, FiCopy, FiSearch, FiFileText, FiImage, FiLock, FiUnlock, FiScissors, FiStamp, FiPenTool, FiType, FiSignature, FiFile, FiArrowUpRight, FiFileMinus, FiFilePlus2, FiLayers, FiGrid, FiShield, FiKey, FiEraser, FiWand2, FiCamera, FiRotateCcw, FiMove, FiZoomIn, FiZoomOut, FiUndo, FiRedo, FiGitCompare } from 'react-icons/fi'

// Lazy load heavy tool components
const EditTools = lazy(() => import('./tools/EditTools'))
const OCRTools = lazy(() => import('./tools/OCRTools'))
const ConvertTools = lazy(() => import('./tools/ConvertTools'))
const CompressTools = lazy(() => import('./tools/CompressTools'))
const OrganizeTools = lazy(() => import('./tools/OrganizeTools'))
const SecureTools = lazy(() => import('./tools/SecureTools'))
const SignTools = lazy(() => import('./tools/SignTools'))
const CleanTools = lazy(() => import('./tools/CleanTools'))
const ExtractTools = lazy(() => import('./tools/ExtractTools'))
const FormsTools = lazy(() => import('./tools/FormsTools'))
const WatermarkTools = lazy(() => import('./tools/WatermarkTools'))
const HeaderFooterTools = lazy(() => import('./tools/HeaderFooterTools'))
const CompareTools = lazy(() => import('./tools/CompareTools'))
const ImageTools = lazy(() => import('./tools/ImageTools'))

const TOOL_CATEGORIES = [
  { id: 'organize', label: 'Organize', icon: FiLayers, description: 'Merge, split, reorder, extract pages', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { id: 'edit', label: 'Edit', icon: FiPenTool, description: 'Add text, images, draw, annotate', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { id: 'ocr', label: 'OCR', icon: FiSearch, description: 'Make scanned PDFs searchable', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { id: 'convert', label: 'Convert', icon: FiArrowUpRight, description: 'PDF ↔ Word, Excel, Images, HTML', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { id: 'compress', label: 'Compress', icon: FiFileMinus, description: 'Reduce file size with presets', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
  { id: 'secure', label: 'Secure', icon: FiShield, description: 'Encrypt, redact, permissions', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { id: 'sign', label: 'Sign', icon: FiSignature, description: 'e-Signatures & PAdES certificates', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  { id: 'clean', label: 'Clean', icon: FiEraser, description: 'Optimize, repair, PDF/A, remove blank', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  { id: 'extract', label: 'Extract', icon: FiFileText, description: 'Text, images, tables, search', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-tea-300' },
  { id: 'forms', label: 'Forms', icon: FiFile, description: 'Fill, create & flatten form fields', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
  { id: 'watermark', label: 'Watermark', icon: FiStamp, description: 'Text/image watermarks, presets', color: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300' },
  { id: 'header-footer', label: 'Header/Footer', icon: FiMove, description: 'Page numbers, dates, custom text', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
  { id: 'compare', label: 'Compare', icon: FiGitCompare, description: 'A vs B page/text diff', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' },
  { id: 'images', label: 'PDF ↔ Images', icon: FiImage, description: 'PDF ↔ JPG/PNG/WebP, images → PDF', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300' },
]

function CategorySidebar() {
  const { state, actions } = usePDFEditor()
  
  return (
    <div className="w-full lg:w-64 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
      <div className="p-4 border-b border-tea-100 dark:border-tea-800">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">Tools</h3>
        <p className="text-xs text-tea-500 dark:text-tea-400">All tools are free, offline & private</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {TOOL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => actions.setActiveCategory(cat.id)}
            className={`w-full text-left p-3 rounded-xl transition-all group ${
              state.activeCategory === cat.id
                ? `${cat.color} shadow-sm`
                : 'text-tea-700 dark:text-tea-300 hover:bg-tea-50 dark:hover:bg-tea-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{cat.label}</h4>
                <p className="text-xs text-tea-500 dark:text-tea-400 truncate">{cat.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function FileUploadSection() {
  const { state, actions } = usePDFEditor()
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  
  const handleDrag = (e) => {
    e.preventDefault()
    setDragActive(e.type === 'dragover')
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    files.forEach(f => handleFile(f))
  }
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }
  
  const handleFile = (file) => {
    if (file.type !== 'application/pdf') return
    // File loading handled by parent
    actions.addFile({ file, name: file.name, size: file.size })
  }

  return (
    <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-6">
      <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
        <FiFilePlus size={20} className="text-tea-600" /> Upload PDF
      </h3>
      <div 
        ref={fileInputRef}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragActive 
            ? 'border-tea-500 bg-tea-50 dark:bg-tea-800/50' 
            : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
        }`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" multiple />
        <FiFilePlus size={48} className="mx-auto text-tea-400 mb-3" />
        <p className="text-tea-600 dark:text-tea-400">Drag & drop PDFs here or click to browse</p>
        <p className="text-sm text-tea-500 dark:text-tea-500 mt-1">Multiple files supported • Max 200MB each</p>
      </div>
      
      {state.files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-tea-700 dark:text-tea-300 mb-2">Loaded Files ({state.files.length})</h4>
          <div className="flex flex-wrap gap-2">
            {state.files.map((f, i) => (
              <button
                key={i}
                onClick={() => actions.setCurrentFile(i)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  i === state.currentFileIndex
                    ? 'bg-tea-600 text-white'
                    : 'bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 hover:bg-tea-200 dark:hover:bg-tea-700'
                }`}
              >
                <FiFileText size={12} />
                <span className="truncate max-w-[150px]">{f.name}</span>
                <span className="text-xs opacity-70">{f.size ? `${(f.size/1024/1024).toFixed(1)}MB` : ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Toolbar() {
  const { state, actions } = usePDFEditor()
  
  if (!state.pdfDoc) return null
  
  return (
    <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 flex flex-wrap gap-3">
      {/* Zoom */}
      <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
        <button onClick={() => actions.setPreviewScale(s => Math.max(s - 0.25, 0.25))} className="btn-icon" title="Zoom Out">
          <FiZoomOut size={18} />
        </button>
        <span className="text-sm text-tea-600 dark:text-tea-400 px-2 w-16 text-center">{Math.round(state.previewScale * 100)}%</span>
        <button onClick={() => actions.setPreviewScale(s => Math.min(s + 0.25, 4))} className="btn-icon" title="Zoom In">
          <FiZoomIn size={18} />
        </button>
        <button onClick={() => actions.setPreviewScale(1)} className="btn-icon" title="Reset Zoom">
          <FiRotateCcw size={18} />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 border-r border-tea-200 dark:border-tea-700 px-4">
        <button onClick={() => actions.undo()} disabled={state.state.historyIndex <= 0} className="btn-icon" title="Undo">
          <FiUndo size={18} />
        </button>
        <button onClick={() => actions.redo()} disabled={state.state.historyIndex >= state.state.history.length - 1} className="btn-icon" title="Redo">
          <FiRedo size={18} />
        </button>
      </div>

      {/* File Actions */}
      <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-4">
        <button onClick={() => actions.actions.setMergeDialog?.(true)} className="btn-icon" title="Merge PDFs">
          <FiCopy size={18} />
        </button>
        <button onClick={() => { /* add blank page */ }} className="btn-icon" title="Add Blank Page">
          <FiFilePlus2 size={18} />
        </button>
      </div>

      {/* Save/Download */}
      <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-4">
        <button className="btn-primary" title="Save Changes">
          <FiSave size={18} className="mr-1" /> Save
        </button>
        <button className="btn-outline" title="Download">
          <FiDownload size={18} />
        </button>
      </div>

      {/* Print */}
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => window.print()} className="btn-icon" title="Print">
          <FiPrinter size={18} />
        </button>
      </div>
    </div>
  )
}

function PDFEditorContent() {
  const { state, actions } = usePDFEditor()
  
  if (state.files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-tea-50 dark:bg-tea-800/50 rounded-2xl border-2 border-dashed border-tea-200 dark:border-tea-700">
        <div className="text-center p-8">
          <FiFilePlus size={64} className="mx-auto text-tea-300 dark:text-tea-600 mb-4" />
          <h3 className="text-xl font-semibold text-tea-700 dark:text-tea-300 mb-2">No PDF Loaded</h3>
          <p className="text-tea-500 dark:text-tea-400">Upload a PDF to start editing</p>
        </div>
      </div>
    )
  }

  // Render active category tool
  const renderActiveTool = () => {
    switch (state.activeCategory) {
      case 'edit': return <EditTools />
      case 'ocr': return <OCRTools />
      case 'convert': return <ConvertTools />
      case 'compress': return <CompressTools />
      case 'organize': return <OrganizeTools />
      case 'secure': return <SecureTools />
      case 'sign': return <SignTools />
      case 'clean': return <CleanTools />
      case 'extract': return <ExtractTools />
      case 'forms': return <FormsTools />
      case 'watermark': return <WatermarkTools />
      case 'header-footer': return <HeaderFooterTools />
      case 'compare': return <CompareTools />
      case 'images': return <ImageTools />
      default: return <OrganizeTools />
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Toolbar />
      <div className="flex-1 flex mt-4 min-h-0">
        <CategorySidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin text-tea-600">Loading tool...</div></div>}>
            {renderActiveTool()}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default function PDFEditor() {
  return (
    <PDFEditorProvider>
      <div className="space-y-6 h-[calc(100vh-120px)]">
        <FileUploadSection />
        <PDFEditorContent />
      </div>
    </PDFEditorProvider>
  )
}

export default PDFEditor