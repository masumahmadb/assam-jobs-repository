import React, { useState } from 'react'
import { FiDownload, FiImage, FiFilePdf, FiArrowUpRight, FiArrowRight, FiArrowLeft, FiRotateCw, FiCrop, FiResize, FiEdit, FiHelpCircle, FiInfo, FiAlertTriangle, FiSearch, FiCheckCircle, FiX, FiPlus, FiMinus, FiMove, FiSettings, FiSlidersHorizontal, FiLoader } from 'react-icons/fi'

export default function ImageTools() {
  const [activeTab, setActiveTab] = useState('pdf-to-image')
  const [options, setOptions] = useState({
    dpi: 150,
    format: 'png',
    quality: 80,
    pages: 'all'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  
  const handleConvert = async () => {
    // Mock conversion
    setIsProcessing(true)
    setProgress(0)
    const interval = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 300)
    await new Promise(r => setTimeout(r, 2000))
    clearInterval(interval)
    setProgress(100)
    setResult({ type: activeTab, files: 5 })
    setIsProcessing(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'pdf-to-image', label: 'PDF → Images', icon: FiArrowRight, desc: 'Extract pages as JPG/PNG/WebP' },
            { id: 'image-to-pdf', label: 'Images → PDF', icon: FiArrowLeft, desc: 'Combine images into PDF' },
            { id: 'rotate', label: 'Rotate Images', icon: FiRotateCw, desc: 'Rotate images in PDF' },
            { id: 'crop', label: 'Crop Images', icon: FiCrop, desc: 'Crop images in PDF pages' },
            { id: 'resize', label: 'Resize Images', icon: FiResize, desc: 'Resize images in PDF' },
            { id: 'optimize', label: 'Optimize Images', icon: FiSlidersHorizontal, desc: 'Compress images in PDF' }
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

      {activeTab === 'pdf-to-image' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiArrowRight size={20} className="text-tea-600" /> PDF to Images
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Format</label>
                <select value={options.format} onChange={(e) => setOptions({...options, format: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG (Compressed)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">DPI</label>
                <select value={options.dpi} onChange={(e) => setOptions({...options, dpi: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="72">72 DPI (Web)</option>
                  <option value="150">150 DPI (Standard)</option>
                  <option value="300">300 DPI (Print)</option>
                  <option value="600">600 DPI (Archive)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Quality (JPG/WebP)</label>
                <input type="range" value={options.quality} onChange={(e) => setOptions({...options, quality: parseInt(e.target.value)})} min="10" max="100" className="w-full" />
                <div className="flex justify-between text-xs text-tea-500 mt-1">
                  <span>Low</span>
                  <span>{options.quality}%</span>
                  <span>High</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Pages</label>
                <select value={options.pages} onChange={(e) => setOptions({...options, pages: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="all">All Pages</option>
                  <option value="current">Current Page</option>
                  <option value="range">Custom Range</option>
                </select>
              </div>
            </div>

            <button onClick={handleConvert} disabled={isProcessing} className="btn-primary w-full">
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin mr-2" size={18} />
                  Converting... {progress}%
                </>
              ) : (
                <>
                  <FiArrowRight size={18} className="mr-2" />
                  Convert to Images (ZIP)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'image-to-pdf' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiArrowLeft size={20} className="text-tea-600" /> Images to PDF
            </h3>
            
            <div className="border-2 border-dashed border-tea-200 dark:border-tea-700 rounded-xl p-8 text-center mb-4">
              <input type="file" accept="image/*" multiple className="hidden" id="imageUpload" onChange={(e) => setImageFiles(Array.from(e.target.files))} />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <FiImage size={48} className="mx-auto text-tea-400 mb-3" />
                <p className="text-tea-600 dark:text-tea-400">Drag & drop images here or click to browse</p>
                <p className="text-sm text-tea-500 dark:text-tea-500 mt-1">JPG, PNG, WebP, TIFF supported</p>
              </label>
            </div>
            
            {imageFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">Selected Images ({imageFiles.length})</div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {imageFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-tea-50 dark:bg-tea-800 rounded-lg">
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-tea-500">{(file.size / 1024).toFixed(1)} KB</span>
                      <button className="text-muga-600 hover:text-muga-700"><FiX size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Page Size</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="a4">A4 (210×297mm)</option>
                  <option value="letter">Letter (8.5×11in)</option>
                  <option value="legal">Legal (8.5×14in)</option>
                  <option value="fit">Fit to Image</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Orientation</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="fitImage" defaultChecked className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
                <label htmlFor="fitImage" className="text-sm text-tea-700 mt-1">Fit image to page (maintain aspect ratio)</label>
              </div>
            </div>
            
            <button className="btn-primary w-full" disabled={imageFiles.length === 0}>
              <FiFilePdf size={18} className="mr-2" /> Create PDF from Images
            </button>
          </div>
        </div>
      )}

      {['rotate', 'crop', 'resize', 'optimize'].includes(activeTab) && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
          <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
            <FiSettings size={20} className="text-tea-600" /> {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Images
          </h3>
          <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
            <p className="text-tea-600 dark:text-tea-400 text-center py-8">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} functionality - implement with pdf-lib canvas operations
            </p>
          </div>
        </div>
      )}
    </div>
  )
}