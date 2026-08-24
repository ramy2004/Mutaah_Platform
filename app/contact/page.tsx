import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "تواصل معنا — مُتاح",
  description: "نحن هنا للإجابة على استفساراتك ومساعدتك في استخدام منصة مُتاح.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* // [DESIGN/STRUCTURE] - الهيدر (العنوان يمين، لوجو وسط، X شمال) */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        
        {/* اليمين: عنوان الصفحة */}
        <div className="text-lg font-black text-gray-800">
          تواصل معنا
        </div>

        {/* المنتصف: اللوجو */}
        <div className="flex-1 flex justify-center">
           <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
        </div>

        {/* اليسار: زر الإغلاق للعودة للداشبورد */}
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 hover:border-red-100"
          >
            <span className="material-symbols-rounded text-[22px]">close</span>
          </Link>
        </div>
      </header>

      {/* // [DESIGN/STRUCTURE] - المحتوى الرئيسي */}
      <main className="grow max-w-6xl mx-auto w-full p-6 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* // [DESIGN/STRUCTURE] - العمود الأول: معلومات التواصل */}
          <div className="flex flex-col gap-8 text-right">
            <div>
              <h1 className="text-3xl font-black text-gray-800 mb-4">اترك لنا رسالة</h1>
              <p className="text-gray-500 leading-relaxed text-sm">نحن هنا للإجابة على استفساراتك ومساعدتك في استخدام منصة مُتاح بأفضل شكل ممكن.</p>
            </div>

            <div className="space-y-6">
              {/* // [CONTENT/DATA] - البريد الإلكتروني الفعلي */}
              {/* // [CONTENT/DATA] - البريد الإلكتروني (رابط مباشر) */}
            <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-rounded">mail</span>
            </div>
            <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">البريد الإلكتروني</div>
             {/* هنا جعلنا الإيميل رابطاً قابلاً للضغط */}
                <a 
                 href="mailto:mutaah.platform@gmail.com" 
                className="font-bold text-gray-700 hover:text-primary transition-colors block"
                 >
                 mutaah.platform@gmail.com
                </a>
            </div>
            </div>

              {/* // [CONTENT/DATA] - رقم الهاتف */}
              <div className="flex items-center gap-4 group font-jakarta">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-rounded">call</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">رقم الهاتف</div>
                  <div className="font-bold text-gray-700" dir="ltr">+970 59X XXX XXX</div>
                </div>
              </div>

              {/* // [CONTENT/DATA] - المقر الرئيسي */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-rounded">location_on</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">المقر الرئيسي</div>
                  <div className="font-bold text-gray-700">فلسطين — غزة</div>
                </div>
              </div>
            </div>
          </div>

          {/* // [DESIGN/STRUCTURE] - العمود الثاني: نموذج المراسلة (Card) */}
          <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm text-right space-y-6">
            
            <div className="space-y-2">
              <label className="block font-bold text-gray-700 text-sm">الاسم</label>
              <input 
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all text-sm" 
                placeholder="اسمك الكريم"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-700 text-sm">الموضوع</label>
              <input 
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all text-sm" 
                placeholder="عن ماذا تود الاستفسار؟"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-700 text-sm">الرسالة</label>
              <textarea 
                rows={4}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all text-sm resize-none" 
                placeholder="اكتب تفاصيل رسالتك هنا..."
              ></textarea>
            </div>

            <button className="w-full py-4 rounded-[32px] bg-gradient-to-r from-gradient-start to-gradient-end text-white font-bold text-base shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all">
              إرسال الرسالة
            </button>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}