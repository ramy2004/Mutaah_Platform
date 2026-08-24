"use client";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function TermsPage() {
  // [CONTENT/DATA] - قائمة الشروط (سهلة التعديل مستقبلاً)
  const terms = [
    {
      title: "مسؤولية الأغراض",
      icon: "gavel",
      desc: "يتحمل المستأجر كامل المسؤولية عن أي تلف أو ضياع للغرض المستأجر ويلتزم بدفع التعويض المتفق عليه والموضح في تفاصيل الغرض."
    },
    {
      title: "التوثيق الإلزامي",
      icon: "verified",
      desc: "يجب على جميع المستخدمين توثيق حساباتهم عبر الهوية الشخصية لضمان سلامة المجتمع ومنع عمليات الاحتيال، المنصة لا تقبل الحسابات الوهمية."
    },
    {
      title: "إلغاء الحجز",
      icon: "event_busy",
      desc: "يمكن إلغاء الحجز قبل 24 ساعة من الموعد دون رسوم. في حال الإلغاء المتأخر، قد يتم خصم نسبة بسيطة من العربون أو مبلغ الرهن لتعويض المؤجر."
    },
    {
      title: "السلوك المقبول",
      icon: "handshake",
      desc: "يُمنع استخدام المنصة لأي أغراض غير قانونية أو مخالفة للأعراف والقيم المجتمعية الفلسطينية، ويحق للمنصة حظر أي مستخدم يخالف ذلك."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* // [DESIGN/STRUCTURE] - الهيدر الموحد (مستوى -1) */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800 tracking-tight">شروط الاستخدام</div>
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
        
        <section className="bg-[#f8fafc] rounded-[32px] md:rounded-[32px] py-12 px-6 md:px-12 max-w-4xl mx-auto w-full border border-gray-50 shadow-sm">
          
          {/* تنبيه هام (Agreement Box) */}
          <div className="bg-orange-50 border border-orange-100 p-5 rounded-[32px] mb-12 flex items-start gap-4 text-right">
             <span className="material-symbols-rounded text-orange-500 mt-0.5">info</span>
             <p className="text-orange-700 text-[13px] font-bold leading-relaxed">
               بمجرد استخدامك لمنصة مُتاح، فأنت توافق على الالتزام بكافة الشروط المذكورة أدناه لضمان تجربة آمنة وموثوقة للجميع.
             </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-10 text-right">
            {/* // [DESIGN/STRUCTURE] - عرض الشروط بأسلوب منظم */}
            {terms.map((term, index) => (
              <div key={index} className="relative pr-8 border-r-2 border-primary/20">
                {/* أيقونة جانبية مميزة */}
                <span className="material-symbols-rounded absolute -right-[15px] top-0 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-[16px] shadow-md shadow-primary/20">
                  {term.icon}
                </span>
                
                <h3 className="text-[17px] font-black text-gray-800 mb-2 leading-tight">
                  {term.title}
                </h3>
                <p className="text-gray-500 text-[14px] leading-loose font-medium">
                  {term.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ختام قانوني */}
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-[11px] font-bold italic">
               * تحتفظ إدارة منصة مُتاح بالحق في تعديل هذه الشروط في أي وقت مع إخبار المستخدمين بذلك.
             </p>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}