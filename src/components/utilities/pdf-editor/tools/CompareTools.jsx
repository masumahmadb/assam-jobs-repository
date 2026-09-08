import React, { useState } from 'react'
import { FiGitCompare, FiFilePdf, FiEye, FiDownload, FiSearch, FiAlertTriangle, FiInfo, FiHelpCircle, FiArrowLeft, FiArrowRight, FiZoomIn, FiZoomOut, FiRotateCw, FiMaximize2, FiMinimize2, FiGrid } from 'react-icons/fi'

export default function CompareTools() {
  const [fileA, setFileA] = useState(null)
  const [fileB, setFileB] = useState(null)
  const [mode, setMode] = useState('visual') // visual, text, metadata
  const [isProcessing, setIsProcessing] = useState(false)
  const [differences, setDifferences] = useState([])
  const [currentDiff, setCurrentDiff] = useState(0)

  const handleFileA = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') setFileA(file)
    e.target.value = ''
  }

  const handleFileB = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') setFileB(file)
    e.target.value = ''
  }

  const handleCompare = async () => {
    if (!fileA || !fileB) return
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Mock differences
      setDifferences([
        { page: 1, type: 'text', description: 'Paragraph 3 changed: "2025" → "2026"', severity: 'major' },
        { page: 2, type: 'image', description: 'Logo updated', severity: 'minor' },
        { page: 3, type: 'text', description: 'Added new paragraph', severity: 'major' },
        { page: 4, type: 'formatting', description: 'Font size changed 12pt → 11pt', severity: 'minor' }
      ])
    } catch (err) {
      alert('Comparison failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* File Selection */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiGitCompare size={20} className="text-tea-600" /> Compare Two PDFs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 border-2 border-dashed border-tea-200 dark:border-tea-700">
            <label className="block text-sm font-medium text-tea-700 mb-2">Document A (Original)</label>
            <input type="file" accept=".pdf" onChange={handleFileA} className="w-full mb-2" />
            {fileA && (
              <div className="flex items-center justify-between p-2 bg-white dark:bg-tea-800 rounded">
                <span className="text-sm truncate">{fileA.name}</span>
                <span className="text-xs text-tea-500">{(fileA.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
          </div>
          <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 border-2 border-dashed border-tea-200 dark:border-tea-700">
            <label className="block text-sm font-medium text-tea-700 mb-2">Document B (Modified)</label>
            <input type="file" accept=".pdf" onChange={handleFileB} className="w-full mb-2" />
            {fileB && (
              <div className="flex items-center justify-between p-2 bg-white dark:bg-tea-800 rounded">
                <span className="text-sm truncate">{fileB.name}</span>
                <span className="text-xs text-tea-500">{(fileB.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: 'visual', label: 'Visual Diff', icon: FiEye },
            { id: 'text', label: 'Text Diff', icon: FiSearch },
            { id: 'metadata', label: 'Metadata', icon: FiInfo }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                mode === mode
                  ? 'bg-tea-600 text-white'
                  : 'text-tea-700 dark:text-tea-300 hover:bg-tea-100 dark:hover:bg-tea-800'
              }`}
            >
              <mode.icon size={16} />
              {mode.label}
            </button>
          ))}
        </div>

        <button onClick={handleCompare} disabled={isProcessing || !fileA || !fileB} className="btn-primary w-full">
          {isProcessing ? (
            <>
              <FiLoader className="animate-spin mr-2" size={18} />
              Comparing...
            </>
          ) : (
            <>
              <FiGitCompare size={18} className="mr-2" />
              Compare Documents
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {differences.length > 0 && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden">
          <div className="p-4 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              Found {differences.length} difference{differences.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentDiff(Math.max(0, currentDiff - 1))} disabled={currentDiff === 0} className="btn-icon" title="Previous">
                <FiArrowLeft size={18} />
              </button>
              <span className="text-sm text-tea-700 dark:text-tea-300 px-2">
                {currentDiff + 1} / {differences.length}
              </span>
              <button onClick={() => setCurrentDiff(Math.min(differences.length - 1, currentDiff + 1))} disabled={currentDiff === differences.length - 1} className="btn-icon" title="Next">
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-tea-100 dark:divide-tea-800">
            {differences.map((diff, i) => (
              <div key={i} className={`p-4 ${i === currentDiff ? 'bg-tea-50 dark:bg-tea-800/50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      diff.severity === 'major' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {diff.severity.toUpperCase()}
                    </span>
                    <span className="font-medium text-tea-900 dark:text-tea-100">Page {diff.page}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-tea-100 dark:bg-tea-800 text-tea-700">{diff.type}</span>
                  </div>
                  <span className="text-sm text-tea-500">Diff #{i + 1}</span>
                </div>
                <p className="text-tea-700 dark:text-tea-300">{diff.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-tea-100 dark:border-tea-800 flex justify-end gap-3">
            <button className="btn-outline">Export Report</button>
            <button className="btn-primary">
              <FiDownload size={18} className="mr-1" /> Export Diff Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareTools