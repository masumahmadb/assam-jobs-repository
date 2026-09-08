import React, { createContext, useContext, useReducer, useCallback } from 'react'

const PDFEditorContext = createContext(null)

const initialState = {
  files: [],
  currentFileIndex: 0,
  pages: [],
  pdfDoc: null,
  isLoading: false,
  previewScale: 1,
  activeCategory: 'organize',
  activeTool: null,
  showMergeDialog: false,
  mergeFiles: [],
  history: [],
  historyIndex: -1,
  error: null,
  progress: 0
}

function pdfEditorReducer(state, action) {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload }
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] }
    case 'REMOVE_FILE':
      return { 
        ...state, 
        files: state.files.filter((_, i) => i !== action.payload),
        currentFileIndex: Math.max(0, state.currentFileIndex - 1)
      }
    case 'SET_CURRENT_FILE':
      return { 
        ...state, 
        currentFileIndex: action.payload,
        pdfDoc: action.payload < state.files.length ? state.files[action.payload].doc : null,
        pages: action.payload < state.files.length ? state.files[action.payload].pages : [],
        history: [],
        historyIndex: -1
      }
    case 'SET_PAGES':
      return { ...state, pages: action.payload }
    case 'SET_PDF_DOC':
      return { ...state, pdfDoc: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_PREVIEW_SCALE':
      return { ...state, previewScale: action.payload }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload, activeTool: null }
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload }
    case 'SET_MERGE_DIALOG':
      return { ...state, showMergeDialog: action.payload }
    case 'SET_MERGE_FILES':
      return { ...state, mergeFiles: action.payload }
    case 'ADD_MERGE_FILE':
      return { ...state, mergeFiles: [...state.mergeFiles, action.payload] }
    case 'REMOVE_MERGE_FILE':
      return { ...state, mergeFiles: state.mergeFiles.filter((_, i) => i !== action.payload) }
    case 'CLEAR_MERGE_FILES':
      return { ...state, mergeFiles: [] }
    case 'SET_HISTORY':
      return { 
        ...state, 
        history: action.payload.history,
        historyIndex: action.payload.index
      }
    case 'PUSH_HISTORY': {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(action.payload)
      return { 
        ...state, 
        history: newHistory.slice(-50), // Limit history
        historyIndex: newHistory.length - 1
      }
    }
    case 'UNDO':
      if (state.historyIndex > 0) {
        return { ...state, historyIndex: state.historyIndex - 1 }
      }
      return state
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return { ...state, historyIndex: state.historyIndex + 1 }
      }
      return state
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function PDFEditorProvider({ children }) {
  const [state, dispatch] = useReducer(pdfEditorReducer, initialState)

  const actions = {
    setFiles: (files) => dispatch({ type: 'SET_FILES', payload: files }),
    addFile: (file) => dispatch({ type: 'ADD_FILE', payload: file }),
    removeFile: (index) => dispatch({ type: 'REMOVE_FILE', payload: index }),
    setCurrentFile: (index) => dispatch({ type: 'SET_CURRENT_FILE', payload: index }),
    setPages: (pages) => dispatch({ type: 'SET_PAGES', payload: pages }),
    setPdfDoc: (doc) => dispatch({ type: 'SET_PDF_DOC', payload: doc }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setPreviewScale: (scale) => dispatch({ type: 'SET_PREVIEW_SCALE', payload: scale }),
    setActiveCategory: (category) => dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category }),
    setActiveTool: (tool) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool }),
    setMergeDialog: (show) => dispatch({ type: 'SET_MERGE_DIALOG', payload: show }),
    setMergeFiles: (files) => dispatch({ type: 'SET_MERGE_FILES', payload: files }),
    addMergeFile: (file) => dispatch({ type: 'ADD_MERGE_FILE', payload: file }),
    removeMergeFile: (index) => dispatch({ type: 'REMOVE_MERGE_FILE', payload: index }),
    clearMergeFiles: () => dispatch({ type: 'CLEAR_MERGE_FILES' }),
    pushHistory: (state) => dispatch({ type: 'PUSH_HISTORY', payload: state }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    setProgress: (progress) => dispatch({ type: 'SET_PROGRESS', payload: progress }),
    reset: () => dispatch({ type: 'RESET' })
  }

  return (
    <PDFEditorContext.Provider value={{ state, actions }}>
      {children}
    </PDFEditorContext.Provider>
  )
}

export function usePDFEditor() {
  const context = useContext(PDFEditorContext)
  if (!context) {
    throw new Error('usePDFEditor must be used within PDFEditorProvider')
  }
  return context
}

export default PDFEditorContext