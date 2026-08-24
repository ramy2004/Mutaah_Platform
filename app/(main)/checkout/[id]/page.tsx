"use client";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
    const params = useParams();
  const productId = params.id;
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">إتمام الاستئجار</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-card p-6 md:p-8 shadow-sm border border-gray-100">

          {/* أيقونة النجاح + العنوان */}
          <div className="text-center mb-6">
            <div className="w-15 h-15 rounded-full bg-green-50 border-[3px] border-green-100 inline-flex items-center justify-center mb-3">
              <span className="material-symbols-rounded text-3xl text-green-600">check_circle</span>
            </div>
            <h1 className="text-lg font-black text-gray-800 mb-1">تمت موافقة المالك!</h1>
            <p className="text-xs text-gray-400">راجع تفاصيل الطلب قبل المتابعة</p>
          </div>

          {/* بطاقة ملخص الطلب */}
          <div className="border border-gray-100 rounded-card p-4 mb-4">

            {/* معلومات المنتج والمالك */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-2xl text-gray-400">photo_camera</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">كاميرا سوني A7 III</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-rounded text-primary text-sm">person</span>
                  المالك: أحمد محمد سالم
                  <span className="material-symbols-rounded text-primary text-sm">verified</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-3"></div>

            {/* تفاصيل الموعد */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">الموعد</span>
                <span className="font-bold text-gray-800">الاثنين 13 مايو 2025</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">من الساعة</span>
                <span className="text-gray-800">10:00 صباحاً</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">حتى الساعة</span>
                <span className="text-gray-800">1:00 ظهراً</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">المدة</span>
                <span className="text-gray-800">3 ساعات</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">الموقع</span>
                <span className="text-gray-800 flex items-center gap-1">
                  <span className="material-symbols-rounded text-primary text-sm">location_on</span>
                  غزة — الرمال
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-3"></div>

            {/* التكلفة */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">سعر الساعة</span>
                <span className="text-gray-800">₪ 25</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">تكلفة الإيجار (3 ساعات)</span>
                <span className="font-bold text-primary">₪ 75</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">رهن التأمين</span>
                <span className="font-bold text-orange-500">
                  ₪ 300 <span className="font-normal text-[11px]">(يُعاد بعد الاسترداد)</span>
                </span>
              </div>
            </div>

            <div className="h-px bg-primary/20 my-3"></div>

            {/* الإجمالي */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">الإجمالي</span>
              <span className="text-2xl font-black text-primary">₪ 375</span>
            </div>
          </div>

          {/* تنبيه الرهن */}
          <div className="bg-amber-50 border border-amber-100 rounded-card p-3 mb-4 flex items-start gap-2">
            <span className="material-symbols-rounded text-amber-500 text-base shrink-0 mt-0.5">warning</span>
            <p className="text-xs text-gray-600">مبلغ الرهن ₪ 300 سيُحتجز داخل المنصة حتى إعادة المنتج وتأكيد سلامته</p>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col gap-3">
            <Link
  href={`/checkout/${productId}/payment`}
  className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
>
  <span className="material-symbols-rounded text-lg">payment</span>
  تابع للدفع
</Link>

            <button
              type="button"
              className="w-full py-3 rounded-btn bg-gray-50 border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-rounded text-lg">close</span>
              إلغاء العملية
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}