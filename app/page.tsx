'tsx'
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
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

  return (
    <main className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 relative overflow-hidden ${isDark ? 'bg-[#0F1423] text-slate-100' : 'bg-[#EAE6DF] text-slate-900'}`}>
      
      {/* خلفية النجوم في الدارك مود */}
      {isDark && (
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
      )}

      {/* الهيدر العلوي */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex justify-between items-center relative z-10">
        
        {/* الجهة اليمنى: اسم الموقع وشعار الصورة المتغير */}
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-lg tracking-tight">
            تفريغ | MindSpace
          </span>
          <div className="w-20 h-20 relative flex items-center justify-center">
            <Image 
              src={isDark ? "/logo-dark-v1.jpg" : "/logo-light.jpg"}
              alt="MindSpace Logo" 
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* الجهة اليسرى: زر تبديل المظهر والشارة */}
        <div className="flex items-center gap-3">
          <div className={`text-xs font-medium px-4 py-2 rounded-full backdrop-blur-md border ${isDark ? 'bg-slate-900/85 border-slate-800 text-slate-300' : 'bg-[#DFDBD3] border-[#D3CEC5] text-slate-700'}`}>
            جلسات استشارية ذكية وآمنة
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border transition shadow-sm cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-[#DFDBD3] border-[#D3CEC5] text-amber-700'}`}
            title="تغيير المظهر"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

      </header>

      {/* المحتوى الرئيسي */}
      <section className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex-1 w-full flex items-center relative z-10">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* الجانب الأيمن: النصوص وزر الدفع بـ 15 ريال */}
          <div className="md:col-span-7 text-right">
            
            <h1 className={`text-4xl md:text-5xl font-extrabold leading-[1.2] mb-5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              مساحتك الخاصة للحديث<br />
              <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>والراحة النفسية</span>
            </h1>

            <p className={`text-sm md:text-base mb-8 leading-relaxed font-normal max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              استمع لأفكارك وتخلص من شحنات التوتر عبر جلسة تفريغ آمنة وسريعة مع معالج ذكاء اصطناعي مدرب بعناية.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-start">
              <Link
                href="/chat"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition duration-200 shadow-lg shadow-indigo-600/30 text-sm flex items-center justify-center gap-3"
              >
                <span>ابدأ جلستك الآن (15 دقيقة)</span>
              </Link>

              <span className={`font-bold text-sm px-4 py-3 rounded-2xl border ${isDark ? 'text-indigo-300 bg-indigo-950/60 border-indigo-800/50' : 'text-indigo-900 bg-[#DFDBD3]/60 border-[#D3CEC5]'}`}>
                15 ر.س فقط
              </span>
            </div>

          </div>

          {/* الجانب الأيسر: كرت الأمان والتنبيه الأصفر */}
          <div className={`md:col-span-5 p-6 rounded-3xl shadow-xl border transition-colors ${isDark ? 'bg-slate-800/70 shadow-black/40 border-slate-700' : 'bg-[#F4F1EC] shadow-slate-300/40 border-[#D3CEC5]'}`}>
            
            <div className={`flex items-center justify-between mb-5 pb-5 border-b ${isDark ? 'border-slate-700' : 'border-[#D3CEC5]'}`}>
              <div className="text-right">
                <h3 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>سرية تامة وأمان</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>محادثة مشفرة وخاصة بك وحدك</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${isDark ? 'bg-indigo-950/80 border-indigo-800/60 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-700'}`}>
                🛡️
              </div>
            </div>

            <div className={`p-4 rounded-2xl text-right border ${isDark ? 'bg-amber-950/30 border-amber-800/40 text-amber-200/80' : 'bg-[#FAF7F2] border-amber-300/60 text-amber-900'}`}>
              <div className={`flex items-center gap-1.5 mb-1.5 font-bold text-xs ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                <span>⚠️</span>
                <span>تنبيه هام: الخدمة لأغراض التفريغ وتطوير الذات وليست بديلاً عن العلاج الإكلينيكي المتخصص.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* الفوتر */}
      <footer className={`text-center py-6 text-xs border-t relative z-10 ${isDark ? 'text-slate-500 border-slate-900' : 'text-slate-600 border-[#D3CEC5]'}`}>
        جميع الحقوق محفوظة © 2026 تفريغ
      </footer>
    </main>
  );
}