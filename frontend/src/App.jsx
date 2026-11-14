import Chat from './components/Chat'

function App() {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-ink/10 bg-paper">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy-700 leading-tight">অপরিচিতা</h1>
            <p className="text-sm text-ink-soft">Rabindranath Tagore · Bilingual literature Q&amp;A</p>
          </div>
          <span className="hidden sm:inline text-xs text-ink-faint">RAG · Gemini · ChromaDB</span>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <Chat />
      </main>
    </div>
  )
}

export default App
