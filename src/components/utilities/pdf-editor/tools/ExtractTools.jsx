import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiFileText, FiImage, FiTable, FiSearch, FiDownload, FiCopy, FiEye, FiFile, FiFilter, FiScissors, FiCopy, FiFileExcel, FiFilePowerpoint, FiCode, FiCheckCircle, FiAlertTriangle, FiInfo, FiHelpCircle, FiMagnifyingGlass, FiList, FiGrid, FiFileExcel, FiFilePowerpoint, FiCode, FiFileText as FiFileTextIcon } from 'react-icons/fi'

export default function ExtractTools() {
  const { state, actions } = usePDFEditor()
  const [activeTab, setActiveTab] = useState('text')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [extractOptions, setExtractOptions] = useState({
    pages: 'all',
    format: 'txt',
    includeImages: true,
    includeTables: false
  })
  const [searchMatches, setSearchMatches] = useState([])
  const [currentMatch, setCurrentMatch] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleExtract = async (type) => {
    if (!state.pdfDoc) return
    
    setIsProcessing(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90))
    }, 300)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setResult({
        type,
        originalName: state.files[0]?.name || 'document.pdf'
      })
    } catch (err) {
      console.error('Extract error:', err)
      alert('Extraction failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return
    // In real implementation, search through pdf.js text layer
    const mockMatches = [
      { page: 1, context: `...found "${searchQuery}" in the first paragraph...`, index: 0 },
      { page: 3, context: `...another occurrence of "${searchQuery}" near the end...`, index: 1 }
    ]
    setSearchMatches(mockMatches)
    setCurrentMatch(0)
  }
  
  const navigateMatch = (direction) => {
    if (searchMatches.length === 0) return
    setCurrentMatch(prev => (prev + direction + searchMatches.length) % searchMatches.length)
    // In real implementation, scroll to match on page
  }
  
  const downloadResult = () => {
    if (result) {
      alert(`Download extracted ${result.type} - implement backend download`)
      setResult(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'text', label: 'Extract Text', icon: FiFileText, desc: 'Full text or selected pages' },
            { id: 'images', label: 'Extract Images', icon: FiImage, desc: 'All images as JPG/PNG/WebP' },
            { id: 'tables', label: 'Extract Tables', icon: FiTable, desc: 'Tables to CSV/Excel' },
            { id: 'search', label: 'Search', icon: FiSearch, desc: 'Find text across pages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-tea-600 text-white'
                  : 'text-tea-700 dark:text-tea-300 hover:bg-tea-100 dark:hover:bg-tea-800'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-tea-600" /> Extract Text
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Pages</label>
                <select value={extractOptions.pages} onChange={(e) => setExtractOptions({...extractOptions, pages: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="all">All Pages</option>
                  <option value="current">Current Page</option>
                  <option value="range">Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Output Format</label>
                <select value={extractOptions.format} onChange={(e) => setExtractOptions({...extractOptions, format: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="txt">Plain Text (.txt)</option>
                  <option value="md">Markdown (.md)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="includeImages" checked={extractOptions.includeImages} onChange={(e) => setExtractOptions({...extractOptions, includeImages: e.target.checked})} className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
                <label htmlFor="includeImages" className="text-sm text-tea-700 mt-1">Include image placeholders</label>
              </div>
            </div>
            
            <button onClick={() => handleExtract('text')} disabled={isProcessing || !state.pdfDoc} className="btn-primary w-full">
              {isProcessing ? 'Extracting...' : 'Extract Text & Download'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiImage size={20} className="text-tea-600" /> Extract Images
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Image Format</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG (Compressed)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">DPI</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="72">72 DPI (Web)</option>
                  <option value="150">150 DPI (Standard)</option>
                  <option value="300">300 DPI (Print)</option>
                  <option value="600">600 DPI (Archive)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Pages</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="all">All Pages</option>
                  <option value="current">Current Page</option>
                  <option value="range">Custom Range</option>
                </select>
              </div>
            </div>
            
            <button className="btn-primary w-full">
              <FiImage size={18} className="mr-2" /> Extract All Images as ZIP
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiTable size={20} className="text-tea-600" /> Extract Tables
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Engine</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="lattice">Lattice (Ruled Tables)</option>
                  <option value="stream">Stream (Borderless)</option>
                  <option value="auto">Auto Detect</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Output Format</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="ocrTables" className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
                <label className="text-sm text-tea-700 mt-1">OCR scanned tables first</label>
              </div>
            </div>
            
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">Table Extraction Tips</h4>
              <ul className="text-sm text-tea-600 dark:text-tea-400 list-disc list-inside space-y-1">
                <li>Use <strong>Lattice</strong> for tables with clear borders/grid lines</li>
                <li>Use <strong>Stream</strong> for borderless tables with whitespace separation</li>
                <li>Enable OCR for scanned/image-based PDFs</li>
                <li>Review extracted data - OCR may have errors</li>
                <li>Complex nested tables may need manual review</li>
              </ul>
            </div>
            
            <button className="btn-primary w-full">
              <FiTable size={18} className="mr-2" /> Extract Tables to CSV/Excel
            </button>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiSearch size={20} className="text-tea-600" /> Search in PDF
            </h3>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search text in PDF..."
                className="flex-1 px-4 py-2 border border-tea-200 dark:border-tea-700 rounded-xl bg-white dark:bg-tea-800"
              />
              <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
                <FiSearch size={18} className="mr-1" /> Search
              </button>
              <button onClick={() => setSearchQuery('')} className="btn-outline">
                <FiX size={18} /> Clear
              </button>
            </div>
            
            {searchMatches.length > 0 && (
              <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-tea-900 dark:text-tea-100">
                    {searchMatches.length} match{searchMatches.length !== 1 ? 'es' : ''} for "<strong>{searchQuery}</strong>"
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigateMatch(-1)} disabled={currentMatch === 0} className="btn-icon" title="Previous">
                      <FiArrowUp size={18} />
                    </button>
                    <span className="text-sm text-tea-700 dark:text-tea-300 px-2">
                      {currentMatch + 1} / {searchMatches.length}
                    </span>
                    <button onClick={() => navigateMatch(1)} disabled={currentMatch === searchMatches.length - 1} className="btn-icon" title="Next">
                      <FiArrowDown size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchMatches.map((match, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${i === currentMatch ? 'bg-tea-100 dark:bg-tea-800 border-tea-500' : 'bg-white dark:bg-tea-800 border-tea-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-tea-900 dark:text-tea-100">Page {match.page}</span>
                        <span className="text-xs text-tea-500 dark:text-tea-400">Match #{i + 1}</span>
                      </div>
                      <p className="text-sm text-tea-700 dark:text-tea-300">
                        ...{match.context}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Result Display */}
      {result && (
        <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl border border-green-200 dark:border-green-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              Extraction Complete
            </h3>
            <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
              {result.type || 'Extraction'}
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-tea-600 dark:text-tea-400">Original: {result.originalName}</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={downloadResult} className="flex-1 btn-primary">
              <FiDownload size={18} className="mr-1" /> Download
            </button>
            <button className="btn-outline" onClick={() => setResult(null)}>
              <FiX size={18} className="mr-1" /> Extract Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExtractTools