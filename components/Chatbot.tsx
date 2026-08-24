"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  text: string;
  who: 'bot' | 'user';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickBtns, setShowQuickBtns] = useState(true);
  const [input, setInp] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "أهلاً! أنا مساعد متاح 👋<br/>كيف أقدر أساعدك اليوم؟", who: 'bot' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // [LOGIC] - الردود التلقائية
  const cbReplies: Record<string, string> = {
    'كيف أستأجر منتجاً؟': 'سهل! ابحث عن المنتج، اختر التاريخ والساعات، واضغط "طلب استئجار". بعد موافقة المالك أكمل الدفع وابدأ التنسيق 🎉',
    'ما هو مبلغ الرهن؟': 'الرهن مبلغ تأمين يُحتجز داخل المنصة حتى تُعيد المنتج بسلامة، ثم يُرجع لك فوراً.',
    'كيف أضيف منتجاً للإيجار؟': 'اضغط على "إضافة منتج" من القائمة، أضف الصور والتفاصيل والسعر، وحدد أوقات الإتاحة — وانتهى!',
    'كيف أتواصل مع الدعم؟': 'تقدر تراسلنا على البريد support@mutaah.ps أو عبر واتساب من خلال صفحة تواصل معنا.',
  };

  // [LOGIC] - التمرير التلقائي لأسفل عند وصول رسالة
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const addMsg = (text: string, who: 'bot' | 'user') => {
    setMessages(prev => [...prev, { id: Date.now(), text, who }]);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setShowQuickBtns(false);
    addMsg(text, 'user');
    setInp("");

    setTimeout(() => {
      const reply = cbReplies[text] || 'وصلنا سؤالك! سنرد عليك خلال دقائق. إذا كان استفساراً عاجلاً تواصل معنا عبر الدعم الفني.';
      addMsg(reply, 'bot');
    }, 700);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] font-cairo" dir="rtl">
      
      {/* 1. زر الشات بوت (FAB) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-[#43a047] text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-90 transition-all duration-300"
      >
        <span className="material-symbols-rounded text-[28px]">
          {isOpen ? 'close' : 'headset_mic'}
        </span>
      </button>

      {/* 2. نافذة الشات بوت */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-[310px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          
          {/* الهيدر */}
          <div className="bg-gradient-to-r from-primary to-[#43a047] p-4 flex items-center gap-3 text-white">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-rounded text-[20px]">headset_mic</span>
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold">مساعد مُتاح</div>
              <div className="text-[10px] opacity-90 flex items-center gap-1">
              </div>
            </div>
          </div>

          {/* منطقة الرسائل */}
          <div 
            ref={scrollRef}
            className="h-[250px] overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 no-scrollbar"
          >
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`max-w-[85%] p-3 text-[12px] leading-relaxed shadow-sm ${
                  m.who === 'bot' 
                  ? 'bg-white border border-gray-100 rounded-2xl rounded-tr-none text-gray-700' 
                  : 'bg-primary text-white rounded-2xl rounded-tl-none self-end shadow-primary/10'
                }`}
                dangerouslySetInnerHTML={{ __html: m.text }}
              />
            ))}
          </div>

          {/* الردود السريعة */}
          {showQuickBtns && (
            <div className="bg-gray-50 px-4 pb-3 flex flex-wrap gap-2">
              {Object.keys(cbReplies).map((q) => (
                <button 
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[11px] font-bold py-1.5 px-3 bg-white border border-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  {q.replace('كيف ', '').replace('؟', '')}
                </button>
              ))}
            </div>
          )}

          {/* حقل الإدخال */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              value={input}
              onChange={(e) => setInp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-[12px] outline-none focus:border-primary focus:bg-white transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0"
            >
              <span className="material-symbols-rounded text-[18px]">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}