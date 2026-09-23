import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiEraser, FiWand2, FiRotateCcw, FiShield, FiDownload, FiSave, FiFileText, FiImage, FiSearch, FiCheckCircle, FiAlertTriangle, FiInfo, FiHelpCircle, FiTrash2, FiFilePlus, FiFileMinus, FiArrowUpRight, FiLoader, FiCheck, FiX, FiSettings, FiHelpCircle as FiHelpCircleIcon, FiAlertCircle, FiBadgeCheck, FiBadgeAlert } from 'react-icons/fi'

const CLEAN_CATEGORIES = [
  { id: 'optimize', label: 'Optimize', icon: FiWand2, desc: 'Reduce file size, linearize', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { id: 'repair', label: 'Repair', icon: FiRotateCcw, desc: 'Fix corrupted PDFs', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { id: 'pdfa', label: 'PDF/A', icon: FiShield, desc: 'Convert to archival format', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { id: 'sanitize', label: 'Sanitize', icon: FiEraser, desc: 'Remove metadata, JS, hidden objects', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { id: 'blank', label: 'Remove Blank', icon: FiFileMinus, desc: 'Delete empty pages', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  { id: 'flatten', label: 'Flatten', icon: FiFileText, desc: 'Flatten forms & annotations', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' }
]

export default function CleanTools() {
  const { state, actions } = usePDFEditor()
  const [activeTool, setActiveTool] = useState('optimize')
  const [options, setOptions] = useState({
    preset: 'recommended',
    dpi: 150,
    imageQuality: 75,
    stripMetadata: true,
    linearize: true,
    pdfaLevel: '2b',
    blankThreshold: 0.01,
    flattenForms: true,
    flattenAnnotations: true
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleProcess = async (tool) => {
    if (!currentFile) return
    
    setIsProcessing(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90))
    }, 300)
    
    try {
      // Mock processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setResult({
        tool,
        originalSize: currentFile.file.size,
        compressedSize: Math.round(currentFile.file.size * 0.6),
        savingsPercent: 40,
        message: `${tool.charAt(0).toUpperCase() + tool.slice(1)} completed successfully`
      })
    } catch (err) {
      console.error('Clean error:', err)
      alert('Processing failed: ' + err.message)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }
  
  const downloadResult = () => {
    if (result) {
      alert('Download processed PDF - implement backend download')
      setResult(null)
    }
  }

  const currentToolConfig = CLEAN_CATEGORIES.find(c => c.id === activeTool)

  return (
    <div className="h-full flex flex-col">
      {/* Tool Selection */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-3">Clean & Optimize Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {CLEAN_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTool(cat.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                activeTool === cat.id
                  ? `${cat.color} border-${cat.color.replace('bg-', '').replace('-100', '-600').replace('-900/30', '-600')} shadow-sm`
                  : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon size={20} className="text-white" />
              </div>
              <h4 className="font-semibold text-tea-900 dark:text-tea-100 mt-2">{cat.label}</h4>
              <p className="text-xs text-tea-600 dark:text-tea-400 mt-1">{cat.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Options */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          {currentToolConfig?.icon && <currentToolConfig.icon size={20} className="text-tea-600" />}
          {currentToolConfig?.label} Options
        </h3>
        
        {activeTool === 'optimize' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-2">Preset</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['lossless', 'recommended', 'high', 'maximum'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setOptions({...options, preset})}
                    className={`p-3 rounded-lg border-2 text-center ${options.preset === preset ? 'border-tea-600 bg-tea-50 dark:bg-tea-800/50' : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'}`}
                  >
                    <div className="font-medium capitalize">{preset}</div>
                    <div className="text-xs text-tea-500">
                      {preset === 'lossless' && 'Best quality'}
                      {preset === 'recommended' && 'Balanced'}
                      {preset === 'high' && 'High compression'}
                      {preset === 'maximum' && 'Maximum compression'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-tea-100 dark:border-tea-800">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">DPI</label>
                <select value={options.dpi} onChange={(e) => setOptions({...options, dpi: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="72">72 DPI</option>
                  <option value="150">150 DPI</option>
                  <option value="300">300 DPI</option>
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
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="stripMetadata" checked={options.stripMetadata} onChange={(e) => setOptions({...options, stripMetadata: e.target.checked})} className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="stripMetadata" className="text-sm text-tea-700">Strip metadata & hidden objects</label>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="linearize" checked={options.linearize} onChange={(e) => setOptions({...options, linearize: e.target.checked})} className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="linearize" className="text-sm text-tea-700">Linearize (Fast Web View)</label>
            </div>
          </div>
        )}
        
        {activeTool === 'repair' && (
          <div className="text-center py-8">
            <FiRotateCcw size={48} className="mx-auto text-tea-400 mb-4" />
            <h4 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">Repair Corrupted PDF</h4>
            <p className="text-tea-600 dark:text-tea-400 mb-4">Attempts to fix corrupted or damaged PDF files using QPDF and Ghostscript</p>
            <p className="text-sm text-tea-500 mb-6">Automatically tries QPDF first, then Ghostscript as fallback</p>
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-tea-700 dark:text-tea-300">Repair attempts to fix:</p>
              <ul className="list-disc list-inside text-sm text-tea-600 mt-2 space-y-1">
                <li>Corrupted cross-reference tables</li>
                <li>Broken object streams</li>
                <li>Missing or corrupt fonts</li>
                <li>Damaged page tree</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTool === 'pdfa' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-2">PDF/A Level</label>
              <select value={options.pdfaLevel} onChange={(e) => setOptions({...options, pdfaLevel: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                <option value="1b">PDF/A-1b (Basic)</option>
                <option value="2b">PDF/A-2b (Recommended)</option>
                <option value="2u">PDF/A-2u (Unicode)</option>
                <option value="3b">PDF/A-3b</option>
                <option value="3u">PDF/A-3u</option>
              </select>
            </div>
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4">
              <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">About PDF/A</h4>
              <ul className="list-disc list-inside text-sm text-tea-600 space-y-1">
                <li>ISO standard for long-term archiving</li>
                <li>All fonts must be embedded</li>
                <li>No encryption, JavaScript, or external references</li>
                <li>Colors in device-independent spaces</li>
                <li>Metadata in XMP format</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTool === 'sanitize' && (
          <div className="space-y-3">
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <FiAlertTriangle size={18} className="text-amber-600" />
                This removes data permanently
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">Sanitization permanently removes metadata, JavaScript, embedded files, and hidden objects. Cannot be undone.</p>
            </div>
            <div className="space-y-2">
              {[
                { key: 'metadata', label: 'Document metadata (author, title, dates)' },
                { key: 'javascript', label: 'JavaScript actions & scripts' },
                { key: 'embeddedFiles', label: 'Embedded files & attachments' },
                { key: 'hiddenLayers', label: 'Hidden layers & OCGs' },
                { key: 'annotations', label: 'Annotations & comments' },
                { key: 'formFields', label: 'Form fields (flatten)' },
                { key: 'bookmarks', label: 'Bookmarks/outlines' },
                { key: 'thumbnails', label: 'Page thumbnails' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                  <span className="text-sm text-tea-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {activeTool === 'blank' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Blank Page Threshold</label>
              <input type="range" value={options.blankThreshold} onChange={(e) => setOptions({...options, blankThreshold: parseFloat(e.target.value)})} min="0.001" max="0.1" step="0.001" className="w-full" />
              <div className="flex justify-between text-xs text-tea-500 mt-1">
                <span>Sensitive (0.1%)</span>
                <span>{(options.blankThreshold * 100).toFixed(2)}%</span>
                <span>Lenient (10%)</span>
              </div>
            </div>
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4">
              <p className="text-sm text-tea-700 mb-2">A page is considered blank if it has:</p>
              <ul className="list-disc list-inside text-sm text-tea-600 space-y-1">
                <li>Less text than threshold percentage</li>
                <li>No images</li>
                <li>No vector drawings</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTool === 'flatten' && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700">Flatten form fields</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700">Flatten annotations & comments</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
              <span className="text-sm text-tea-700">Flatten digital signatures</span>
            </label>
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mt-4">
              <p className="text-sm text-tea-700">Flattening makes form fields and annotations part of the page content. They become non-editable but visible in all viewers.</p>
            </div>
          </div>
        )}
      </div>

      {/* Process Button */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100">{activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} PDF</h3>
            <p className="text-sm text-tea-600 dark:text-tea-400">Process the current PDF with selected options</p>
          </div>
          <button onClick={() => handleProcess(activeTool)} disabled={isProcessing || !state.pdfDoc} className="btn-primary whitespace-nowrap">
            {isProcessing ? (
              <>
                <FiLoader className="animate-spin mr-2" size={18} />
                Processing... {progress}%
              </>
            ) : (
              <>
                <FiWand2 size={18} className="mr-2" />
                Process & Download
              </>
            )}
          </button>
        </div>
        
        {isProcessing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-tea-900 dark:text-tea-100">Processing...</span>
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
              {activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Complete
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-tea-800 rounded-xl p-4 text-center">
              <p className="text-sm text-tea-500 dark:text-tea-400">Original Size</p>
              <p className="text-2xl font-bold text-tea-900 dark:text-tea-100">{(result.originalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="bg-white dark:bg-tea-800 rounded-xl p-4 text-center">
              <p className="text-sm text-tea-500 dark:text-tea-400">Processed Size</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{(result.compressedSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={downloadResult} className="flex-1 btn-primary">
              <FiDownload size={18} className="mr-1" /> Download
            </button>
            <button className="btn-outline" onClick={() => setResult(null)}>
              <FiX size={18} className="mr-1" /> Process Another
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-tea-50 dark:bg-tea-800/50 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
        <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
          <FiInfo size={18} /> When to Use Each Tool
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-tea-700 dark:text-tea-300">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
            <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Optimize</h5>
            <p className="text-xs">Reduce file size for sharing, email, web upload</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
            <h5 className="font-medium text-green-800 dark:text-green-300 mb-1">Repair</h5>
            <p className="text-xs">Fix corrupted PDFs that won&apos;t open</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3">
            <h5 className="font-medium text-purple-800 dark:text-purple-300 mb-1">PDF/A</h5>
            <p className="text-xs">Long-term archival, legal compliance</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-3">
            <h5 className="font-medium text-red-800 dark:text-red-300 mb-1">Sanitize</h5>
            <p className="text-xs">Remove sensitive metadata before sharing</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-3">
            <h5 className="font-medium text-amber-800 dark:text-amber-300 mb-1">Remove Blank</h5>
            <p className="text-xs">Clean up scanned docs with blank pages</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-3">
            <h5 className="font-medium text-teal-800 dark:text-teal-300 mb-1">Flatten</h5>
            <p className="text-xs">Make forms/annotations permanent</p>
          </div>
        </div>
      </div>
    </div>
  )
}