import React, { useState, useRef, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

const SAMPLE_QUESTIONS = [
  'অনুপম কেমন চরিত্রের মানুষ?',
  'কল্যাণীর বাবার নাম কী?',
  'গল্পে যৌতুক নিয়ে কী ঘটেছিল?',
  'Who is the author of Oporichita?',
]

const detectLanguage = (text) => (/[ঀ-৿]/.test(text) ? 'bn' : 'en')

const formatTime = (date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

const StatusDot = ({ status }) => {
  const styles = {
    connected: { dot: 'bg-emerald-500', label: 'Online' },
    disconnected: { dot: 'bg-clay', label: 'Offline' },
    checking: { dot: 'bg-amber-400 animate-pulse', label: 'Connecting' },
  }[status]

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  )
}

const Message = ({ message }) => {
  const isUser = message.type === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed font-bengali whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-navy-700 text-white rounded-br-md'
              : message.isError
                ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-md'
                : 'bg-white text-ink border border-ink/10 rounded-bl-md shadow-sm'
          }`}
        >
          {message.content}

          {!isUser && message.metadata && !message.isError && (
            <div className="mt-3 pt-2 border-t border-ink/10 text-xs text-ink-faint flex flex-wrap gap-x-3 gap-y-1">
              <span>{message.metadata.num_sources} sources</span>
              <span>{message.metadata.detected_language === 'bn' ? 'বাংলা' : 'English'}</span>
              {message.confidence_score != null && (
                <span>confidence {(message.confidence_score * 100).toFixed(0)}%</span>
              )}
            </div>
          )}

          {!isUser && message.context_chunks?.length > 0 && !message.isError && (
            <details className="mt-2 text-xs text-ink-soft">
              <summary className="cursor-pointer select-none text-navy-600 hover:underline">
                Show retrieved passages
              </summary>
              <ol className="mt-2 space-y-2 list-decimal pl-4">
                {message.context_chunks.map((chunk, i) => (
                  <li key={i} className="font-bengali leading-relaxed">
                    {chunk.length > 280 ? `${chunk.slice(0, 280)}…` : chunk}
                  </li>
                ))}
              </ol>
            </details>
          )}
        </div>
        <span className="text-[11px] text-ink-faint mt-1 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Check backend connection on mount and every 30 seconds
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        })
        setConnectionStatus(response.ok ? 'connected' : 'disconnected')
      } catch (error) {
        console.error('Connection check failed:', error)
        setConnectionStatus('disconnected')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendQuestion = async (text) => {
    const question = text.trim()
    if (!question || isLoading) return

    setMessages((prev) => [...prev, { type: 'user', content: question, timestamp: new Date() }])
    setInput('')
    setIsLoading(true)

    try {
      const healthCheck = await fetch(`${API_URL}/health`).catch(() => null)
      if (!healthCheck) {
        throw new Error('Backend server is not running. Please start the backend server on port 8000.')
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, language: detectLanguage(question) }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: data.answer,
          context_chunks: data.context_chunks,
          confidence_score: data.confidence_score,
          metadata: data.metadata,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Error:', error)
      let errorContent = 'দুঃখিত, একটি ত্রুটি হয়েছে। Sorry, something went wrong.'

      if (error.message.includes('Backend server is not running') || error.message.includes('Failed to fetch')) {
        errorContent +=
          '\n\nThe backend is not reachable on port 8000. Start it with ./start-rag.sh, or:\n' +
          'cd backend && python -m uvicorn main:app --reload --port 8000'
      }

      errorContent += `\n\nDetails: ${error.message}`

      setMessages((prev) => [
        ...prev,
        { type: 'assistant', content: errorContent, timestamp: new Date(), isError: true },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendQuestion(input)
  }

  return (
    <div className="h-full max-w-3xl mx-auto flex flex-col px-4">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <p className="font-serif text-3xl text-navy-700 mb-2">প্রশ্ন করুন</p>
            <p className="text-ink-soft max-w-md mb-8 text-sm leading-relaxed">
              Ask anything about the story in Bengali or English. Answers come from the text of
              “অপরিচিতা”, with the passages they were drawn from.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuestion(q)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 rounded-xl bg-white border border-ink/10 text-sm font-bengali text-ink hover:border-navy-600 hover:bg-navy-50 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => <Message key={index} message={message} />)
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-ink/10 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-navy-600/60 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pb-5 pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-white border border-ink/15 rounded-2xl p-2 shadow-sm focus-within:border-navy-600 focus-within:ring-2 focus-within:ring-navy-100"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন / Type your question…"
            className="flex-1 px-3 py-2 bg-transparent text-[15px] font-bengali placeholder:text-ink-faint focus:outline-none"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-navy-700 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Thinking…' : 'Ask'}
          </button>
        </form>
        <div className="flex justify-between items-center mt-2 px-1">
          <StatusDot status={connectionStatus} />
          <span className="hidden sm:inline text-[11px] text-ink-faint">Answers are generated from the story and may be imperfect.</span>
        </div>
      </div>
    </div>
  )
}

export default Chat
