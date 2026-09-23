import React, { useState } from 'react'
import { FiDownload, FiType, FiAlignLeft, FiAlignCenter, FiAlignRight, FiCalendar, FiHash, FiPlus, FiMinus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlusCircle, FiMinusCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi'

export default function HeaderFooterTools() {
  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('Page {page} of {total}')
  const [options, setOptions] = useState({
    fontSize: 10,
    fontColor: '#666666',
    fontFamily: 'Helvetica',
    position: 'center',
    dateFormat: 'DD/MM/YYYY',
    pages: 'all',
    showPageNumbers: true,
    pageNumberFormat: '{page} of {total}',
    headerMargin: 30,
    footerMargin: 30
  })

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4">Header & Footer</h3>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
              <FiType size={18} className="text-blue-600" /> Header
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Header Text</label>
                <textarea value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Enter header text... Use {date}, {page}, {total}, {title}, {author}" rows={3} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 font-mono text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tea-700 mb-1">Alignment</label>
                  <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tea-700 mb-1">Margin from Top</label>
                  <input type="number" value={30} min="10" max="100" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
              <FiType size={18} className="text-green-600" /> Footer
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Footer Text</label>
                <textarea value="Page {page} of {total}" rows={2} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 font-mono text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tea-700 mb-1">Alignment</label>
                  <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tea-700 mb-1">Margin from Bottom</label>
                  <input type="number" value={30} min="10" max="100" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4">Options</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Font Size</label>
                <input type="number" value={10} min="6" max="24" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Font Color</label>
                <input type="color" value="#666666" className="w-full h-10 rounded border-0 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Font Family</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times-Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Date Format</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-2 border-t border-tea-100 dark:border-tea-800 pt-4">
              <input type="checkbox" id="showPageNumbers" defaultChecked className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="showPageNumbers" className="text-sm text-tea-700 mt-1">Show page numbers</label>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <input type="checkbox" id="differentFirstPage" className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="differentFirstPage" className="text-sm text-tea-700">Different first page</label>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <input type="checkbox" id="differentOddEven" className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
              <label htmlFor="differentOddEven" className="text-sm text-tea-700">Different odd/even pages</label>
            </div>
          </div>

          {/* Placeholders Help */}
          <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4">
            <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">Available Placeholders</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-tea-700 dark:text-tea-300">
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{page}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{total}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{date}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{title}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{author}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{filename}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{pagenumber}'}</code>
              <code className="bg-white dark:bg-tea-800 px-2 py-1 rounded">{'{totalpages}'}</code>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-tea-100 dark:border-tea-800">
          <button className="flex-1 btn-primary">
            <FiDownload size={18} className="mr-2" /> Apply & Download
          </button>
          <button className="btn-outline">
            <FiTrash2 size={18} className="mr-1" /> Clear
          </button>
        </div>
      </div>
    </div>
  )
}