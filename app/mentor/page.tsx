'use client'

import { LayoutShell } from "@/components/layout-shell"
import { useState, useEffect } from "react"

export default function MentorPage() {
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<string | null>(null) // User ki pasand save karne ke liye

  // Language detect karne ka logic
  useEffect(() => {
    if (question.toLowerCase().includes('hinglish')) setLanguage('hinglish');
    if (question.toLowerCase().includes('english')) setLanguage('english');
  }, [question]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    // Naya message history mein add karein
    const newHistory = [...chatHistory, { role: "user", content: question }];
    
    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: question,
          history: chatHistory,
          language: language // Backend ko bhasha bhej rahe hain
        }),
      });

      const data = await res.json();

      if (data.answer) {
        setChatHistory([...newHistory, { role: "assistant", content: data.answer }]);
        setQuestion(""); // Input clear karein
      }
    } catch (error) {
      console.error("Connection error!");
    } finally {
      setLoading(false);
    }
  }

  const resetChat = () => {
    setChatHistory([]);
    setLanguage(null);
    setQuestion("");
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto space-y-6 p-4 pb-20">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
            AI Mentor 🤖
          </h2>
          <button 
            onClick={resetChat}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg transition-all"
          >
            Reset Chat 🔄
          </button>
        </div>

        {/* Chat History Area */}
        <div className="space-y-4 min-h-[300px]">
          {chatHistory.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p>Bhai, kuch pucho! Mentor ready hai. 🚀</p>
              <p className="text-xs mt-2 italic">Tip: Aap "Hinglish" ya "English" mein samjhne ko keh sakte hain.</p>
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                chat.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-blue-100 border border-slate-700 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{chat.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 animate-pulse">
                <p className="text-blue-400 text-sm italic">Thinking... 🤔</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area (Fixed at bottom) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl">
            <input
              className="flex-1 bg-transparent p-3 text-white outline-none"
              placeholder="Ask about logic, complexity, or language..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </LayoutShell>
  )
}