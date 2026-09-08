import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiFilePlus, FiRotateCw, FiTrash2, FiArrowUp, FiArrowDown, FiDownload, FiSave, FiX, FiPlus, FiUpload, FiEye, FiEdit, FiPrinter, FiCopy, FiSearch, FiFileText, FiImage, FiLock, FiUnlock, FiScissors, FiCopy, FiStamp, FiPenTool, FiType, FiSignature, FiFile, FiArrowUpRight, FiFileMinus, FiLayers, FiGrid, FiShield, FiKey, FiEraser, FiWand2, FiCamera, FiRotateCcw, FiMove, FiZoomIn, FiZoomOut, FiUndo, FiRedo, FiAnchor, FiLink, FiHighlighter, FiImage as FiImageIcon, FiPen, FiEdit2, FiTrash, FiMousePointer, FiHelpCircle } from 'react-icons/fi'

const TOOL_ICONS = {
  select: FiMousePointer,
  text: FiType,
  image: FiImageIcon,
  draw: FiPenTool,
  highlight: FiHighlighter,
  underline: FiUnderline,
  strikethrough: FiStrikethrough,
  sticky: FiStickyNote,
  link: FiLink,
  anchor: FiAnchor
}

const TOOLBAR_TOOLS = [
  { id: 'select', label: 'Select', icon: FiMousePointer, shortcut: 'V' },
  { id: 'text', label: 'Add Text', icon: FiType, shortcut: 'T' },
  { id: 'image', label: 'Add Image', icon: FiImageIcon, shortcut: 'I' },
  { id: 'draw', label: 'Draw', icon: FiPenTool, shortcut: 'P' },
  { id: 'highlight', label: 'Highlight', icon: FiHighlighter, shortcut: 'H' },
  { id: 'underline', label: 'Underline', icon: FiUnderline, shortcut: 'U' },
  { id: 'strikethrough', label: 'Strikethrough', icon: FiStrikethrough, shortcut: 'S' },
  { id: 'sticky', label: 'Sticky Note', icon: FiStickyNote, shortcut: 'N' },
  { id: 'link', label: 'Add Link', icon: FiLink, shortcut: 'L' },
]

export default function EditTools() {
  const { state, actions } = usePDFEditor()
  const [activeTool, setActiveTool] = useState('select')
  const [textProps, setTextProps] = useState({
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Helvetica',
    bold: false,
    italic: false
  })
  const [drawColor, setDrawColor] = useState('#000000')
  const [drawWidth, setDrawWidth] = useState(2)
  const canvasRef = useRef(null)
  const [annotations, setAnnotations] = useState([])
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleCanvasClick = (e) => {
    if (activeTool === 'text') {
      // Add text annotation
      const rect = e.target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setAnnotations(prev => [...prev, {
        id: Date.now(),
        type: 'text',
        x, y,
        text: 'New text',
        ...textProps
      }])
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Tool Toolbar */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 border-r border-tea-200 dark:border-tea-700 pr-3">
          {TOOLBAR_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`btn-icon transition-colors ${activeTool === tool.id ? 'bg-tea-600 text-white' : 'text-tea-600 hover:bg-tea-100 dark:hover:bg-tea-800'}`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <tool.icon size={20} />
            </button>
          ))}
        </div>
        
        {/* Text Properties */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-3">
            <select value={textProps.fontFamily} onChange={(e) => setTextProps({...textProps, fontFamily: e.target.value})} className="text-xs px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
              <option value="Helvetica">Helvetica</option>
              <option value="Times-Roman">Times</option>
              <option value="Courier">Courier</option>
            </select>
            <input type="number" value={textProps.fontSize} onChange={(e) => setTextProps({...textProps, fontSize: parseInt(e.target.value)})} min="6" max="72" className="w-16 text-xs px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
            <input type="color" value={textProps.color} onChange={(e) => setTextProps({...textProps, color: e.target.value})} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <button onClick={() => setTextProps({...textProps, bold: !textProps.bold})} className={`btn-icon ${textProps.bold ? 'bg-tea-600 text-white' : ''}`} title="Bold"><strong>B</strong></button>
            <button onClick={() => setTextProps({...textProps, italic: !textProps.italic})} className={`btn-icon ${textProps.italic ? 'bg-tea-600 text-white' : ''}`} title="Italic"><em>I</em></button>
          </div>
        }}
        
        {/* Draw Properties */}
        {activeTool === 'draw' && (
          <div className="flex items-center gap-2 border-r border-tea-200 dark:border-tea-700 px-3">
            <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
            <input type="range" value={drawWidth} onChange={(e) => setDrawWidth(parseInt(e.target.value))} min="1" max="10" className="w-24" />
            <span className="text-xs text-tea-500">{drawWidth}px</span>
          </div>
        }}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-tea-100 dark:border-tea-800 flex items-center justify-between">
          <h4 className="font-medium text-tea-900 dark:text-tea-100">Page {state.pages[0]?.index + 1 || 1} - Edit Mode</h4>
          <div className="flex items-center gap-2 text-sm text-tea-500">
            <span>Tool: {TOOLBAR_TOOLS.find(t => t.id === activeTool)?.label || 'Select'}</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-tea-50 dark:bg-tea-800/50 flex items-center justify-center relative">
          <canvas
            ref={canvasRef}
            className="shadow-lg bg-white dark:bg-tea-900 max-w-full max-h-full cursor-crosshair"
            onClick={handleCanvasClick}
            style={{ touchAction: 'none' }}
          />
          {/* Annotation overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {annotations.map((ann) => (
              <div
                key={ann.id}
                style={{
                  left: ann.x,
                  top: ann.y,
                  position: 'absolute',
                  pointerEvents: 'auto'
                }}
              >
                {ann.type === 'text' && (
                  <div
                    className="bg-white border border-tea-300 rounded px-2 py-1"
                    style={{
                      fontSize: ann.fontSize,
                      color: ann.color,
                      fontFamily: ann.fontFamily,
                      fontWeight: ann.bold ? 'bold' : 'normal',
                      fontStyle: ann.italic ? 'italic' : 'normal'
                    }}
                    contentEditable
                    onBlur={(e) => setAnnotations(prev => prev.map(a => a.id === ann.id ? {...a, text: e.target.innerText} : a))}
                  >
                    {ann.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="btn-outline text-sm py-2" onClick={() => { /* undo */ }}>
          <FiUndo size={16} className="mr-1" /> Undo
        </button>
        <button className="btn-outline text-sm py-2" onClick={() => { /* redo */ }}>
          <FiRedo size={16} className="mr-1" /> Redo
        </button>
        <button className="btn-outline text-sm py-2" onClick={() => { /* clear annotations */ }}>
          <FiTrash2 size={16} className="mr-1" /> Clear All
        </button>
        <button className="btn-primary text-sm py-2" onClick={() => { /* save */ }}>
          <FiSave size={16} className="mr-1" /> Apply Changes
        </button>
      </div>
    </div>
  )
}

export default EditTools