import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiDownload, FiFileText, FiFile, FiArrowUpRight, FiArrowRight, FiArrowLeft, FiImage, FiTable, FiFileExcel, FiFilePowerpoint, FiCode, FiCheckCircle, FiAlertTriangle, FiSettings, FiHelpCircle, FiInfo, FiFilePdf, FiFileWord, FiFileExcel as FiFileExcelIcon, FiFilePowerpoint as FiFilePptIcon, FiFileImage, FiFileArchive, FiArrowUp, FiArrowDown, FiRefreshCw, FiRotateCw, FiFileText as FiFileTextIcon } from 'react-icons/fi'

const CONVERSION_TYPES = [
  { from: 'pdf', to: 'docx', label: 'PDF → Word', icon: FiFileWord, desc: 'Editable .docx document', category: 'pdf-to-office' },
  { from: 'pdf', to: 'xlsx', label: 'PDF → Excel', icon: FiFileExcelIcon, desc: 'Extract tables to spreadsheet', category: 'pdf-to-office' },
  { from: 'pdf', to: 'pptx', label: 'PDF → PowerPoint', icon: FiFilePptIcon, desc: 'Slides from PDF pages', category: 'pdf-to-office' },
  { from: 'pdf', to: 'txt', label: 'PDF → Text', icon: FiFileTextIcon, desc: 'Plain text extraction', category: 'pdf-to-office' },
  { from: 'pdf', to: 'html', label: 'PDF → HTML', icon: FiCode, desc: 'Web-ready HTML', category: 'pdf-to-office' },
  { from: 'pdf', to: 'jpg', label: 'PDF → JPG', icon: FiImage, desc: 'Each page as image', category: 'pdf-to-image' },
  { from: 'pdf', to: 'png', label: 'PDF → PNG', icon: FiImage, desc: 'High quality images', category: 'pdf-to-image' },
  { from: 'pdf', to: 'webp', label: 'PDF → WebP', icon: FiImage, desc: 'Modern web format', category: 'pdf-to-image' },
  { from: 'docx', to: 'pdf', label: 'Word → PDF', icon: FiFilePdf, desc: 'Convert .docx to PDF', category: 'office-to-pdf' },
  { from: 'xlsx', to: 'pdf', label: 'Excel → PDF', icon: FiFilePdf, desc: 'Convert .xlsx to PDF', category: 'office-to-pdf' },
  { from: 'pptx', to: 'pdf', label: 'PowerPoint → PDF', icon: FiFilePdf, desc: 'Convert .pptx to PDF', category: 'office-to-pdf' },
  { from: 'jpg', to: 'pdf', label: 'JPG → PDF', icon: FiFilePdf, desc: 'Images to PDF', category: 'image-to-pdf' },
  { from: 'png', to: 'pdf', label: 'PNG → PDF', icon: FiFilePdf, desc: 'Images to PDF', category: 'image-to-pdf' },
  { from: 'webp', to: 'pdf', label: 'WebP → PDF', icon: FiFilePdf, desc: 'Images to PDF', category: 'image-to-pdf' },
  { from: 'html', to: 'pdf', label: 'HTML → PDF', icon: FiFilePdf, desc: 'Web page to PDF', category: 'office-to-pdf' },
  { from: 'txt', to: 'pdf', label: 'Text → PDF', icon: FiFilePdf, desc: 'Plain text to PDF', category: 'office-to-pdf' },
]

const CATEGORIES = [
  { id: 'pdf-to-office', label: 'PDF → Office', icon: FiArrowRight },
  { id: 'pdf-to-image', label: 'PDF → Images', icon: FiImage },
  { id: 'office-to-pdf', label: 'Office → PDF', icon: FiArrowLeft },
  { id: 'image-to-pdf', label: 'Images → PDF', icon: FiArrowUp },
]

export default function ConvertTools() {
  const { state, actions } = usePDFEditor()
  const [activeCategory, setActiveCategory] = useState('pdf-to-office')
  const [selectedConversion, setSelectedConversion] = useState(null)
  const [options, setOptions] = useState({
    ocrIfNeeded: true,
    dpi: 150,
    imageQuality: 80,
    pages: 'all'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  
  const currentFile = state.files[state.currentFileIndex]
  const filteredConversions = CONVERSION_TYPES.filter(c => c.category === activeCategory)
  
  const handleConvert = async () => {
    if (!currentFile || !selectedConversion) return
    
    setIsProcessing(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90))
    }, 300)
    
    try {
      // Mock conversion
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setResult({
        from: selectedConversion.from,
        to: selectedConversion.to,
        label: selectedConversion.label,
        originalName: state.files[0]?.name || 'document.pdf'
      })
    } catch (err) {
      console.error('Conversion error:', err)
      alert('Conversion failed: ' + err.message)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }
  
  const downloadResult = () => {
    if (result) {
      alert('Download converted file - implement backend download')
    }
  }

  const filteredForFile = (conversions) => {
    if (!currentFile) return conversions
    const fileType = currentFile.name.split('.').pop().toLowerCase()
    return conversions.filter(c => c.from === fileType || c.category === 'image-to-pdf')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-tea-600 text-white'
                  : 'text-tea-700 dark:text-tea-300 hover:bg-tea-100 dark:hover:bg-tea-800'
              }`}
            >
              <cat.icon size={16} className="mr-1" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Options */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiArrowRight size={20} className="text-tea-600" /> Select Conversion
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredConversions.filter(c => !currentFile || currentFile.name.split('.').pop().toLowerCase() === c.from || c.category === 'image-to-pdf').map(conv => (
            <button
              key={`${conv.from}-${conv.to}`}
              onClick={() => setSelectedConversion(conv)}
              className={`p-4 rounded-xl border-2 transition-all text-left h-full ${
                selectedConversion?.from === conv.from && selectedConversion?.to === conv.to
                  ? 'border-tea-600 bg-tea-50 dark:bg-tea-800/50 shadow-sm'
                  : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center">
                  <conv.icon size={24} className="text-tea-600 dark:text-tea-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-tea-900 dark:text-tea-100 truncate">{conv.label}</h4>
                  <p className="text-xs text-tea-600 dark:text-tea-400 mt-1">{conv.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-tea-500">
                    <FiFileTextIcon size={12} /> {conv.from.toUpperCase()}
                    <FiArrowRight size={10} />
                    <FiFilePdf size={12} /> {conv.to.toUpperCase()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedConversion && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
          <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
            <FiSettings size={20} className="text-tea-600" /> Conversion Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">DPI (for images)</label>
              <select value={options.dpi} onChange={(e) => setOptions({...options, dpi: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                <option value="72">72 DPI (Web)</option>
                <option value="150">150 DPI (Standard)</option>
                <option value="300">300 DPI (Print)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Image Quality</label>
              <input type="range" value={options.imageQuality} onChange={(e) => setOptions({...options, imageQuality: parseInt(e.target.value)})} min="10" max="100" className="w-full" />
              <div className="flex justify-between text-xs text-tea-500 mt-1">
                <span>Low</span>
                <span>{options.imageQuality}%</span>
                <span>High</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Pages</label>
              <select value={options.pages} onChange={(e) => setOptions({...options, pages: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                <option value="all">All Pages</option>
                <option value="1">Page 1 Only</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="ocrIfNeeded" checked={options.ocrIfNeeded} onChange={(e) => setOptions({...options, ocrIfNeeded: e.target.checked})} className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="ocrIfNeeded" className="text-sm text-tea-700 mt-1">OCR if scanned (for image PDFs)</label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-tea-900 dark:text-tea-100">{selectedConversion.label}</h3>
              <p className="text-sm text-tea-600 dark:text-tea-400">Convert {selectedConversion.from.toUpperCase()} → {selectedConversion.to.toUpperCase()}</p>
            </div>
            <button onClick={handleConvert} disabled={isProcessing || !state.pdfDoc} className="btn-primary whitespace-nowrap">
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin mr-2" size={18} />
                  Converting... {progress}%
                </>
              ) : (
                <>
                  <FiArrowRight size={18} className="mr-2" />
                  Convert & Download
                </>
              )}
            </button>
          </div>
          
          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-tea-900 dark:text-tea-100">Converting...</span>
                <span className="text-tea-600 dark:text-tea-400">{progress}%</span>
              </div>
              <div className="h-2 bg-tea-100 dark:bg-tea-800 rounded-full overflow-hidden">
                <div className="h-full bg-tea-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl border border-green-200 dark:border-green-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              Conversion Complete
            </h3>
            <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
              {result.from.toUpperCase()} → {result.to.toUpperCase()}
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-tea-600 dark:text-tea-400">Original: {result.originalName}</p>
            <p className="text-sm text-tea-600 dark:text-tea-400">Output: {result.originalName.replace(/\.[^.]+$/, `.${result.to}`)}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadResult} className="flex-1 btn-primary">
              <FiDownload size={18} className="mr-1" /> Download {result.to.toUpperCase()}
            </button>
            <button className="btn-outline" onClick={() => setResult(null)}>
              <FiX size={18} className="mr-1" /> Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats Grid */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiInfo size={20} className="text-tea-600" /> Supported Formats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { ext: 'PDF', icon: FiFilePdf, color: 'bg-red-100 text-red-700' },
            { ext: 'DOCX', icon: FiFileWord, color: 'bg-blue-100 text-blue-700' },
            { ext: 'XLSX', icon: FiFileExcelIcon, color: 'bg-green-100 text-green-700' },
            { ext: 'PPTX', icon: FiFilePptIcon, color: 'bg-orange-100 text-orange-700' },
            { ext: 'JPG', icon: FiImage, color: 'bg-purple-100 text-purple-700' },
            { ext: 'PNG', icon: FiImage, color: 'bg-pink-100 text-pink-700' },
            { ext: 'WEBP', icon: FiImage, color: 'bg-teal-100 text-teal-700' },
            { ext: 'HTML', icon: FiCode, color: 'bg-yellow-100 text-yellow-700' },
            { ext: 'TXT', icon: FiFileText, color: 'bg-gray-100 text-gray-700' },
            { ext: 'CSV', icon: FiFileExcel, color: 'bg-lime-100 text-lime-700' },
          ].map((fmt, i) => (
            <div key={i} className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${fmt.color} dark:bg-opacity-30`}>
              <fmt.icon size={18} className="mx-auto mb-1" />
              {fmt.ext}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConvertTools