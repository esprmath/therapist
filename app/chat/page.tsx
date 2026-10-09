'tsx'
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'أهلاً بك في مساحتك الآمنة. خذ نفساً عميقاً، أنا هنا لأستمع إليك بكل اهتمام. ما الذي يدور في ذهنك اليوم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(900);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      setSessionEnded(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sessionEnded || loading) return;

    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'عذراً، حدث خطأ. حاول مرة أخرى.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'عذراً، واجهت مشكلة في الاتصال.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 relative overflow-hidden ${isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {isDark && (
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
      )}

      {/* الهيدر العلوي */}
      <header className={`backdrop-blur-md border-b px-6 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className={`text-sm transition flex items-center gap-1 ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            الرئيسية
          </Link>
          <div className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
            title="تغيير المظهر"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-slate-200 border-slate-300 text-indigo-600'}`}>
             🧠
          </div>
          <span className="font-bold text-sm">المعالج الذكي</span>
        </div>
        
        <div className={`px-4 py-2 rounded-xl font-mono text-sm font-bold flex items-center gap-2 border ${timeLeft < 180 ? (isDark ? 'bg-red-950/50 border-red-800 text-red-400 animate-pulse' : 'bg-red-50 border-red-200 text-red-600 animate-pulse') : (isDark ? 'bg-indigo-950/60 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600')}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            الوقت المتبقي: {formatTime(timeLeft)}
        </div>
      </header>

      {/* صندوق الرسائل */}
      <div className="max-w-4xl mx-auto w-full flex-1 p-6 md:p-8 overflow-y-auto space-y-6 relative z-10">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
                 <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${isDark ? 'bg-indigo-950 border-indigo-800/60 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    🧠
                 </div>
            )}
            
            <div
              className={`max-w-[80%] md:max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none font-medium shadow-indigo-600/20'
                  : isDark
                    ? 'bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-800 rounded-bl-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>

             {msg.role === 'user' && (
                 <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                 </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-start gap-3">
             <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-indigo-950 border-indigo-800/60 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>🧠</div>
            <div className={`p-5 rounded-3xl text-xs border animate-pulse rounded-bl-none ${isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-400 border-slate-100'}`}>
              جاري الاستماع والتفكير...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* صندوق الإدخال */}
      <div className={`backdrop-blur-md border-t p-4 md:p-5 sticky bottom-0 z-10 shadow-2xl ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        {sessionEnded ? (
          <div className="max-w-xl mx-auto text-center py-3">
            <p className={`font-bold mb-3 text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>انتهت جلستك الحالية.</p>
            <Link
              href="/"
              className={`inline-block text-white font-medium px-8 py-3 rounded-2xl transition shadow-lg text-lg ${isDark ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              العودة للرئيسية لبدء جلسة جديدة
            </Link>
          </div>
        ) : (
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب ما يدور في بالك بحرية وتام الأمان..."
              className={`flex-1 border rounded-2xl px-6 py-4 text-sm font-medium transition focus:outline-none focus:ring-2 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500' 
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-400 focus:border-indigo-400'
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className={`text-white p-4 rounded-2xl transition disabled:opacity-50 shadow-lg flex-shrink-0 cursor-pointer ${isDark ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}