import React, { useState, useRef } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiFilePlus, FiRotateCw, FiTrash2, FiArrowUp, FiArrowDown, FiDownload, FiSave, FiX, FiPlus, FiUpload, FiEye, FiEdit, FiPrinter, FiCopy, FiSearch, FiFileText, FiImage, FiLock, FiUnlock, FiScissors, FiStamp, FiPenTool, FiType, FiSignature, FiFile, FiArrowUpRight, FiFileMinus, FiLayers, FiGrid, FiShield, FiKey, FiEraser, FiWand2, FiCamera, FiRotateCcw, FiMove, FiZoomIn, FiZoomOut, FiUndo, FiRedo, FiFilePlus2, FiMinus, FiPlusSquare, FiMinimize2, FiMaximize2, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiFileMinus2, FiArrowLeftRight, FiArrowUpDown, FiCornerUpLeft, FiCornerUpRight, FiCornerDownLeft, FiCornerDownRight, FiCrop, FiResize, FiArrowUpLeft, FiArrowUpRight, FiArrowDownLeft, FiArrowDownRight } from 'react-icons/fi'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export default function OrganizeTools() {
  const { state, actions } = usePDFEditor()
  const mergeInputRef = useRef(null)
  const [splitMode, setSplitMode] = useState('range')
  const [splitRanges, setSplitRanges] = useState([{ start: 1, end: '' }])
  const [everyNPages, setEveryNPages] = useState(1)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [mergeFiles, setMergeFiles] = useState([])
  
  const currentFile = state.files[state.currentFileIndex]
  const pages = state.pages
  
  const handleMergeFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
    newFiles.forEach(f => setMergeFiles(prev => [...prev, { file: f, name: f.name, size: f.size }]))
    e.target.value = ''
  }
  
  const removeMergeFile = (index) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return
    // Merge logic would call backend or use pdf-lib
    alert('Merge functionality - implement with pdf-lib or backend')
  }
  
  const rotatePage = (pageIndex, degrees = 90) => {
    // Rotation handled by parent
  }
  
  const deletePage = (pageIndex) => {
    if (pages.length <= 1) return
    // Delete logic
  }
  
  const movePage = (fromIndex, toIndex) => {
    // Move logic
  }
  
  const addRange = () => setSplitRanges(prev => [...prev, { start: 1, end: '' }])
  const removeRange = (index) => setSplitRanges(prev => prev.filter((_, i) => i !== index))
  
  const handleSplit = async () => {
    // Split logic
    alert('Split functionality - implement with pdf-lib or backend')
  }
  
  const extractPages = () => {
    alert('Extract pages - select pages and extract')
  }
  
  const duplicatePage = (pageIndex) => {
    // Duplicate logic
  }
  
  const cropPage = (pageIndex) => {
    alert('Crop page - select crop area')
  }
  
  const resizePage = (pageIndex) => {
    alert('Resize page - enter dimensions')
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Organize Toolbar */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
          <h4 className="font-medium text-tea-900 dark:text-tea-100">Organize Tools</h4>
        </div>
        
        <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
          <button className="btn-icon" title="Merge PDFs" onClick={() => actions.setMergeDialog(true)}>
            <FiFilePlus2 size={18} />
          </button>
          <button className="btn-icon" title="Split PDF">
            <FiScissors size={18} />
          </button>
          <button className="btn-icon" title="Extract Pages">
            <FiFileMinus2 size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
          <button className="btn-icon" title="Rotate Selected" onClick={() => rotatePage(state.pages[0]?.index || 0)}>
            <FiRotateCw size={18} />
          </button>
          <button className="btn-icon" title="Delete Selected" onClick={() => deletePage(state.pages[0]?.index || 0)}>
            <FiTrash2 size={18} />
          </button>
          <button className="btn-icon" title="Move Up" onClick={() => movePage(state.pages[0]?.index || 0, -1)}>
            <FiArrowUp size={18} />
          </button>
          <button className="btn-icon" title="Move Down" onClick={() => movePage(state.pages[0]?.index || 0, 1)}>
            <FiArrowDown size={18} />
          </button>
          <button className="btn-icon" title="Duplicate" onClick={() => duplicatePage(state.pages[0]?.index || 0)}>
            <FiCopy size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-4">
          <button className="btn-icon" title="Crop" onClick={() => cropPage(state.pages[0]?.index || 0)}>
            <FiCrop size={18} />
          </button>
          <button className="btn-icon" title="Resize" onClick={() => resizePage(state.pages[0]?.index || 0)}>
            <FiResize size={18} />
          </button>
          <button className="btn-icon" title="Add Blank Page" onClick={() => { /* add blank */ }}>
            <FiFilePlus2 size={18} />
          </button>
        </div>
      </div>

      {/* Page Thumbnails + Preview */}
      <div className="flex-1 flex">
        {/* Thumbnails */}
        <div className="lg:w-64 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">Pages ({state.pages.length})</h4>
            <button className="btn-icon text-xs" title="Select All"><FiGrid size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {state.pages.map((page, i) => (
              <div 
                key={i} 
                className={`relative group p-2 rounded-xl border-2 transition-colors ${
                  i === 0 ? 'border-tea-500 bg-tea-50 dark:bg-tea-800/50' : 'border-transparent hover:border-tea-300 dark:hover:border-tea-600'
                }`}
              >
                <canvas width={120} height={170} className="w-full rounded border border-tea-200 dark:border-tea-700" />
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Rotate"><FiRotateCw size={12} /></button>
                  <button className="btn-icon-sm text-muga-600 hover:bg-muga-100" title="Delete"><FiTrash2 size={12} /></button>
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Move Up"><FiArrowUp size={12} /></button>
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Move Down"><FiArrowDown size={12} /></button>
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Duplicate"><FiCopy size={12} /></button>
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Crop"><FiCrop size={12} /></button>
                  <button className="btn-icon-sm text-tea-600 hover:bg-tea-100" title="Extract"><FiFileMinus2 size={12} /></button>
                </div>
                <div className="mt-1 text-center text-xs text-tea-600 dark:text-tea-400">
                  Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">Preview</h4>
            <div className="flex items-center gap-2">
              <button className="btn-icon" title="Rotate"><FiRotateCw size={18} /></button>
              <button className="btn-icon text-muga-600" title="Delete"><FiTrash2 size={18} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-tea-50 dark:bg-tea-800/50 flex items-center justify-center">
            <canvas className="shadow-lg bg-white dark:bg-tea-900 max-w-full max-h-full" />
          </div>
        </div>
      </div>

      {/* Split Dialog */}
      <div className="mt-4 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
        <h4 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiScissors size={20} /> Split PDF
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setSplitMode('range')} className={`px-3 py-1.5 rounded-lg text-sm ${splitMode === 'range' ? 'bg-tea-600 text-white' : 'bg-tea-100 dark:bg-tea-800 text-tea-700'}`}>By Range</button>
          <button onClick={() => setSplitMode('every-n')} className={`px-3 py-1.5 rounded-lg text-sm ${splitMode === 'every-n' ? 'bg-tea-600 text-white' : 'bg-tea-100 dark:bg-tea-800 text-tea-700'}`}>Every N Pages</button>
          <button onClick={() => setSplitMode('bookmarks')} className={`px-3 py-1.5 rounded-lg text-sm ${splitMode === 'bookmarks' ? 'bg-tea-600 text-white' : 'bg-tea-100 dark:bg-tea-800 text-tea-700'}`}>By Bookmarks</button>
        </div>
        
        {splitMode === 'range' && (
          <div className="space-y-2 mb-4">
            {splitRanges.map((range, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="number" value={range.start} onChange={(e) => setSplitRanges(prev => prev.map((r, i) => i === idx ? {...r, start: parseInt(e.target.value)} : r))} min="1" placeholder="Start" className="w-20 px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm" />
                <span className="text-tea-400">to</span>
                <input type="number" value={range.end} onChange={(e) => setSplitRanges(prev => prev.map((r, i) => i === idx ? {...r, end: parseInt(e.target.value)} : r))} min="1" placeholder="End" className="w-20 px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm" />
                <button onClick={() => removeRange(idx)} className="text-muga-600 hover:text-muga-700"><FiX size={16} /></button>
              </div>
            ))}
            <button onClick={addRange} className="text-sm text-tea-600 hover:text-tea-700 flex items-center gap-1"><FiPlus size={14} /> Add Range</button>
          </div>
        )}
        
        {splitMode === 'every-n' && (
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm text-tea-700">Pages per file:</label>
            <input type="number" value={everyNPages} onChange={(e) => setEveryNPages(parseInt(e.target.value))} min="1" max="100" className="w-20 px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm" />
          </div>
        )}
        
        <button onClick={handleSplit} className="btn-primary">Split & Download</button>
      </div>

      {/* Merge Dialog */}
      {showMergeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-tea-900 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiFilePlus2 size={22} /> Merge PDFs
            </h3>
            <input type="file" accept=".pdf" multiple onChange={handleMergeFileSelect} className="hidden" ref={mergeInputRef} />
            <button onClick={() => mergeInputRef.current?.click()} className="w-full border-2 border-dashed border-tea-200 dark:border-tea-700 rounded-xl p-6 text-center mb-4 hover:border-tea-400">
              <FiFilePlus size={32} className="mx-auto text-tea-400 mb-2" />
              <p className="text-tea-600 dark:text-tea-400">Click to add PDFs to merge</p>
            </button>
            {mergeFiles.length > 0 && (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {mergeFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-tea-50 dark:bg-tea-800 rounded-lg">
                    <span className="text-sm truncate">{f.name}</span>
                    <button onClick={() => removeMergeFile(i)} className="text-muga-600 hover:text-muga-700"><FiX size={16} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowMergeDialog(false); setMergeFiles([]); }} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleMerge} disabled={mergeFiles.length < 2} className="flex-1 btn-primary">Merge & Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}