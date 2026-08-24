import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — مُتاح",
  description: "سياسة حماية البيانات والخصوصية لمنصة مُتاح.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* // [DESIGN/STRUCTURE] - الهيدر الموحد (العنوان يمين، لوجو وسط، X شمال) */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800">سياسة الخصوصية</div>
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

      {/* // [DESIGN/STRUCTURE] - المحتوى الرئيسي */}
      <main className="grow max-w-4xl mx-auto w-full p-6 py-16">
        
        {/* أيقونة حماية الخصوصية */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
            <span className="material-symbols-rounded text-4xl">shield_lock</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800">خصوصيتك هي أولويتنا</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium italic">نحن نلتزم بحماية بياناتك الشخصية وتوفير بيئة آمنة للتشارك.</p>
        </div>

        {/* // [DESIGN/STRUCTURE] - كروت المعلومات القانونية */}
        <div className="space-y-6">
          
          {/* القسم الأول: جمع المعلومات */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-right">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <span className="material-symbols-rounded">edit_document</span>
              <h3 className="text-lg font-bold">1. جمع المعلومات</h3>
            </div>
            <p className="text-gray-500 text-sm leading-loose">
              نحن نجمع المعلومات التي تزودنا بها عند التسجيل، مثل الاسم، رقم الهاتف، وصورة الهوية. هذه المعلومات تُستخدم حصرياً لأغراض التوثيق وضمان حقوق جميع الأطراف داخل المنصة، ولن يتم عرضها للعامة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-right">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <span className="material-symbols-rounded">security</span>
              <h3 className="text-lg font-bold">2. حماية البيانات</h3>
            </div>
            <p className="text-gray-500 text-sm leading-loose">
              تستخدم منصة <span className="font-bold text-primary">مُتاح</span> تقنيات تشفير SSL متطورة لضمان سرية بياناتك المالية والشخصية. جميع البيانات تُخزن في خوادم محمية ومشفرة، لضمان عدم وصول أي طرف ثالث غير مصرح له إليها.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-right">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <span className="material-symbols-rounded">share</span>
              <h3 className="text-lg font-bold">3. مشاركة المعلومات</h3>
            </div>
            <p className="text-gray-500 text-sm leading-loose">
              نحن نحترم خصوصيتك؛ لذا لا نقوم ببيع أو تأجير بياناتك الشخصية لأي جهات تسويقية. يتم مشاركة معلومات التواصل الضرورية (مثل رقم الهاتف) فقط مع الطرف الآخر في العملية (المؤجر أو المستأجر) عند إتمام عملية الحجز رسمياً لتنسيق عملية الاستلام والتسليم.
            </p>
          </div>

        </div>

        {/* تنبيه إضافي ختامي */}
        <div className="mt-12 p-6 bg-primary/[0.03] border border-dashed border-primary/20 rounded-[32px] text-center">
          <p className="text-primary text-xs font-bold leading-relaxed">
            باستخدامك لمنصة مُتاح، فأنت توافق على جمع ومعالجة بياناتك وفقاً لهذه السياسة.<br />
            آخر تحديث: مايو 2026
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}