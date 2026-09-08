import React, { useState } from 'react'
import { FiFile, FiDownload, FiEdit, FiSave, FiCheckCircle, FiAlertTriangle, FiInfo, FiHelpCircle, FiPlus, FiTrash2, FiEye, FiEyeOff, FiCopy, FiMail, FiLock, FiUser, FiCalendar, FiMapPin, FiPhone, FiCreditCard, FiHash, FiList, FiGrid, FiCheckSquare, FiSquare, FiCircle, FiMinusSquare, FiMousePointer, FiPenTool, FiType, FiImage, FiLink, FiAnchor, FiFileText } from 'react-icons/fi'

const FORM_FIELDS = [
  { type: 'text', label: 'Text Field', icon: FiType, description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: FiFileText, description: 'Multi-line text input' },
  { type: 'checkbox', label: 'Checkbox', icon: FiCheckSquare, description: 'Single checkbox' },
  { type: 'radio', label: 'Radio Button', icon: FiCircle, description: 'Single choice from group' },
  { type: 'dropdown', label: 'Dropdown', icon: FiList, description: 'Select from list' },
  { type: 'date', label: 'Date Picker', icon: FiCalendar, description: 'Date selection' },
  { type: 'email', label: 'Email', icon: FiMail, description: 'Email validation' },
  { type: 'password', label: 'Password', icon: FiLock, description: 'Masked input' },
  { type: 'number', label: 'Number', icon: FiHash, description: 'Numeric input' },
  { type: 'signature', label: 'Signature', icon: FiPenTool, description: 'Digital signature field' },
  { type: 'image', label: 'Image', icon: FiImage, description: 'Image upload field' },
  { type: 'button', label: 'Button', icon: FiMousePointer, description: 'Action button' },
  { type: 'link', label: 'Link', icon: FiLink, description: 'Hyperlink field' },
  { type: 'hidden', label: 'Hidden Field', icon: FiEyeOff, description: 'Hidden data field' }
]

export default function FormsTools() {
  const [activeTab, setActiveTab] = useState('fill')
  const [formFields, setFormFields] = useState([])
  const [fieldValues, setFieldValues] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedField, setSelectedField] = useState(null)

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      name: `field_${Date.now()}`,
      label: '',
      required: false,
      readonly: false,
      value: ''
    }
    setFormFields(prev => [...prev, newField])
    setFieldValues(prev => ({...prev, [newField.id]: ''}))
  }

  const updateField = (id, updates) => {
    setFormFields(prev => prev.map(f => f.id === id ? {...f, ...updates} : f))
  }

  const removeField = (id) => {
    setFormFields(prev => prev.filter(f => f.id !== id))
    setFieldValues(prev => {
      const next = {...fieldValues}
      delete next[id]
      return next
    })
  }

  const handleFill = async () => {
    if (!formFields.length) return
    setIsProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      setResult({ filled: true, fields: formFields.length })
    } catch (err) {
      alert('Fill failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFlatten = async () => {
    // Flatten form fields
    alert('Flatten form - implement pdf-lib form flattening')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'fill', label: 'Fill Form', icon: FiEdit, desc: 'Fill form fields' },
            { id: 'create', label: 'Create Form', icon: FiPlus, desc: 'Add form fields' },
            { id: 'flatten', label: 'Flatten', icon: FiFile, desc: 'Flatten fields to content' },
            { id: 'extract', label: 'Extract Data', icon: FiDownload, desc: 'Export form data' }
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

      {activeTab === 'fill' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiEdit size={20} className="text-tea-600" /> Fill Form Fields
            </h3>
            
            {formFields.length === 0 ? (
              <div className="text-center py-12">
                <FiEdit size={48} className="mx-auto text-tea-300 dark:text-tea-600 mb-4" />
                <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">No form fields detected</h4>
                <p className="text-tea-600 dark:text-tea-400 mb-4">This PDF doesn't have fillable form fields, or they weren't detected.</p>
                <button onClick={() => setActiveTab('create')} className="btn-primary">
                  <FiPlus size={18} className="mr-2" /> Create Form Fields
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formFields.map(field => (
                  <div key={field.id} className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="px-2 py-1 bg-tea-100 dark:bg-tea-800 rounded text-xs font-medium text-tea-700 dark:text-tea-300">
                        {field.type.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <label className="block text-sm font-medium text-tea-700 dark:text-tea-300 truncate">{field.label || field.name}</label>
                        <input
                          type={field.type === 'checkbox' ? 'checkbox' : field.type === 'radio' ? 'radio' : 'text'}
                          value={fieldValues[field.id] || ''}
                          onChange={(e) => setFieldValues(prev => ({...prev, [field.id]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}))}
                          className="w-full md:w-64 px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm"
                          disabled={field.readonly}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs text-tea-600 cursor-pointer">
                        <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, {required: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                        Required
                      </label>
                      <label className="flex items-center gap-1 text-xs text-tea-600 cursor-pointer">
                        <input type="checkbox" checked={field.readonly} onChange={(e) => updateField(field.id, {readonly: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                        Read-only
                      </label>
                      <button onClick={() => removeField(field.id)} className="text-muga-600 hover:text-muga-700 p-1" title="Remove">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4 border-t border-tea-100 dark:border-tea-800">
                  <button onClick={handleFill} disabled={isProcessing || !formFields.length} className="btn-primary flex-1">
                    <FiSave size={18} className="mr-2" /> Fill & Download
                  </button>
                  <button onClick={handleFlatten} className="btn-outline">
                    <FiFile size={18} className="mr-1" /> Flatten
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiPlus size={20} className="text-tea-600" /> Create Form Fields
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {FORM_FIELDS.map(field => (
                <button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="p-4 rounded-xl border-2 text-left transition-colors h-full ${
                    formFields.some(f => f.type === field.type) ? 'border-tea-300 dark:border-tea-600 bg-tea-50 dark:bg-tea-800/50' : 'border-tea-200 dark:border-tea-700 hover:border-tea-400'
                  }"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${field.type === 'text' ? 'bg-blue-100 text-blue-600' : field.type === 'checkbox' ? 'bg-green-100 text-green-600' : field.type === 'radio' ? 'bg-purple-100 text-purple-600' : field.type === 'dropdown' ? 'bg-orange-100 text-orange-600' : field.type === 'date' ? 'bg-pink-100 text-pink-600' : 'bg-tea-100 text-tea-600'}`}>
                    <field.icon size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-tea-900 dark:text-tea-100 mb-1">{field.label}</h4>
                  <p className="text-xs text-tea-600 dark:text-tea-400">{field.description}</p>
                </button>
              )}
            </div>
            
            {formFields.length > 0 && (
              <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4">
                <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-3">Added Fields ({formFields.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {formFields.map(f => (
                    <span key={f.id} className="px-2 py-1 bg-tea-100 dark:bg-tea-800 rounded text-xs text-tea-700 dark:text-tea-300 flex items-center gap-1">
                      {f.type === 'checkbox' && <FiCheckSquare size={10} />}
                      {f.type === 'radio' && <FiCircle size={10} />}
                      {f.type === 'text' && <FiType size={10} />}
                      {f.type === 'dropdown' && <FiList size={10} />}
                      {f.type === 'date' && <FiCalendar size={10} />}
                      {f.type === 'signature' && <FiPenTool size={10} />}
                      {f.label || f.name}
                      <button onClick={() => removeField(f.id)} className="ml-1 text-muga-600 hover:text-muga-700"><FiX size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="btn-primary flex-1" onClick={() => { /* save form template */ }}>
                    <FiSave size={18} className="mr-2" /> Save as Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'flatten' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiFile size={20} className="text-tea-600" /> Flatten Form Fields
            </h3>
            <p className="text-tea-600 dark:text-tea-400 mb-4">Flattening converts form fields and annotations into static page content. They become non-editable but visible in all PDF viewers.</p>
            
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                <span className="text-sm text-tea-700">Flatten form fields (text, checkboxes, dropdowns)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                <span className="text-sm text-tea-700">Flatten annotations & comments</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                <span className="text-tea-700">Flatten digital signatures</span>
              </label>
            </div>
            
            <button onClick={handleFlatten} className="btn-primary w-full">
              <FiFile size={18} className="mr-2" /> Flatten & Download
            </button>
          </div>
        </div>
      )}

      {activeTab === 'extract' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiDownload size={20} className="text-tea-600" /> Extract Form Data
            </h3>
            <p className="text-tea-600 dark:text-tea-400 mb-4">Extract all form field values from the PDF as JSON, CSV, or XML</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Output Format</label>
                <select className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800">
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="xlsx">Excel</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="includeEmpty" className="w-4 h-4 mt-1 rounded border-tea-300 text-tea-600" />
                <label htmlFor="includeEmpty" className="text-sm text-tea-700">Include empty fields</label>
              </div>
            </div>
            
            <button className="btn-primary w-full">
              <FiDownload size={18} className="mr-2" /> Extract & Download Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormsTools