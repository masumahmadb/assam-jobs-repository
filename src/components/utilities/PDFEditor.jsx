import React, { useState, useRef, useEffect } from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { FiFilePlus, FiRotateCw, FiTrash2, FiArrowUp, FiArrowDown, FiDownload, FiSave, FiX, FiPlus, FiUpload, FiEye, FiEdit, FiPrinter, FiCopy } from 'react-icons/fi'

const PDFEditor = () => {
  const [files, setFiles] = useState([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [pages, setPages] = useState([])
  const [pdfDoc, setPdfDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [mergeFiles, setMergeFiles] = useState([])
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const mergeInputRef = useRef(null)

  const loadPDF = async (file) => {
    setIsLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const doc = await PDFDocument.load(arrayBuffer)
      const pageCount = doc.getPageCount()
      const pageData = []
      
      for (let i = 0; i < pageCount; i++) {
        const page = doc.getPage(i)
        const { width, height } = page.getSize()
        pageData.push({ index: i, width, height, rotation: 0 })
      }
      
      setPdfDoc(doc)
      setPages(pageData)
      setCurrentFileIndex(files.length)
      setFiles(prev => [...prev, { file, name: file.name, pageCount, pages: pageData, doc }])
    } catch (err) {
      console.error('Failed to load PDF:', err)
      alert('Failed to load PDF. Please try another file.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      loadPDF(file)
    }
    e.target.value = ''
  }

  const handleMergeFiles = async () => {
    if (mergeFiles.length < 2) return
    setIsLoading(true)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      }
      const pdfBytes = await mergedPdf.save()
      downloadBlob(pdfBytes, 'merged.pdf')
      setShowMergeDialog(false)
      setMergeFiles([])
    } catch (err) {
      console.error('Merge failed:', err)
      alert('Failed to merge PDFs')
    } finally {
      setIsLoading(false)
    }
  }

  const renderPageToCanvas = async (pageIndex) => {
    if (!pdfDoc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const page = pdfDoc.getPage(pageIndex)
    const viewport = page.getViewport({ scale: previewScale })
    
    canvas.width = viewport.width
    canvas.height = viewport.height
    
    await page.render({ canvasContext: ctx, viewport }).promise
  }

  const rotatePage = (pageIndex, degrees = 90) => {
    if (!pdfDoc) return
    const page = pdfDoc.getPage(pageIndex)
    const currentRotation = pages[pageIndex]?.rotation || 0
    page.setRotation(page.getRotation().plus({ angle: degrees }))
    setPages(prev => prev.map((p, i) => i === pageIndex ? { ...p, rotation: (p.rotation + degrees) % 360 } : p))
  }

  const deletePage = (pageIndex) => {
    if (!pdfDoc || pages.length <= 1) return
    pdfDoc.removePage(pageIndex)
    setPages(prev => prev.filter((_, i) => i !== pageIndex).map((p, i) => ({ ...p, index: i })))
  }

  const movePage = (fromIndex, toIndex) => {
    if (!pdfDoc) return
    const page = pdfDoc.getPage(fromIndex)
    pdfDoc.removePage(fromIndex)
    pdfDoc.insertPage(toIndex, page)
    setPages(prev => {
      const newPages = [...prev]
      const [removed] = newPages.splice(fromIndex, 1)
      newPages.splice(toIndex, 0, removed)
      return newPages.map((p, i) => ({ ...p, index: i }))
    })
  }

  const addBlankPage = async () => {
    if (!pdfDoc) return
    const page = pdfDoc.addPage([595, 842])
    const { width, height } = page.getSize()
    setPages(prev => [...prev, { index: prev.length, width, height, rotation: 0 }])
  }

  const savePDF = async () => {
    if (!pdfDoc) return
    setIsLoading(true)
    try {
      const pdfBytes = await pdfDoc.save()
      const currentFile = files[currentFileIndex]
      downloadBlob(pdfBytes, `edited-${currentFile?.name || 'document.pdf'}`)
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save PDF')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadBlob = (bytes, filename) => {
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleMergeFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
    setMergeFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  const removeMergeFile = (index) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (files.length > 0 && currentFileIndex < files.length) {
      setPdfDoc(files[currentFileIndex].doc)
      setPages(files[currentFileIndex].pages)
    }
  }, [currentFileIndex, files])

  useEffect(() => {
    if (pages.length > 0) {
      renderPageToCanvas(currentFileIndex)
    }
  }, [pages, previewScale, currentFileIndex])

  const currentFile = files[currentFileIndex]

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-6">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiUpload size={20} className="text-tea-600" /> Upload PDF
        </h3>
        <div 
          className="border-2 border-dashed border-tea-200 dark:border-tea-700 rounded-xl p-8 text-center hover:border-tea-400 dark:hover:border-tea-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          <FiFilePlus size={48} className="mx-auto text-tea-400 mb-3" />
          <p className="text-tea-600 dark:text-tea-400">Drag & drop PDF here or click to browse</p>
          <p className="text-sm text-tea-500 dark:text-tea-500 mt-1">Max 50MB per file</p>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${i === currentFileIndex ? 'bg-tea-600 text-white' : 'bg-tea-100 dark:bg-tea-800 text-tea-700'}`}>
                {f.name} ({f.pageCount} pages)
                {files.length > 1 && (
                  <button onClick={() => setCurrentFileIndex(i)} className="ml-1 hover:opacity-70">
                    <FiEye size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Editor Section */}
      {currentFile && (
        <>
          {/* Toolbar */}
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
              <button onClick={() => setPreviewScale(s => Math.min(s + 0.25, 3))} className="btn-icon" title="Zoom In">
                <FiPlus size={18} />
              </button>
              <button onClick={() => setPreviewScale(s => Math.max(s - 0.25, 0.5))} className="btn-icon" title="Zoom Out">
                <FiX size={18} />
              </button>
              <span className="text-sm text-tea-600 dark:text-tea-400 px-2">{Math.round(previewScale * 100)}%</span>
            </div>

            <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-4">
              <button onClick={() => addBlankPage()} className="btn-icon" title="Add Blank Page">
                <FiFilePlus size={18} />
              </button>
              <button onClick={() => setShowMergeDialog(true)} className="btn-icon" title="Merge PDFs">
                <FiCopy size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-4">
              <button onClick={savePDF} disabled={isLoading} className="btn-primary">
                <FiSave size={18} className="mr-1" /> Save Changes
              </button>
              <button onClick={() => {
                if (pdfDoc) {
                  pdfDoc.save().then(bytes => downloadBlob(bytes, `edited-${currentFile.name}`))
                }
              }} className="btn-outline" title="Download">
                <FiDownload size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => window.print()} className="btn-icon" title="Print">
                <FiPrinter size={18} />
              </button>
            </div>
          </div>

          {/* Page Thumbnails + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            {/* Thumbnails */}
            <div className="lg:col-span-1 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-y-auto max-h-[600px]">
              <div className="p-3 border-b border-tea-100 dark:border-tea-800">
                <h4 className="font-semibold text-tea-900 dark:text-tea-100">Pages ({pages.length})</h4>
              </div>
              <div className="p-2 space-y-2">
                {pages.map((page, i) => (
                  <div 
                    key={i} 
                    className={`relative group p-2 rounded-xl border-2 transition-colors ${i === 0 ? 'border-tea-500 bg-tea-50 dark:bg-tea-800/50' : 'border-transparent hover:border-tea-300 dark:hover:border-tea-600'}`}
                    onClick={() => renderPageToCanvas(i)}
                  >
                    <canvas 
                      ref={i === 0 ? canvasRef : null}
                      width={120} 
                      height={170}
                      className="w-full rounded border border-tea-200 dark:border-tea-700"
                    />
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); rotatePage(i); }} className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Rotate">
                        <FiRotateCw size={12} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); if(pages.length > 1) deletePage(i); }} className="btn-icon-sm text-muga-600 hover:bg-muga-100" title="Delete">
                        <FiTrash2 size={12} />
                      </button>
                      {i > 0 && <button onClick={(e) => { e.stopPropagation(); movePage(i, i - 1); }} className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Move Up"><FiArrowUp size={12} /></button>}
                      {i < pages.length - 1 && <button onClick={(e) => { e.stopPropagation(); movePage(i, i + 1); }} className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Move Down"><FiArrowDown size={12} /></button>}
                    </div>
                    <div className="mt-1 text-center text-xs text-tea-600 dark:text-tea-400">
                      Page {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
                <h4 className="font-semibold text-tea-900 dark:text-tea-100">Preview - Page {currentFileIndex + 1} / {pages.length}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => rotatePage(currentFileIndex)} className="btn-icon" title="Rotate">
                    <FiRotateCw size={18} />
                  </button>
                  <button onClick={() => pages.length > 1 && deletePage(currentFileIndex)} className="btn-icon text-muga-600" title="Delete Page">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-tea-50 dark:bg-tea-800/50 flex items-center justify-center">
                <canvas ref={canvasRef} className="shadow-lg bg-white dark:bg-tea-900 max-w-full max-h-full" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Merge Dialog */}
      {showMergeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-tea-900 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiCopy size={22} /> Merge PDFs
            </h3>
            <p className="text-tea-600 dark:text-tea-400 text-sm mb-4">Select 2 or more PDFs to merge into one file</p>
            <input ref={mergeInputRef} type="file" accept=".pdf" multiple onChange={handleMergeFileSelect} className="hidden" />
            <button onClick={() => mergeInputRef.current?.click()} className="w-full border-2 border-dashed border-tea-200 dark:border-tea-700 rounded-xl p-6 text-center mb-4 hover:border-tea-400">
              <FiFilePlus size={32} className="mx-auto text-tea-400 mb-2" />
              <p className="text-tea-600 dark:text-tea-400">Click to add PDFs to merge</p>
            </button>
            {mergeFiles.length > 0 && (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {mergeFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-tea-50 dark:bg-tea-800 rounded-lg">
                    <span className="text-sm truncate">{f.name}</span>
                    <button onClick={() => removeMergeFile(i)} className="text-muga-600 hover:text-muga-700">
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowMergeDialog(false); setMergeFiles([]); }} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleMergeFiles} disabled={mergeFiles.length < 2 || isLoading} className="flex-1 btn-primary">
                {isLoading ? 'Merging...' : 'Merge & Download'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FiFilePlus, title: 'Merge PDFs', desc: 'Combine multiple PDFs into one' },
          { icon: FiRotateCw, title: 'Rotate Pages', desc: 'Rotate any page 90° increments' },
          { icon: FiTrash2, title: 'Delete Pages', desc: 'Remove unwanted pages' },
          { icon: FiArrowUp, title: 'Reorder Pages', desc: 'Drag-drop to reorder pages' },
        ].map((feat, i) => (
          <div key={i} className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-5 text-center group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${feat.color || 'bg-tea-100 dark:bg-tea-800 text-tea-600 dark:text-tea-400'} group-hover:scale-110 transition-transform`}>
              <feat.icon size={24} className="text-tea-600 dark:text-tea-400" />
            </div>
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">{feat.title}</h4>
            <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PDFEditor