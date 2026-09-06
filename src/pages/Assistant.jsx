import React, { useState, useRef, useEffect } from 'react'
import TopBar from '../components/common/TopBar.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Badge, Avatar, AvatarGroup, Tabs, TabsList, TabsTrigger, TabsContent, Accordion, AccordionItem, AccordionTrigger, AccordionContent, CardFooter } from '../components/ui/21st'
import { FiSend, FiMic, FiFileText, FiBookOpen, FiTarget, FiTrendingUp, FiZap, FiSparkles, FiMessageSquare, FiLoader, FiCopy, FiCheckCircle, FiArrowUpRight, FiBrain, FiMessageCircle, FiSettings, FiHistory } from 'react-icons/fi'
import SyllabusScraper from '../components/assistant/SyllabusScraper.jsx'
import AIAssistant from '../components/assistant/AIAssistant.jsx'

const quickPrompts = [
  { icon: FiBookOpen, label: 'Syllabus Finder', prompt: 'Find the syllabus for APSC Combined Competitive Exam 2026', category: 'Syllabus' },
  { icon: FiTarget, label: 'Job Match', prompt: 'Find government jobs matching my profile: B.Tech CSE, 2 years experience, Guwahati', category: 'Jobs' },
  { icon: FiBookOpen, label: 'Exam Prep', prompt: 'Create a 30-day study plan for APSC Prelims', category: 'Preparation' },
  { icon: FiMessageSquare, label: 'CV Review', prompt: 'Review my CV for a Software Developer position at AMTRON', category: 'Career' },
  { icon: FiZap, label: 'Mock Interview', prompt: 'Simulate an interview for Junior Engineer position at PWD', category: 'Interview' },
  { icon: FiSparkles, label: 'Career Guidance', prompt: 'What are the best government job options for B.Tech Civil graduates in Assam?', category: 'Guidance' },
]

const chatHistory = [
  {
    role: 'assistant',
    content: `Hello! 👋 I'm your AI Career Assistant for Assam Jobs Repository. I can help you with:

🎯 **Job Search** - Find matching government & private jobs
📚 **Syllabus Finder** - Get detailed syllabi for any exam
📝 **CV/Resume Help** - Review and improve your resume
📋 **Exam Prep** - Study plans, mock tests, strategies
🎯 **Career Guidance** - Personalized career advice
🤝 **Interview Prep** - Mock interviews & tips

How can I help you today?`,
    timestamp: new Date(),
  },
]

function Assistant() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState(chatHistory)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Based on your profile, here are some relevant government job opportunities in Assam...",
        "For the APSC syllabus, here's the detailed breakdown...",
        "Here's a personalized 30-day study plan for your exam preparation...",
        "Based on your profile, here are the top matching job opportunities...",
        "Let me help you improve your CV for that position...",
      ]
      const botResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse, timestamp: new Date() }])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt)
    handleSend({ preventDefault: () => {} })
  }

  const clearChat = () => {
    setMessages(chatHistory)
  }

  return (
    <>
      <TopBar title="AI Career Assistant" />
      <div className="max-w-4xl mx-auto px-4 pb-12 h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="mb-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100 flex items-center gap-2">
                <FiSparkles size={24} className="text-tea-600 dark:text-tea-400" />
                AI Career Assistant
              </h1>
              <p className="text-tea-600 dark:text-tea-400 text-sm mt-1">
                Your personal AI career coach for Assam government jobs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                <FiHistory size={16} className="mr-1" /> History
              </Button>
              <Button variant="outline" size="sm" onClick={clearChat}>
                <FiRefreshCw size={16} className="mr-1" /> New Chat
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4 animate-slide-up">
            {quickPrompts.map((prompt, i) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="whitespace-nowrap group"
                style={{animationDelay: `${i * 50}ms`}}
              >
                <prompt.icon size={14} className="mr-1" />
                {prompt.label}
              </Button>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="chat" onValueChange={setActiveTab} className="mb-4">
            <TabsList aria-label="Assistant modes">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <FiMessageSquare size={16} /> Chat
              </TabsTrigger>
              <TabsTrigger value="syllabus" className="flex items-center gap-1">
                <FiBookOpen size={16} /> Syllabus
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1">
                <FiZap size={16} /> Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2" ref={messagesEndRef}>
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 animate-slide-up ${message.role === 'user' ? 'flex-row-reverse' : ''}`} style={{animationDelay: `${index * 50}ms`}}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-tea-600 text-white' : 'bg-tea-100 dark:bg-tea-800 text-tea-600'}`}
                    >
                      {message.role === 'user' ? (
                        <FiUser size={16} />
                      ) : (
                        <FiSparkles size={16} className="text-tea-600" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl ${message.role === 'user' ? 'bg-tea-600 text-white rounded-tr-none' : 'bg-tea-100 dark:bg-tea-800 text-tea-900 dark:text-tea-100 rounded-tl-none'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-tea-500 dark:text-tea-400">
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {message.role === 'assistant' && (
                            <button className="p-1 rounded hover:bg-tea-200 dark:hover:bg-tea-700 transition-colors" title="Copy">
                              <FiCopy size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-tea-100 dark:bg-tea-800 flex items-center justify-center text-tea-600 dark:text-tea-400">
                      <FiSparkles size={18} />
                    </div>
                    <div className="bg-tea-100 dark:bg-tea-800 text-tea-900 dark:text-tea-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[75%]">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-tea-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-2 h-2 bg-tea-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-2 h-2 bg-tea-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-tea-100 dark:border-tea-700 pt-4 animate-slide-up">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                      placeholder="Ask me about jobs, syllabus, career advice..."
                      leftIcon={<FiSparkles size={18} className="text-tea-400" />}
                      className="pr-12"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                      <button className="p-2 rounded-xl text-tea-400 hover:text-tea-600 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors" aria-label="Attach file">
                        <FiFileText size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-tea-400 hover:text-tea-600 hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors" aria-label="Voice input">
                        <FiMic size={18} />
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    size="lg"
                    className="h-11"
                  >
                    <FiSend size={18} />
                  </Button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-tea-100 dark:border-tea-700">
                  <span className="text-xs text-tea-500 dark:text-tea-500 mr-2">Quick:</span>
                  {quickPrompts.slice(0, 4).map((prompt, i) => (
                    <button
                      key={prompt.label}
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      className="px-3 py-1.5 text-xs rounded-full bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 hover:bg-tea-200 dark:hover:bg-tea-700 transition-colors whitespace-nowrap"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="syllabus">
              <SyllabusScraper />
            </TabsContent>

            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: FiBookOpen, title: 'Syllabus Finder', desc: 'Find detailed syllabi for any exam', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
                  { icon: FiTarget, title: 'Job Matcher', desc: 'Find jobs matching your profile', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
                  { icon: FiZap, title: 'Mock Test', desc: 'Practice with timed mock tests', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
                  { icon: FiFileText, title: 'CV Analyzer', desc: 'Get AI-powered CV feedback', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
                  { icon: FiTrendingUp, title: 'Career Path', desc: 'Explore career progression paths', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
                  { icon: FiSettings, title: 'Interview Prep', desc: 'Practice interview questions', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
                ].map((tool, i) => (
                  <Button key={tool.title} variant="outline" className="h-28 flex flex-col items-start justify-center gap-2 p-4 text-left group" style={{animationDelay: `${i * 50}ms`}}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color} group-hover:scale-110 transition-transform`}>
                      <tool.icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-tea-900 dark:text-tea-100">{tool.title}</h4>
                      <p className="text-sm text-tea-600 dark:text-tea-400">{tool.desc}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Assistant