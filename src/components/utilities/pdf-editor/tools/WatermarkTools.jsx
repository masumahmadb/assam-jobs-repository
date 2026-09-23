import React, { useState } from 'react'
import { FiStamp, FiDownload, FiImage, FiType, FiRotateCw, FiAlignLeft, FiAlignCenter, FiAlignRight, FiHelpCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'

export default function WatermarkTools() {
  const [options, setOptions] = useState({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontSize: 48,
    color: '#FF0000',
    opacity: 0.3,
    rotation: -45,
    position: 'center',
    pages: 'all',
    imageFile: null
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4 mb-4">
        <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
          <FiStamp size={20} className="text-tea-600" /> Watermark Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-tea-700 mb-2">Type</label>
            <div className="flex gap-2">
              {['text', 'image'].map(type => (
                <label key={type} className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  options.type === type
                    ? 'border-tea-600 bg-tea-50 dark:bg-tea-800/50'
                    : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
                }`}>
                  <input type="radio" name="wmType" value={type} checked={options.type === type} onChange={(e) => setOptions({...options, type: e.target.value})} className="sr-only" />
                  <div className="flex flex-col items-center gap-2">
                    {type === 'text' ? <FiType size={24} /> : <FiImage size={24} />}
                    <span className="capitalize">{type}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {options.type === 'text' && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Watermark Text</label>
              <input type="text" value={options.text} onChange={(e) => setOptions({...options, text: e.target.value})} placeholder="CONFIDENTIAL" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Font Size</label>
                <input type="number" value={options.fontSize} onChange={(e) => setOptions({...options, fontSize: parseInt(e.target.value)})} min="12" max="200" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Opacity</label>
                <input type="range" value={options.opacity} onChange={(e) => setOptions({...options, opacity: parseFloat(e.target.value)})} min="0.1" max="1" step="0.1" className="w-full" />
                <div className="flex justify-between text-xs text-tea-500 mt-1">
                  <span>Transparent</span>
                  <span>{Math.round(options.opacity * 100)}%</span>
                  <span>Opaque</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Rotation</label>
                <input type="range" value={options.rotation} onChange={(e) => setOptions({...options, rotation: parseInt(e.target.value)})} min="-180" max="180" className="w-full" />
                <div className="flex justify-between text-xs text-tea-500 mt-1">
                  <span>-180°</span>
                  <span>{options.rotation}°</span>
                  <span>180°</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Color</label>
                <input type="color" value={options.color} onChange={(e) => setOptions({...options, color: e.target.value})} className="w-full h-10 rounded border-0 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Position</label>
                <select value={options.position} onChange={(e) => setOptions({...options, position: e.target.value})} className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="center">Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="middle-left">Middle Left</option>
                  <option value="middle-right">Middle Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="diagonal">Diagonal (Repeated)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Pages</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="all">All Pages</option>
                  <option value="first">First Page Only</option>
                  <option value="last">Last Page Only</option>
                  <option value="range">Custom Range</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {options.type === 'image' && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-tea-700 mb-1">Watermark Image</label>
              <input type="file" accept="image/*" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Opacity</label>
                <input type="range" value={options.opacity} onChange={(e) => setOptions({...options, opacity: parseFloat(e.target.value)})} min="0.1" max="1" step="0.1" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Scale</label>
                <input type="range" min="0.1" max="2" step="0.1" value={1} className="w-full" />
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
          <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">Presets</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'CONFIDENTIAL', text: 'CONFIDENTIAL', color: '#FF0000', rotation: -45 },
              { label: 'DRAFT', text: 'DRAFT', color: '#FFA500', rotation: -45 },
              { label: 'SAMPLE', text: 'SAMPLE', color: '#0000FF', rotation: -45 },
              { label: 'COPY', text: 'COPY', color: '#808080', rotation: -45 },
              { label: 'TOP SECRET', text: 'TOP SECRET', color: '#FF0000', rotation: 0 },
              { label: 'INTERNAL', text: 'INTERNAL USE ONLY', color: '#008000', rotation: -30 },
              { label: 'APPROVED', text: 'APPROVED', color: '#008000', rotation: 0 },
              { label: 'VOID', text: 'VOID', color: '#FF0000', rotation: 0 }
            ].map(preset => (
              <button key={preset.label} onClick={() => setOptions({...options, type: 'text', text: preset.text, color: preset.color, rotation: preset.rotation})} className="px-3 py-2 border border-tea-200 dark:border-tea-700 rounded-lg text-sm hover:bg-tea-50 dark:hover:bg-tea-800 transition-colors">
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-primary w-full">
        <FiDownload size={18} className="mr-2" /> Apply Watermark & Download
      </button>
    </div>
  )
}