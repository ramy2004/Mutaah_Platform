"use client";
import { useState } from "react"; // موجودة أصلاً، تأكدي بس
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
import { useProducts } from "@/context/ProductsContext";

export default function PaymentGatewayPage() {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const params = useParams();
const router = useRouter();
const productId = params.id;
const [paymentConfirmed, setPaymentConfirmed] = useState(false);
const { markAsRented } = useProducts();
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
  };

  const handleRemoveReceipt = () => setReceiptFile(null);

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">بوابة الدفع</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-card p-6 md:p-8 shadow-sm border border-gray-100">

          <h1 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-5">
            <span className="material-symbols-rounded text-primary text-xl">account_balance</span>
            بوابة الدفع
          </h1>

          {/* طريقة الدفع */}
          <div className="space-y-1.5 mb-4">
            <label className="block text-xs font-bold text-gray-500">طريقة الدفع</label>
            <div className="bg-primary-light border-2 border-primary rounded-card p-4 flex items-center gap-3.5 cursor-pointer shadow-[0_0_0_3px_rgba(0,188,212,0.1)]">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-rounded text-primary text-2xl">account_balance</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">بنك فلسطين</p>
                <p className="text-xs text-gray-400">تحويل بنكي آمن ومشفر</p>
              </div>
              <span
                className="material-symbols-rounded text-primary text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>

          {/* ملخص المبلغ */}
          <div className="border border-gray-100 rounded-card p-4 mb-4">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-gray-500">تكلفة الإيجار</span>
              <span className="font-bold text-gray-800">₪ 75</span>
            </div>
            <div className="flex items-center justify-between mb-2.5 text-xs">
              <span className="text-gray-500">رهن التأمين</span>
              <span className="font-bold text-orange-500">₪ 300</span>
            </div>
            <div className="h-px bg-primary/20 my-2.5"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">الإجمالي</span>
              <span className="text-2xl font-black text-primary">₪ 375</span>
            </div>
          </div>

          {/* رفع الإيصال */}
          <div className="space-y-1.5 mb-4">
            <label className="block text-xs font-bold text-gray-500">رفع إيصال الدفع</label>

            {!receiptFile ? (
              <label className="border-2 border-dashed border-primary rounded-card p-6 flex flex-col items-center gap-2.5 cursor-pointer bg-primary-light hover:brightness-[0.98] transition-all">
                <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-rounded text-primary text-2xl">upload_file</span>
                </div>
                <p className="text-sm font-bold text-primary-dark">ارفع صورة الإيصال</p>
                <p className="text-xs text-gray-400">JPG, PNG — بعد إتمام التحويل للبنك</p>
                <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleReceiptChange} />
              </label>
            ) : (
              <div className="border border-gray-100 rounded-card p-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <img src={URL.createObjectURL(receiptFile)} alt="معاينة الإيصال" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{receiptFile.name}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-rounded text-sm">check_circle</span>
                    تم رفع الإيصال بنجاح
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-all"
                >
                  <span className="material-symbols-rounded text-base">close</span>
                </button>
              </div>
            )}
          </div>

          {/* تنبيه مراجعة */}
          <div className="bg-gray-50 rounded-card p-3 mb-4 flex items-start gap-2">
            <span className="material-symbols-rounded text-primary text-sm shrink-0 mt-0.5">info</span>
            <p className="text-xs text-gray-500">بعد رفع الإيصال سيتم مراجعته من قبل المنصة وتأكيد العملية خلال دقائق</p>
          </div>

          {/* زر التأكيد */}
          <button
            type="button"
            disabled={!receiptFile}
            onClick={() => {
                  setPaymentConfirmed(true);
                  markAsRented(Number(productId));
                   }}
            className="w-full py-3.5 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
          <span className="material-symbols-rounded text-lg">send</span>
             تأكيد الدفع وإرسال الطلب
          </button>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-3">
            <span className="material-symbols-rounded text-primary text-sm">lock</span>
            الدفع مؤمّن عبر بنك فلسطين — SSL مشفر
          </p>
{paymentConfirmed && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm">
    <div className="relative bg-white w-full max-w-[360px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white text-center">

      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-rounded text-green-600 text-3xl">check_circle</span>
      </div>

      <h2 className="text-lg font-black text-gray-800 mb-2">تم الدفع بنجاح!</h2>
      <p className="text-xs text-gray-500 leading-relaxed mb-6">
        سيتم مراجعة الإيصال وتأكيد العملية خلال دقائق. يمكنك الآن التواصل مع المالك لتنسيق موعد التسليم.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href={`/chat/${productId}`}
          className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded text-lg">chat</span>
          الذهاب للمحادثة مع المالك
        </Link>

        <Link
          href="/dashboard"
          className="w-full py-3 rounded-btn bg-gray-50 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          العودة للرئيسية
        </Link>
      </div>

    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
}