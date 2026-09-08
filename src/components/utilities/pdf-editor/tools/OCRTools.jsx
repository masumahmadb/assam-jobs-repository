import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiSearch, FiFileText, FiDownload, FiEye, FiLanguages, FiCheckCircle, FiAlertTriangle, FiRotateCcw, FiSparkles, FiSettings, FiHelpCircle, FiInfo, FiGlobe, FiFile, FiLoader, FiCheck, FiX } from 'react-icons/fi'

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi (Devanagari)' },
  { code: 'asm', name: 'Assamese' },
  { code: 'ben', name: 'Bengali' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'kan', 'name': 'Kannada' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'mar', name: 'Marathi' },
  { code: 'ori', name: 'Odia' },
  { code: 'pun', name: 'Punjabi' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'urd', name: 'Urdu' }
]

export default function OCRTools() {
  const { state, actions } = usePDFEditor()
  const [selectedLanguages, setSelectedLanguages] = useState(['eng', 'hin', 'asm'])
  const [options, setOptions] = useState({
    deskew: true,
    clean: true,
    forceOcr: false,
    outputType: 'pdf', // pdf, txt, both
    dpi: 300
  })
  const [ocrResults, setOcrResults] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleLanguageToggle = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    )
  }
  
  const handleOcr = async () => {
    if (!currentFile) return
    
    setIsProcessing(true)
    setProgress(0)
    
    try {
      // For browser-based OCR, use Tesseract.js
      // For server-side, call backend API
      const formData = new FormData()
      formData.append('files', currentFile.file)
      formData.append('options', JSON.stringify({
        language: selectedLanguages.join('+'),
        deskew: options.deskew,
        clean: options.clean,
        forceOcr: options.forceOcr,
        outputType: options.outputType,
        dpi: options.dpi
      }))
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90))
      }, 500)
      
      // In real implementation, call backend API
      // const response = await fetch('/api/ocr', { method: 'POST', body: formData })
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Mock result
      setOcrResults([
        { page: 1, text: 'Sample extracted text from page 1...', confidence: 95 },
        { page: 2, text: 'Sample extracted text from page 2...', confidence: 92 }
      ])
      
    } catch (err) {
      console.error('OCR error:', err)
      alert('OCR failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const downloadText = () => {
    const text = ocrResults.map(r => `--- Page ${r.page} ---\n${r.text}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const downloadSearchablePdf = () => {
    // Download the searchable PDF from backend
    alert('Download searchable PDF - implement backend download')
  }

  return (
    <div className="h-full flex flex-col">
      {/* OCR Settings */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiSearch size={20} className="text-tea-600" /> OCR Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-tea-700 dark:text-tea-300 mb-2">Languages</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-tea-200 dark:border-tea-700 rounded-lg p-2">
              {LANGUAGES.map(lang => (
                <label key={lang.code} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm cursor-pointer transition-colors ${
                  selectedLanguages.includes(lang.code)
                    ? 'bg-tea-600 text-white'
                    : 'bg-tea-100 dark:bg-tea-800 text-tea-700 hover:bg-tea-200'
                }`}>
                  <input type="checkbox" checked={selectedLanguages.includes(lang.code)} onChange={() => handleLanguageToggle(lang.code)} className="sr-only" />
                  {lang.name}
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={options.deskew} onChange={(e) => setOptions({...options, deskew: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700 dark:text-tea-300">Auto-deskew (straighten pages)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={options.clean} onChange={(e) => setOptions({...options, clean: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700 dark:text-tea-300">Clean (remove noise, enhance)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={options.forceOcr} onChange={(e) => setOptions({...options, forceOcr: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700 dark:text-tea-300">Force OCR (ignore existing text)</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-tea-700 dark:text-tea-300 mb-1">Output Type</label>
            <select value={options.outputType} onChange={(e) => setOptions({...options, outputType: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
              <option value="pdf">Searchable PDF</option>
              <option value="txt">Plain Text</option>
              <option value="both">Both PDF + Text</option>
            </select>
            
            <label className="block text-sm font-medium text-tea-700 dark:text-tea-300 mb-1">DPI</label>
            <select value={options.dpi} onChange={(e) => setOptions({...options, dpi: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
              <option value="150">150 DPI (Fast)</option>
              <option value="300">300 DPI (Balanced)</option>
              <option value="600">600 DPI (High Quality)</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 pt-4 border-t border-tea-100 dark:border-tea-800">
          <button onClick={handleOcr} disabled={isProcessing || !selectedLanguages.length} className="btn-primary flex-1 min-w-[200px]">
            {isProcessing ? (
              <>
                <FiLoader className="animate-spin mr-2" size={18} />
                Processing... {progress}%
              </>
            ) : (
              <>
                <FiSparkles size={18} className="mr-2" />
                Start OCR
              </>
            )}
          </button>
          <button onClick={downloadText} disabled={ocrResults.length === 0} className="btn-outline">
            <FiDownload size={18} className="mr-1" /> Download Text
          </button>
          <button onClick={downloadSearchablePdf} disabled={ocrResults.length === 0} className="btn-outline">
            <FiFileText size={18} className="mr-1" /> Download PDF
          </button>
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-tea-900 dark:text-tea-100">Processing OCR...</span>
            <span className="text-tea-600 dark:text-tea-400">{progress}%</span>
          </div>
          <div className="h-2 bg-tea-100 dark:bg-tea-800 rounded-full overflow-hidden">
            <div className="h-full bg-tea-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-tea-500 dark:text-tea-400 mt-2 text-center">
            Processing page {currentPage}... Please wait.
          </p>
        </div>
      )}

      {/* Results */}
      {ocrResults.length > 0 && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden">
          <div className="p-4 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              OCR Results ({ocrResults.length} pages)
            </h3>
            <div className="flex gap-2">
              <button onClick={downloadText} className="btn-outline text-sm">
                <FiDownload size={14} className="mr-1" /> Download Text
              </button>
              <button onClick={downloadSearchablePdf} className="btn-primary text-sm">
                <FiFileText size={14} className="mr-1" /> Download Searchable PDF
              </button>
            </div>
          </div>
          <div className="divide-y divide-tea-100 dark:divide-tea-800">
            {ocrResults.map((result, i) => (
              <div key={i} className="p-4 hover:bg-tea-50 dark:hover:bg-tea-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-tea-900 dark:text-tea-100">Page {result.page}</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${result.confidence > 90 ? 'bg-green-100 text-green-700' : result.confidence > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {result.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-tea-700 dark:text-tea-300 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono text-xs">{result.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help/Info */}
      <div className="mt-4 bg-tea-50 dark:bg-tea-800/50 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
        <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
          <FiHelpCircle size={18} /> Tips for Best OCR Results
        </h4>
        <ul className="text-sm text-tea-700 dark:text-tea-300 space-y-1 list-disc list-inside">
          <li>Use 300 DPI for best accuracy</li>
          <li>Enable "Clean" for noisy/scanned documents</li>
          <li>Select only the languages you need (fewer = faster)</li>
          <li>Use "Force OCR" for image-only PDFs</li>
          <li>Assamese (asm) requires Tesseract 4.1+</li>
          <li>Large files (>50MB) may take several minutes</li>
        </ul>
      </div>
    </div>
  )
}

export default OCRTools