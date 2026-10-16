'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [step, setStep] = useState<
    'question' | 'denied' | 'q1' | 'q2' | 'q3' | 'verified' | 'cheating' | 'gifts' | 'flowerColors' | 'prankWon' | 'won'
  >('question');

  const [textAnswer, setTextAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [countdown, setCountdown] = useState(3);

  // ==========================================
  // 💡 منطقة تخصيص أسماء الهدايا والورد
  // ==========================================
  
  const [validGifts, setValidGifts] = useState([
    { id: 1, text: 'عربية ل اريام', isCorrect: false },
    { id: 2, text: 'شاص ل امير', isCorrect: false },
    { id: 3, text: 'باقة ورد', isCorrect: true },
    { id: 4, text: 'جوال جديد', isCorrect: false },
    { id: 5, text: 'اعطيك طلبيتك اللي استلمتها', isCorrect: false },
    { id: 6, text: '10 ريال', isCorrect: false },
  ]);

  const [deniedGiftsList, setDeniedGiftsList] = useState([
    { id: 2, text: 'الهدية رقم 2' },
    { id: 3, text: 'الهدية رقم 3' },
    { id: 4, text: 'الهدية رقم 4' },
    { id: 5, text: 'الهدية رقم 5' },
    { id: 6, text: 'الهدية رقم 6' },
    { id: 7, text: 'الهدية رقم 7' },
  ]);

  const [flowerColors, setFlowerColors] = useState([
    { id: 1, name: 'ورد أحمر كلاسيكي' },
    { id: 2, name: 'ورد أبيض ناصع' },
    { id: 3, name: 'ورد زهري هادئ' },
    { id: 4, name: 'ورد أصفر مبهج' },
  ]);

  const [flowerEscapeCount, setFlowerEscapeCount] = useState(0);

  // ==========================================

  useEffect(() => {
    if (step === 'won' || step === 'prankWon') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const interval: any = setInterval(() => {
        if (Date.now() > animationEnd) {
          return clearInterval(interval);
        }
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D49B9F', '#E9C9CD', '#ffffff', '#ff4d4d', '#ffd700']
        });
      }, 250);
    }
  }, [step]);

  // مؤقت الانتقال التلقائي بعد شاشة "تم التحقق بنجاح"
  useEffect(() => {
    if (step === 'verified') {
      const timer = setTimeout(() => {
        setStep('gifts');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'cheating') {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAttemptsLeft(3);
            setTextAnswer('');
            setStep('question');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const [correctPositions, setCorrectPositions] = useState([
    { top: '30%', left: '35%' },
    { top: '30%', left: '65%' },
    { top: '65%', left: '35%' },
    { top: '65%', left: '65%' },
    { top: '48%', left: '22%' },
  ]);

  const [deniedPositions, setDeniedPositions] = useState([
    { top: '28%', left: '32%' },
    { top: '28%', left: '68%' },
    { top: '48%', left: '20%' },
    { top: '48%', left: '80%' },
    { top: '68%', left: '32%' },
    { top: '68%', left: '68%' },
  ]);

  const [flowerPositions, setFlowerPositions] = useState([
    { top: '32%', left: '30%' },
    { top: '32%', left: '70%' },
    { top: '65%', left: '30%' },
    { top: '65%', left: '70%' },
  ]);

  const moveSmartRandomly = (currentIndex: number, currentPositions: { top: string, left: string }[]) => {
    let newTop = 0;
    let newLeft = 0;
    let safe = false;
    let attempts = 0;

    while (!safe && attempts < 20) {
      newTop = Math.floor(Math.random() * 55) + 22;
      newLeft = Math.floor(Math.random() * 60) + 20;

      safe = currentPositions.every((pos, idx) => {
        if (idx === currentIndex) return true;
        const topVal = parseInt(pos.top);
        const leftVal = parseInt(pos.left);
        const distance = Math.hypot(newTop - topVal, newLeft - leftVal);
        return distance > 22;
      });

      attempts++;
    }

    return { top: `${newTop}%`, left: `${newLeft}%` };
  };

  const moveCorrectRandomly = (index: number) => {
    setCorrectPositions((prev) => {
      const newPos = [...prev];
      newPos[index] = moveSmartRandomly(index, prev);
      return newPos;
    });
  };

  const moveDeniedRandomly = (index: number) => {
    setDeniedPositions((prev) => {
      const newPos = [...prev];
      newPos[index] = moveSmartRandomly(index, prev);
      return newPos;
    });
  };

  const handleFlowerTouchOrClick = (index: number) => {
    if (flowerEscapeCount < 10) {
      setFlowerEscapeCount((prev) => prev + 1);
      setFlowerPositions((prev) => {
        const newPos = [...prev];
        newPos[index] = moveSmartRandomly(index, prev);
        return newPos;
      });
    } else {
      setStep('won');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = textAnswer.trim().toLowerCase().replace(/\s+/g, '');
    
    if (cleanInput.includes('بانكيك') || cleanInput.includes('pancake')) {
      setErrorMsg('');
      setTextAnswer('');
      setStep('verified');
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      
      if (remaining <= 0) {
        setStep('cheating');
      } else {
        setErrorMsg(`إجابة خاطئة. باقي لديك (${remaining}) محاولات`);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between font-sans px-5 py-6 relative overflow-hidden bg-[#F2E6E4] text-[#4A2026]">
      
      {/* الهيدر العلوي */}
      <header className="w-full max-w-md text-center py-4 relative z-10">
        <span className="text-[11px] tracking-wider uppercase font-medium text-[#4A2026] bg-[#E9C9CD]/60 px-3.5 py-1.5 rounded-full border border-[#D49B9F]">
          مفاجأة المبرمج غير 
        </span>
      </header>

      {/* محتوى الصفحة */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center text-center relative z-10 my-auto">
        
        {/* المرحلة الأولى: سؤال التحقق */}
        {step === 'question' && (
          <div className="w-full animate-fade-in py-4">
            <h1 className="text-xl sm:text-2xl font-semibold mb-8 leading-relaxed">
              هل أنتِ أم أريام؟
            </h1>
            
            <div className="flex flex-col gap-3.5 w-full">
              <button
                onClick={() => setStep('q1')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-6 rounded-2xl shadow-sm transition-all text-sm tracking-wide cursor-pointer border border-[#D49B9F]"
              >
                إي نعم
              </button>
              
              <button
                onClick={() => setStep('denied')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-6 rounded-2xl shadow-sm transition-all text-sm tracking-wide cursor-pointer border border-[#D49B9F]"
              >
                لا، لست أنا
              </button>
            </div>
          </div>
        )}

        {/* السؤال الأول: أفضل سيارة عند أمير */}
        {step === 'q1' && (
          <div className="w-full animate-fade-in py-4">
            <p className="text-xs text-[#4A2026]/70 font-semibold mb-2">تحقق إذا أنتِ أم أريام ولا لا</p>
            <h2 className="text-lg font-semibold mb-6 text-[#4A2026]">
              السؤال الأول: ما هي سيارة أمير المفضلة؟
            </h2>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setStep('question')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                الكامري
              </button>
              <button
                onClick={() => setStep('q2')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                الشاص
              </button>
              <button
                onClick={() => setStep('question')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                الشانجان
              </button>
            </div>
          </div>
        )}

        {/* السؤال الثاني: اسم بنتك */}
        {step === 'q2' && (
          <div className="w-full animate-fade-in py-4">
            <p className="text-xs text-[#4A2026]/70 font-semibold mb-2">تحقق إذا أنتِ أم أريام ولا لا</p>
            <h2 className="text-lg font-semibold mb-6 text-[#4A2026]">
              السؤال الثاني: وش اسم ابنتك؟
            </h2>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setStep('question')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                سارة
              </button>
              <button
                onClick={() => setStep('question')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                جمان
              </button>
              <button
                onClick={() => setStep('q3')}
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3.5 px-4 rounded-xl shadow-sm text-sm transition cursor-pointer border border-[#D49B9F]"
              >
                أريام
              </button>
            </div>
          </div>
        )}

        {/* السؤال الثالث */}
        {step === 'q3' && (
          <div className="w-full animate-fade-in py-4">
            <p className="text-xs text-[#4A2026]/70 font-semibold mb-2">تحقق إذا أنتِ أم أريام ولا لا</p>
            <h2 className="text-base font-semibold mb-2 text-[#4A2026] leading-relaxed">
              وش كان فطور أسامة وأمير يوم الأربعاء اخر يوم كنتم ساكنين عنده؟
            </h2>
            <p className="text-xs text-[#4A2026]/80 mb-4 font-light">المحاولات المتبقية: ({attemptsLeft})</p>
            
            <form onSubmit={handleTextSubmit} className="flex flex-col gap-3 w-full">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="اكتب الإجابة هنا..."
                className="w-full bg-white/90 text-[#4A2026] border border-[#D49B9F] rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#4A2026]"
              />
              {errorMsg && (
                <p className="text-xs text-red-700 font-medium animate-pulse">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] font-medium py-3 px-4 rounded-xl shadow-sm text-xs cursor-pointer transition border border-[#D49B9F]"
              >
                تأكيد الإجابة
              </button>
            </form>
          </div>
        )}

        {/* شاشة تم التحقق بنجاح */}
        {step === 'verified' && (
          <div className="w-full animate-fade-in py-8 flex flex-col items-center">
            <div className="text-3xl mb-3 animate-bounce">✨ 🌸 ✨</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#4A2026] mb-2">
              تم التحقق بنجاح
            </h2>
            <p className="text-sm font-medium text-[#4A2026]/80">
              اختاري هديتك..
            </p>
          </div>
        )}

        {/* شاشة العداد التنازلي "لا تحاول تغش" */}
        {step === 'cheating' && (
          <div className="w-full animate-fade-in py-8 bg-white/50 rounded-3xl border border-red-800/20 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-red-700">لا تحاول تغش</h2>
            <p className="text-xs text-[#4A2026] mb-6 font-light">انتهت المحاولات.. جاري إعادتك من البداية</p>
            <div className="text-5xl font-bold text-[#4A2026] animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* لو اختارت "لا" في البداية (مع زر المقلب في كلمة الهدية) */}
        {step === 'denied' && (
          <div className="w-full h-[440px] relative">
            <div className="mb-4 pt-1">
              <h2 className="text-lg font-semibold mb-1 text-[#4A2026]">
                اذا قدرت تختار {' '}
                <button 
                  onClick={() => setStep('prankWon')}
                  className="bg-transparent border-none p-0 m-0 text-inherit font-inherit no-underline cursor-pointer inline"
                >
                  الهدية
                </button>
                {' '} الصح مبروووك عليك
              </h2>
              <p className="text-xs text-[#4A2026]/80 font-light">
                حاول لا تيأس
              </p>
            </div>

            {deniedGiftsList.map((gift, idx) => (
              <div 
                key={gift.id}
                style={{ top: deniedPositions[idx].top, left: deniedPositions[idx].left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
              >
                <button
                  onTouchStart={() => moveDeniedRandomly(idx)}
                  onMouseEnter={() => moveDeniedRandomly(idx)}
                  onClick={() => moveDeniedRandomly(idx)}
                  className="bg-[#E9C9CD] text-[#4A2026] border border-[#D49B9F] font-medium py-3 px-4 rounded-xl shadow-sm text-xs whitespace-nowrap active:scale-95 cursor-pointer max-w-[150px] truncate"
                >
                  {gift.text}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* مرحلة الهدايا لأم أريام */}
        {step === 'gifts' && (
          <div className="w-full h-[440px] relative">
            <div className="mb-4 pt-1">
              <h2 className="text-lg font-semibold mb-1 text-[#4A2026]">أهلاً بكِ يا أم أريام</h2>
              <p className="text-xs text-[#4A2026]/80 font-light">
                اختاري هديتك المناسبة
              </p>
            </div>

            {validGifts.filter(g => g.isCorrect).map((correctGift) => (
              <div key={correctGift.id} className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => setStep('flowerColors')}
                  className="bg-[#E9C9CD] text-[#4A2026] border border-[#D49B9F] font-medium py-3 px-5 rounded-xl shadow-sm text-xs whitespace-nowrap active:scale-95 cursor-pointer max-w-[160px] truncate"
                >
                  {correctGift.text}
                </button>
              </div>
            ))}

            {validGifts.filter(g => !g.isCorrect).map((gift, idx) => (
              <div 
                key={gift.id}
                style={{ top: correctPositions[idx].top, left: correctPositions[idx].left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
              >
                <button
                  onTouchStart={() => moveCorrectRandomly(idx)}
                  onMouseEnter={() => moveCorrectRandomly(idx)}
                  onClick={() => moveCorrectRandomly(idx)}
                  className="bg-[#E9C9CD] text-[#4A2026] border border-[#D49B9F] font-medium py-3 px-4 rounded-xl shadow-sm text-xs whitespace-nowrap active:scale-95 cursor-pointer max-w-[150px] truncate"
                >
                  {gift.text}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* مرحلة اختيار لون الورد */}
        {step === 'flowerColors' && (
          <div className="w-full h-[440px] relative">
            <div className="mb-4 pt-1">
              <h2 className="text-lg font-semibold mb-1 text-[#4A2026]">اختيار موفق الورد 🌸</h2>
              <p className="text-xs text-[#4A2026]/80 font-light">
                {flowerEscapeCount < 10 ? 'اختاري لون الورد المناسب لكِ' : 'استقرت الألوان، يمكنكِ الاختيار الآن!'}
              </p>
            </div>

            {flowerColors.map((flower, idx) => (
              <div 
                key={flower.id}
                style={{ top: flowerPositions[idx].top, left: flowerPositions[idx].left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
              >
                <button
                  onTouchStart={() => handleFlowerTouchOrClick(idx)}
                  onMouseEnter={() => {
                    if (flowerEscapeCount < 10) handleFlowerTouchOrClick(idx);
                  }}
                  onClick={() => handleFlowerTouchOrClick(idx)}
                  className="bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] border border-[#D49B9F] font-medium py-3 px-4 rounded-xl shadow-sm text-xs whitespace-nowrap active:scale-95 cursor-pointer max-w-[160px] truncate"
                >
                  {flower.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* مرحلة الفوز الخاصة بالمقلب (عند اختيار "لا، لست أنا") */}
        {step === 'prankWon' && (
          <div className="w-full animate-fade-in py-1 flex flex-col items-center">
            
            {/* جملة حركات فوق بخط كبير وواضح */}
            <h2 className="text-base font-extrabold text-[#4A2026] mb-1">
              حركااات يالذكي عرفت وين الهديه ✨
            </h2>

            {/* تحتها جملة هديتك هي وطن يعزك بخط أكبر */}
            <h1 className="text-2xl font-black text-[#4A2026] mb-2">
              هديتك هي وطن يعزك
            </h1>

            {/* تحتها السهم الرصاصي وغير المتحرك وجانبه عبارة ركز لي على هذي */}
            <div className="flex items-center gap-1.5 mb-2 text-gray-400 text-xs font-medium">
              <span>ركز لي على هذي</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* النصوص بمضاعفة الحجم وبدون إيموجي وبدون مربع خلفي */}
            <div className="w-full flex flex-col items-center justify-center gap-3 py-2">
              <div className="text-green-800 font-black text-3xl sm:text-4xl tracking-wide">
                المادة 34
              </div>
              <div className="text-[#4A2026] text-sm sm:text-base font-bold text-center leading-relaxed max-w-xs">
                الدفاع عن العقيدة الإسلامية، والمجتمع، والوطن واجب على كل مواطن
              </div>
            </div>
          </div>
        )}

        {/* المرحلة الثالثة: الفوز */}
        {step === 'won' && (
          <div className="w-full animate-fade-in py-6 flex flex-col items-center">
            
            <div className="text-2xl mb-2 animate-bounce">
              🌷 ✨ 🌸
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#4A2026] mb-4 leading-relaxed tracking-wide drop-shadow-sm">
              هديتك تنتظرك ترجعين بدر بالسلامة 🌸
            </h2>
            
            <h1 className="text-xl sm:text-2xl font-bold mb-3 text-[#4A2026]">
              وألف مبروك ما جبتي أم أمير ✨
            </h1>

            <p className="text-sm leading-relaxed text-[#4A2026]/90 mb-6 font-medium max-w-xs">
              تتربى في عزكم، وجعلها الله من مواليد السعادة والصلاح. 🌷
            </p>

            <div className="bg-[#E9C9CD] hover:bg-[#dfb7bc] text-[#4A2026] border border-[#D49B9F] font-bold py-3 px-8 rounded-2xl inline-block shadow-md text-sm transition-all transform hover:scale-105">
              والحمد لله على سلامتكِ يا حنو 🤍
            </div>

          </div>
        )}

      </div>

      {/* الفوتر */}
      <footer className="w-full max-w-md text-center py-3 text-[10px] text-[#4A2026]/70 font-light relative z-10">
        صُنع بكل حب لعيون أريام © 2026
      </footer>

    </main>
  );
}