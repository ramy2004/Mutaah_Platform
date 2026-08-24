import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "من نحن — مُتاح",
  description: "تعرف على رؤية ورسالة منصة مُتاح للتبادل والمشاركة.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800">من نحن</div>
        <div className="flex-1 flex justify-center">
           <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
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

      <main className="grow flex flex-col p-6">
        
        <section className="bg-primary-light rounded-[32px] md:rounded-[32px] py-16 px-6 md:px-12 text-center max-w-7xl mx-auto w-full">
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight">
              نحن نؤمن بقوة المشاركة
            </h1>
            
            <p className="text-gray-500 leading-relaxed text-base md:text-base max-w-3xl mx-auto font-medium">
              منصة <span className="text-primary font-bold">&quot;مُتاح&quot;</span> انطلقت من دافع المسؤولية المجتمعية اتجاه ندرة توفر الكثير من الأغراض والمعدات الأساسية في مجتمعنا. نحن نؤمن أن الحل يكمن في التكافل، ليكون هذا المشروع جسراً لتجاوز نقص الموارد عبر تشارك ما هو متاح بيننا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            <div className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
              <span className="material-symbols-rounded text-primary text-[40px] mb-4 font-light transition-transform group-hover:scale-110">eco</span>
              <h3 className="font-black text-gray-800 text-lg mb-3">الاستدامة</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                الحفاظ على ديمومة الموارد المتاحة واستثمارها بأفضل شكل ممكن لخدمة المجتمع وحماية البيئة.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
              <span className="material-symbols-rounded text-primary text-[40px] mb-4 font-light transition-transform group-hover:scale-110">groups</span>
              <h3 className="font-black text-gray-800 text-lg mb-3">رسالتنا</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                بناء شبكة تكافل مجتمعية تسمح للجميع بالوصول لما يحتاجونه من أدوات ومعدات بأمان وسهولة.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
              <span className="material-symbols-rounded text-primary text-[40px] mb-4 font-light transition-transform group-hover:scale-110">rocket_launch</span>
              <h3 className="font-black text-gray-800 text-lg mb-3">رؤيتنا</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                أن يصبح التشارك هو الحل الأول لمواجهة ندرة الموارد في كل بيت ومؤسسة فلسطينية.
              </p>
            </div>

          </div>
        </section>

      </main>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
