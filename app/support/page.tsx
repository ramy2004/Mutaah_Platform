"use client";
import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const faqs = [
  {
    id: 1,
    question: "كيف أضمن حقي عند تأجير غرضي الخاص؟",
    answer: "تضمن المنصة حقك من خلال نظام الرهن (Escrow) حيث يتم احتجاز مبلغ تأمين من المستأجر قبل الاستلام، بالإضافة إلى عقد إلكتروني موثق يضمن سلامة الغرض."
  },
  {
    id: 2,
    question: "ما هي رسوم العمولة التي تأخذها المنصة؟",
    answer: "تأخذ منصة مُتاح عمولة رمزية تبلغ 10% فقط من قيمة عملية التأجير لتغطية مصاريف التشغيل وتأمين المعاملات المالية."
  },
  {
    id: 3,
    question: "ماذا أفعل في حال تأخر المستأجر عن الموعد؟",
    answer: "في حال التأخير، يتم احتساب رسوم إضافية تلقائياً من مبلغ الرهن. يمكنك أيضاً التواصل مع الدعم الفني فوراً من خلال زر 'فتح تذكرة' بالأسفل."
  }
];

export default function SupportPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800 tracking-tight">الدعم الفني</div>
        <div className="flex-1 flex justify-center">
           <Link href="/dashboard" className="text-2xl font-black text-primary italic select-none">مُتاح</Link>
        </div>
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 hover:border-red-100"
          >
            <span className="material-symbols-rounded text-[22px]">close</span>
          </Link>
        </div>
      </header>

      <main className="grow p-6">
        
        <section className="bg-[#e9f7f5] rounded-[32px] md:rounded-[32px] py-12 px-6 text-center max-w-4xl mx-auto w-full">
          
          <div className="max-w-2xl mx-auto mb-10">
            <h1 className="text-[24px] md:text-[30px] font-black text-primary mb-3 tracking-tight">
              كيف يمكننا مساعدتك؟
            </h1>
            <p className="text-gray-500 text-[13px] md:text-[14px] font-medium">
              تصفح الأسئلة الشائعة أو تواصل مع فريق الدعم مباشرة
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto text-right">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-[32px] border border-gray-50 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button 
                  onClick={() => setActiveQuestion(activeQuestion === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-right"
                >
                  <span className={`font-bold text-[14px] transition-colors ${activeQuestion === faq.id ? 'text-primary' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  <span className={`material-symbols-rounded transition-transform duration-300 text-gray-400 ${activeQuestion === faq.id ? 'rotate-180 text-primary' : ''}`}>
                    expand_more
                  </span>
                </button>
                
                <div className={`px-6 overflow-hidden transition-all duration-300 ${activeQuestion === faq.id ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-400 text-[13px] leading-relaxed border-t border-gray-50 pt-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl mx-auto p-8 border-2 border-dashed border-primary/20 rounded-[32px] bg-white/40">
             <div className="text-[14px] font-bold text-gray-600 mb-4">لم تجد حلاً لمشكلتك؟</div>
             <button className="px-10 py-3 rounded-2xl bg-primary text-white font-bold text-[14px] shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all">
               فتح تذكرة دعم مباشر
             </button>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
