import React, { useState, useRef, useEffect } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiSignature, FiPenTool, FiType, FiImage, FiFilePlus, FiDownload, FiSave, FiCheckCircle, FiAlertTriangle, FiInfo, FiHelpCircle, FiUser, FiPen, FiEdit, FiEye, FiEyeOff, FiTrash2, FiPlus, FiMinus, FiRotateCw, FiMove, FiMousePointer, FiZoomIn, FiZoomOut, FiPenTool as FiPenToolIcon, FiType as FiTypeIcon, FiImage as FiImageIcon } from 'react-icons/fi'

export default function SignTools() {
  const { state, actions } = usePDFEditor()
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [signMode, setSignMode] = useState('draw') // draw, type, upload
  const [signatureData, setSignatureData] = useState(null) // { type, data, ... }
  const [placedSignatures, setPlacedSignatures] = useState([])
  const [isPlacing, setIsPlacing] = useState(false)
  const [typedName, setTypedName] = useState('')
  const [selectedFont, setSelectedFont] = useState('cursive')
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState('#000000')
  const [drawWidth, setDrawWidth] = useState(2)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const FONTS = [
    { id: 'cursive', label: 'Cursive', css: 'cursive' },
    { id: 'handwriting', label: 'Handwriting', css: '"Brush Script MT", cursive' },
    { id: 'formal', label: 'Formal', css: 'Georgia, serif' },
    { id: 'modern', label: 'Modern', css: '"Helvetica Neue", sans-serif' }
  ]
  
  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')
  
  const handleCanvasMouseDown = (e) => {
    if (signMode !== 'draw') return
    setDrawing(true)
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.strokeStyle = drawColor
    ctx.lineWidth = drawWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }
  
  const handleCanvasMouseMove = (e) => {
    if (!drawing) return
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }
  
  const handleCanvasMouseUp = () => {
    if (drawing) {
      setDrawing(false)
      // Save signature as image data
      const dataUrl = canvas.toDataURL('image/png')
      setSignatureData({ type: 'draw', data: dataUrl })
    }
  }
  
  const handleTypeSubmit = () => {
    if (typedName.trim()) {
      setSignatureData({ type: 'type', text: typedName, font: selectedFont })
    }
  }
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignatureData({ type: 'upload', data: e.target.result, name: file.name })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }
  
  const placeSignature = (e) => {
    if (!signatureData || !isPlacing) return
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setPlacedSignatures(prev => [...prev, {
      id: Date.now(),
      ...signatureData,
      x,
      y,
      scale: 1,
      rotation: 0
    }])
    setIsPlacing(false)
    setSignatureData(null)
  }
  
  const removeSignature = (id) => {
    setPlacedSignatures(prev => prev.filter(s => s.id !== id))
  }
  
  const saveSignedPdf = async () => {
    if (placedSignatures.length === 0) return
    // Save with pdf-lib
    alert('Save signed PDF - implement pdf-lib save')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Signature Toolbar */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-1 border-r border-tea-200 dark:border-tea-700 pr-3">
          <h4 className="font-medium text-tea-900 dark:text-tea-100">Create Signature</h4>
        </div>
        
        <div className="flex items-center gap-1 border-r border-tea-200 dark:border-tea-700 pr-3">
          {[
            { id: 'draw', label: 'Draw', icon: FiPenToolIcon },
            { id: 'type', label: 'Type', icon: FiTypeIcon },
            { id: 'upload', label: 'Upload', icon: FiImageIcon }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setSignMode(mode.id)}
              className={`btn-icon transition-colors ${signMode === mode.id ? 'bg-tea-600 text-white' : 'text-tea-600 hover:bg-tea-100 dark:hover:bg-tea-800'}`}
              title={mode.label}
            >
              <mode.icon size={18} />
            </button>
          ))}
        </div>
        
        {/* Draw Options */}
        {signMode === 'draw' && (
          <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-3">
            <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <input type="range" value={drawWidth} onChange={(e) => setDrawWidth(parseInt(e.target.value))} min="1" max="8" className="w-24" />
            <span className="text-xs text-tea-500">{drawWidth}px</span>
          </div>
        )}
        
        {/* Type Options */}
        {signMode === 'type' && (
          <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-3">
            <input type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Type your name" className="px-3 py-1.5 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 w-48" />
            <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="px-2 py-1.5 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm">
              {FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
            <button onClick={handleTypeSubmit} className="btn-primary text-sm">Create</button>
          </div>
        )}
        
        {/* Upload Options */}
        {signMode === 'upload' && (
          <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 pr-3">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
            <button onClick={() => fileInputRef.current?.click()} className="btn-outline">
              <FiFilePlus size={18} className="mr-1" /> Choose Image
            </button>
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex">
        {/* Signature Canvas */}
        <div className="lg:w-80 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">Your Signature</h4>
            {signatureData && (
              <button onClick={() => setSignatureData(null)} className="btn-icon text-muga-600" title="Clear">
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
          <div className="flex-1 p-4 bg-tea-50 dark:bg-tea-800/50 flex items-center justify-center relative">
            {signMode === 'draw' && (
              <canvas
                ref={canvasRef}
                className="border-2 border-dashed border-tea-300 dark:border-tea-600 rounded-lg bg-white dark:bg-tea-900 cursor-crosshair"
                width={300}
                height={150}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
            )}
            {signMode === 'type' && typedName && (
              <div className="text-center" style={{ fontFamily: FONTS.find(f => f.id === selectedFont)?.css || 'cursive', fontSize: '48px', color: '#000' }}>
                {typedName}
              </div>
            )}
            {signMode === 'upload' && signatureData?.data && (
              <img src={signatureData.data} alt="Signature" className="max-w-full max-h-40" />
            )}
            {!signatureData && (
              <div className="text-center text-tea-400 py-8">
                <FiPenToolIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-tea-500">Create a signature to get started</p>
              </div>
            )}
          </div>
          {signatureData && (
            <div className="p-3 border-t border-tea-100 dark:border-tea-800 flex items-center justify-between">
              <span className="text-sm text-tea-600 dark:text-tea-400">Ready to place</span>
              <button onClick={() => setIsPlacing(true)} className="btn-primary text-sm">
                <FiMousePointer size={14} className="mr-1" /> Place on PDF
              </button>
            </div>
          )}
        </div>

        {/* PDF Preview & Placement */}
        <div className="flex-1 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">Place Signature</h4>
            <div className="flex items-center gap-2">
              <button className="btn-icon" title="Rotate"><FiRotateCw size={18} /></button>
              <button className="btn-icon" title="Zoom In"><FiZoomIn size={18} /></button>
              <button className="btn-icon" title="Zoom Out"><FiZoomOut size={18} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-tea-50 dark:bg-tea-800/50 flex items-center justify-center relative"
               onClick={placeSignature}
               className={isPlacing ? 'cursor-crosshair' : ''}>
            <canvas className="shadow-lg bg-white dark:bg-tea-900 max-w-full max-h-full" />
            
            {/* Placed Signatures Overlay */}
            {placedSignatures.map(sig => (
              <div
                key={sig.id}
                className="absolute"
                style={{
                  left: sig.x,
                  top: sig.y,
                  transform: `scale(${sig.scale}) rotate(${sig.rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {sig.type === 'draw' && <img src={sig.data} alt="Signature" style={{ width: 200 }} />}
                {sig.type === 'type' && <div style={{ fontFamily: sig.font || 'cursive', fontSize: '32px', color: '#000' }}>{sig.text}</div>}
                {sig.type === 'upload' && <img src={sig.data} alt="Signature" style={{ maxWidth: 200 }} />}
                <button onClick={(e) => { e.stopPropagation(); removeSignature(sig.id) }} className="absolute -top-2 -right-2 btn-icon-sm text-muga-600">
                  <FiX size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Placed Signatures List */}
      {placedSignatures.length > 0 && (
        <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mt-4">
          <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-3 flex items-center gap-2">
            <FiCheckCircle size={20} className="text-green-600" />
            Placed Signatures ({placedSignatures.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {placedSignatures.map((sig, i) => (
              <div key={sig.id} className="flex items-center gap-2 px-3 py-1.5 bg-tea-50 dark:bg-tea-800 rounded-lg text-sm">
                <span>Signature #{i + 1} ({sig.type})</span>
                <button onClick={() => removeSignature(sig.id)} className="text-muga-600 hover:text-muga-700">
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={saveSignedPdf} className="btn-primary flex-1">
              <FiSave size={18} className="mr-1" /> Save Signed PDF
            </button>
            <button className="btn-outline" onClick={() => setPlacedSignatures([])}>
              <FiTrash2 size={18} className="mr-1" /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* PAdES Digital Signature Info */}
      <div className="bg-tea-50 dark:bg-tea-800/50 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mt-4">
        <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
          <FiInfo size={18} /> e-Signature vs Digital Signature
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-tea-700 dark:text-tea-300">
          <div className="bg-white dark:bg-tea-800 rounded-xl p-4">
            <h5 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
              <FiPenTool size={16} className="text-tea-600" /> e-Signature (Above)
            </h5>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Visual representation only</li>
              <li>No cryptographic verification</li>
              <li>Good for internal/low-risk docs</li>
              <li>Created client-side</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-tea-800 rounded-xl p-4">
            <h5 className="font-medium text-tea-900 dark:text-tea-100 mb-2 flex items-center gap-2">
              <FiShield size={16} className="text-tea-600" /> PAdES Digital Signature
            </h5>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Cryptographically verified</li>
              <li>Certificate-based (PKI)</li>
              <li>Legal compliance (eIDAS)</li>
              <li>Requires certificate/token</li>
              <li>Use /api/sign endpoint</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}