import React, { useEffect, useRef, useState } from 'react'
import { askAssistant } from '../../services/geminiAgent.js'
import { saveChatMessage, getChatHistory } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiSend, FiPlus, FiX } from 'react-icons/fi'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AIAssistant() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const [attachedPreview, setAttachedPreview] = useState(null)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) getChatHistory(user.uid).then(setMessages)
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      e.target.value = ''
      return
    }
    setAttachedFile(file)
    setAttachedPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function removeAttachment() {
    setAttachedFile(null)
    setAttachedPreview(null)
  }

  async function handleSend() {
    if (!input.trim() && !attachedFile) return
    const userMsg = { role: 'user', text: input || '(Sent an image)', language: lang }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)
    if (user) saveChatMessage(user.uid, userMsg)

    let image = null
    if (attachedFile) {
      const base64 = await fileToBase64(attachedFile)
      image = { data: base64, mimeType: attachedFile.type }
    }
    removeAttachment()

    try {
      const { reply } = await askAssistant({
        message: userMsg.text,
        language: lang,
        history: messages.slice(-10),
        image
      })
      const botMsg = { role: 'assistant', text: reply, language: lang }
      setMessages((m) => [...m, botMsg])
      if (user) saveChatMessage(user.uid, botMsg)
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I could not respond right now. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-tea-900/50 text-sm mt-10">
            Ask about eligibility, syllabus, forms, or paste/attach a notification to summarize — in English, অসমীয়া, हिन्दी, or বাংলা.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] px-4 py-2 rounded-xl2 text-sm ${
            m.role === 'user' ? 'bg-tea-600 text-white ml-auto' : 'bg-white border border-tea-100'
          }`}>
            {m.text}
          </div>
        ))}
        {sending && <div className="bg-white border border-tea-100 rounded-xl2 px-4 py-2 text-sm w-fit">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-tea-100 bg-white">
        {attachedPreview && (
          <div className="px-3 pt-3 flex items-center gap-2">
            <div className="relative">
              <img src={attachedPreview} alt="Attached" className="w-16 h-16 object-cover rounded-lg border" />
              <button onClick={removeAttachment}
                className="absolute -top-2 -right-2 bg-gamosa-500 text-white rounded-full p-1" aria-label="Remove attachment">
                <FiX size={12} />
              </button>
            </div>
          </div>
        )}
        <div className="p-3 flex gap-2 items-center">
          <button onClick={() => fileInputRef.current?.click()} className="btn-outline p-3" aria-label="Attach file">
            <FiPlus />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or attach a photo..."
            className="flex-1 border border-tea-100 rounded-xl2 px-4 py-3"
          />
          <button onClick={handleSend} className="btn-primary px-4" aria-label="Send"><FiSend /></button>
        </div>
      </div>
    </div>
  )
}
