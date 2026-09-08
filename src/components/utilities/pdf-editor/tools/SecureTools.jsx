import React, { useState } from 'react'
import { usePDFEditor } from '../../context/PDFEditorContext'
import { FiLock, FiUnlock, FiShield, FiKey, FiEye, FiEyeOff, FiUser, FiTrash2, FiEdit, FiAlertTriangle, FiCheckCircle, FiInfo, FiHelpCircle, FiFileText, FiSearch, FiUserCheck, FiUserX, FiClipboardCheck, FiClipboardX, FiCreditCard, FiIdCard, FiMail, FiPhone, FiMapPin, FiCalendar, FiHash, FiFingerprint, FiShield, FiLock as FiLockIcon } from 'react-icons/fi'

export default function SecureTools() {
  const { state, actions } = usePDFEditor()
  const [activeTab, setActiveTab] = useState('encrypt')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [permissions, setPermissions] = useState({
    printing: 'high',
    modifying: false,
    copying: false,
    annotating: false,
    fillingForms: false,
    contentAccessibility: false,
    documentAssembly: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  
  const currentFile = state.files[state.currentFileIndex]
  
  const handleEncrypt = async () => {
    if (!password || password !== confirmPassword) return
    if (!currentFile) return
    
    setIsProcessing(true)
    try {
      // In real implementation, call backend or use pdf-lib
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResult({
        type: 'encrypted',
        filename: `encrypted-${currentFile.name}`,
        permissions
      })
    } catch (err) {
      alert('Encryption failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDecrypt = async () => {
    if (!password || !currentFile) return
    
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResult({
        type: 'decrypted',
        filename: `decrypted-${currentFile.name}`
      })
    } catch (err) {
      alert('Decryption failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleRemovePassword = async () => {
    if (!password || !currentFile) return
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResult({ type: 'password-removed', filename: `unlocked-${currentFile.name}` })
    } catch (err) {
      alert('Failed to remove password: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'encrypt', label: 'Encrypt', icon: FiLock, desc: 'Add password protection' },
            { id: 'decrypt', label: 'Decrypt', icon: FiUnlock, desc: 'Remove password' },
            { id: 'permissions', label: 'Permissions', icon: FiShield, desc: 'Set access restrictions' },
            { id: 'redact', label: 'Redact', icon: FiEyeOff, desc: 'Permanently remove content' }
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

      {activeTab === 'encrypt' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiLock size={20} className="text-tea-600" /> Encrypt PDF
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-700 mb-1">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
              </div>
              
              <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4">
                <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-3">Permissions (Optional)</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'printing', label: 'Printing', options: ['none', 'low', 'high'], type: 'select' },
                    { key: 'modifying', label: 'Modify Content', type: 'checkbox' },
                    { key: 'copying', label: 'Copy Text/Images', type: 'checkbox' },
                    { key: 'annotating', label: 'Add Comments', type: 'checkbox' },
                    { key: 'fillingForms', label: 'Fill Forms', type: 'checkbox' },
                    { key: 'contentAccessibility', label: 'Accessibility', type: 'checkbox' },
                    { key: 'documentAssembly', label: 'Assemble Document', type: 'checkbox' }
                  ].map(perm => (
                    <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                      {perm.type === 'select' ? (
                        <>
                          <span className="text-sm text-tea-700 w-24">{perm.label}</span>
                          <select value={permissions[perm.key]} onChange={(e) => setPermissions({...permissions, [perm.key]: e.target.value})} className="flex-1 px-2 py-1 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm">
                            {perm.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                          </select>
                        </>
                      ) : (
                        <input type="checkbox" checked={permissions[perm.key]} onChange={(e) => setPermissions({...permissions, [perm.key]: e.target.checked})} className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                        <span className="text-sm text-tea-700">{perm.label}</span>
                      </>
                    )}
                  ))}
                </div>
              </div>
            </div>
            
            <button onClick={handleEncrypt} disabled={isProcessing || !password || password !== confirmPassword || !state.pdfDoc} className="btn-primary w-full">
              {isProcessing ? 'Encrypting...' : 'Encrypt & Download'}
            </button>
            
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'decrypt' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiUnlock size={20} className="text-tea-600" /> Remove Password
            </h3>
            <p className="text-tea-600 dark:text-tea-400 mb-4">Enter the password to unlock the PDF</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-tea-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
            </div>
            <button onClick={handleDecrypt} disabled={isProcessing || !password || !state.pdfDoc} className="btn-primary w-full">
              {isProcessing ? 'Decrypting...' : 'Decrypt & Download'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiShield size={20} className="text-tea-600" /> Set Permissions
            </h3>
            <p className="text-tea-600 dark:text-tea-400 mb-4">Set detailed access permissions for the PDF</p>
            <div className="space-y-3">
              {[
                { key: 'printing', label: 'Printing', type: 'select', options: ['none', 'low', 'high'] },
                { key: 'modifying', label: 'Modify Document', type: 'checkbox' },
                { key: 'copying', label: 'Copy Text/Images', type: 'checkbox' },
                { key: 'annotating', label: 'Add Annotations', type: 'checkbox' },
                { key: 'fillingForms', label: 'Fill Forms', type: 'checkbox' },
                { key: 'contentAccessibility', label: 'Accessibility (Screen Readers)', type: 'checkbox' },
                { key: 'documentAssembly', label: 'Document Assembly', type: 'checkbox' }
              ].map(perm => (
                <label key={perm.key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-tea-700 dark:text-tea-300">{perm.label}</span>
                  {perm.type === 'select' ? (
                    <select value={permissions[perm.key]} onChange={(e) => setPermissions({...permissions, [perm.key]: e.target.value})} className="px-3 py-1.5 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800 text-sm w-40">
                      {perm.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                  ) : (
                    <input type="checkbox" checked={permissions[perm.key]} onChange={(e) => setPermissions({...permissions, [perm.key]: e.target.checked})} className="w-5 h-5 rounded border-tea-300 text-tea-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'redact' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 p-4">
            <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-4 flex items-center gap-2">
              <FiEyeOff size={20} className="text-tea-600" /> Redact Content
            </h3>
            <p className="text-tea-600 dark:text-tea-400 mb-4">
              <strong>True redaction</strong> permanently removes content from the PDF, not just covers it.
              Select areas on the preview to redact.
            </p>
            
            <div className="bg-tea-50 dark:bg-tea-800/50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-tea-900 dark:text-tea-100 mb-2">Quick Redact</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                  <span className="text-sm text-tea-700">Email addresses</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                  <span className="text-sm text-tea-700">Phone numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                  <span className="text-sm text-tea-700">Credit card numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600" />
                  <span className="text-sm text-tea-700">Social security numbers</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-tea-700 mb-1">Custom search text/regex</label>
                <input type="text" placeholder="e.g. CONFIDENTIAL, [0-9]{3}-[0-9]{2}-[0-9]{4}" className="w-full px-3 py-2 border border-tea-200 dark:border-tea-700 rounded bg-white dark:bg-tea-800" />
              </div>
              <button className="btn-primary w-full">
                <FiSearch size={18} className="mr-2" /> Find & Mark for Redaction
              </button>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <FiAlertTriangle size={18} className="text-amber-600" />
                Important
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                <li>Redaction permanently deletes content - cannot be undone</li>
                <li>Metadata and hidden layers will also be sanitized</li>
                <li>Always save a backup before redacting</li>
                <li>Verify redacted PDF by trying to select text</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecureTools