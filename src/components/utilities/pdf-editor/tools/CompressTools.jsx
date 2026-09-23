import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiDownload, FiFileText, FiImage, FiTable, FiFile, FiArrowUpRight, FiLoader, FiCheckCircle, FiAlertTriangle, FiSettings, FiHelpCircle, FiInfo, FiFileMinus, FiFilePlus, FiCompress, FiExpand, FiPercent, FiTrendingDown, FiTrendingUp, FiBadgeCheck, FiBadgeAlert } from 'react-icons/fi'

const COMPRESSION_PRESETS = [
  { id: 'lossless', label: 'Lossless', desc: 'Best quality, minimal size reduction', icon: FiBadgeCheck, color: 'bg-green-100 text-green-700', savings: '5-15%' },
  { id: 'recommended', label: 'Recommended', desc: 'Balanced quality & size (150 DPI)', icon: FiBadgeCheck, color: 'bg-blue-100 text-blue-700', savings: '40-60%' },
  { id: 'high', label: 'High Compression', desc: 'Good quality, significant reduction (72 DPI)', icon: FiBadgeAlert, color: 'bg-amber-100 text-amber-700', savings: '70-85%' },
  { id: 'maximum', label: 'Maximum', desc: 'Smallest size, lower quality (72 DPI)', icon: FiBadgeAlert, color: 'bg-red-100 text-red-700', savings: '85-95%' }
]

export default function CompressTools() {
  const { state, actions } = usePDFEditor()
  const [selectedPreset, setSelectedPreset] = useState('recommended')
  const [customOptions, setCustomOptions] = useState({
    dpi: 150,
    imageQuality: 75,
    stripMetadata: true,
    linearize: true
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleCompress = async () => {
    if (!currentFile) return
    
    setIsProcessing(true)
    setResult(null)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90))
    }, 300)
    
    try {
      // In real implementation, call backend API
      // const formData = new FormData()
      // formData.append('file', currentFile.file)
      // formData.append('options', JSON.stringify({ preset: selectedPreset, ...customOptions }))
      // const response = await fetch('/api/compress', { method: 'POST', body: formData })
      
      // Mock result
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      const originalSize = currentFile.file.size
      const savingsPercent = COMPRESSION_PRESETS.find(p => p.id === selectedPreset)?.savings || '50%'
      const compressedSize = Math.round(originalSize * (1 - parseInt(savingsPercent) / 100))
      
      setResult({
        originalSize,
        compressedSize,
        savingsPercent,
        method: 'ghostscript'
      })
    } catch (err) {
      console.error('Compression error:', err)
      alert('Compression failed: ' + err.message)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }
  
  const downloadResult = () => {
    if (result) {
      alert('Download compressed PDF - implement backend download')
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preset Selection */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiCompress size={20} className="text-tea-600" /> Compression Preset
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {COMPRESSION_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedPreset === preset.id
                  ? 'border-tea-600 bg-tea-50 dark:bg-tea-800/50 shadow-md'
                  : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${preset.color} dark:bg-opacity-30`}>
                  <preset.icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-tea-900 dark:text-tea-100 truncate">{preset.label}</h4>
                  <p className="text-xs text-tea-600 dark:text-tea-400 mb-1">{preset.desc}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-tea-100 dark:bg-tea-800 text-tea-700">{preset.savings} savings</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Custom Options */}
        <div className="pt-4 border-t border-tea-100 dark:border-tea-800">
          <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-3">Advanced Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">DPI</label>
              <select value={customOptions.dpi} onChange={(e) => setCustomOptions({...customOptions, dpi: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                <option value="72">72 DPI (Screen)</option>
                <option value="96">96 DPI</option>
                <option value="150">150 DPI (Recommended)</option>
                <option value="300">300 DPI (Print)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Image Quality</label>
              <input type="range" value={customOptions.imageQuality} onChange={(e) => setCustomOptions({...customOptions, imageQuality: parseInt(e.target.value)})} min="10" max="100" className="w-full" />
              <div className="flex justify-between text-xs text-tea-500 mt-1">
                <span>Low (10)</span>
                <span>{customOptions.imageQuality}%</span>
                <span>High (100)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="stripMetadata" checked={customOptions.stripMetadata} onChange={(e) => setCustomOptions({...customOptions, stripMetadata: e.target.checked})} className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="stripMetadata" className="text-sm text-tea-700 mt-1">Strip metadata & hidden objects</label>
            </div>
          </div>
        </div>
      </div>

      {/* Compress Button */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100">Compress PDF</h3>
            <p className="text-sm text-tea-600 dark:text-tea-400">Apply compression with selected preset</p>
          </div>
          <button onClick={handleCompress} disabled={isProcessing || !state.pdfDoc} className="btn-primary whitespace-nowrap">
            {isProcessing ? (
              <>
                <FiLoader className="animate-spin mr-2" size={18} />
                Compressing... {progress}%
              </>
            ) : (
              <>
                <FiCompress size={18} className="mr-2" />
                Compress & Download
              </>
            )}
          </button>
        </div>
        
        {isProcessing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-tea-900 dark:text-tea-100">Compressing...</span>
              <span className="text-tea-600 dark:text-tea-400">{progress}%</span>
            </div>
            <div className="h-2 bg-tea-100 dark:bg-tea-800 rounded-full overflow-hidden">
              <div className="h-full bg-tea-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl border border-green-200 dark:border-green-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              Compression Complete
            </h3>
            <span className={`text-sm px-2 py-1 rounded ${result.savingsPercent > 70 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {result.savingsPercent} reduction
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-tea-800 rounded-xl p-4 text-center">
              <p className="text-sm text-tea-500 dark:text-tea-400">Original Size</p>
              <p className="text-2xl font-bold text-tea-900 dark:text-tea-100">{(result.originalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="bg-white dark:bg-tea-800 rounded-xl p-4 text-center">
              <p className="text-sm text-tea-500 dark:text-tea-400">Compressed Size</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{(result.compressedSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={downloadResult} className="flex-1 btn-primary">
              <FiDownload size={18} className="mr-1" /> Download Compressed PDF
            </button>
            <button className="btn-outline" onClick={() => setResult(null)}>
              <FiX size={18} className="mr-1" /> Compress Another
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-tea-50 dark:bg-tea-800/50 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
        <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
          <FiHelpCircle size={18} /> Compression Tips
        </h4>
        <ul className="text-sm text-tea-700 dark:text-tea-300 space-y-1 list-disc list-inside">
          <li><strong>Lossless:</strong> For archival, legal documents where quality is critical</li>
          <li><strong>Recommended:</strong> Best balance for email, web upload, general use</li>
          <li><strong>High/Maximum:</strong> For email attachments with strict size limits</li>
          <li>Higher DPI = better quality but larger file</li>
          <li>Strip metadata removes author info, creation dates, embedded thumbnails</li>
          <li>Linearize enables fast web view (progressive loading)</li>
        </ul>
      </div>
    </div>
  )
}