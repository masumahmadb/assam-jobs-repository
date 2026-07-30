import React, { useEffect, useRef, useState } from 'react'
import { askAssistant } from '../../services/geminiAgent.js'
import { saveChatMessage, getChatHistory } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiSend } from 'react-icons/fi'

export default function AIAssistant() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (user) getChatHistory(user.uid).then(setMessages)
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input, language: lang }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)
    if (user) saveChatMessage(user.uid, userMsg)

    try {
      const { reply } = await askAssistant({
        message: userMsg.text,
        language: lang,
        history: messages.slice(-10)
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
            Ask about eligibility, syllabus, forms, or paste a notification to summarize — in English, অসমীয়া, हिन्दी, or বাংলা.
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

      <div className="p-3 border-t border-tea-100 bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 border border-tea-100 rounded-xl2 px-4 py-3"
        />
        <button onClick={handleSend} className="btn-primary px-4" aria-label="Send"><FiSend /></button>
      </div>
    </div>
  )
}
