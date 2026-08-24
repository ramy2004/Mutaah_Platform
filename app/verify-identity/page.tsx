"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDropdown from "@/components/UserDropdown";
import { useSearchParams } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { verificationService } from "@/services/verification.service";
import {
  VerificationErrorReason,
  AffectedImage,
  VERIFICATION_ERROR_MESSAGES,
  ERROR_TO_AFFECTED_IMAGE,
} from "@/types/verification";

type PageState = "form" | "processing" | "accepted" | "pending" | "rejected";

function VerifyIdentityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/profile";
  const { updateIdentityStatus } = useUserProfile();
  const [pageState, setPageState] = useState<PageState>("form");
  const [apiError, setApiError] = useState<string | null>(null);

  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [errorReason, setErrorReason] = useState<VerificationErrorReason | null>(null);

  useEffect(() => {
    const loadCurrentStatus = async () => {
      try {
        const current = await verificationService.current();
        if (!current) return;
        if (current.status === "approved" || current.status === "verified") {
          setPageState("accepted");
          updateIdentityStatus("accepted");
          return;
        }
        if (current.status === "manual_review" || current.status === "pending") {
          setPageState("pending");
          updateIdentityStatus("pending");
          return;
        }
        if (current.status === "rejected") {
          setPageState("rejected");
          updateIdentityStatus("rejected");
        }
      } catch {
        // ignore and keep form state
      }
    };

    loadCurrentStatus();
  }, [updateIdentityStatus]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "id" | "selfie"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "id") setIdImage(file);
    else setSelfieImage(file);
  };

  const handleSubmit = async () => {
    if (!idImage || !selfieImage) return;
    setPageState("processing");
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("id_image", idImage);
      formData.append("selfie_image", selfieImage);

      const result = await verificationService.submit(formData);
      const status = result?.status ?? "manual_review";

      if (status === "approved" || status === "verified") {
        setPageState("accepted");
        updateIdentityStatus("accepted");
      } else if (status === "manual_review" || status === "pending") {
        setPageState("pending");
        updateIdentityStatus("pending");
      } else if (status === "rejected") {
        setPageState("rejected");
        updateIdentityStatus("rejected");
      } else {
        setPageState("pending");
      }
    } catch (error: any) {
      setPageState("form");
      setApiError(error?.response?.data?.message ?? "تعذر إرسال طلب التوثيق، حاول مرة أخرى");
    }
  };

  const handleRetry = () => {
    if (!errorReason) return;
    const affected: AffectedImage = ERROR_TO_AFFECTED_IMAGE[errorReason];

    if (affected === "id_image" || affected === "both") setIdImage(null);
    if (affected === "selfie_image" || affected === "both") setSelfieImage(null);

    setErrorReason(null);
    setPageState("form");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      {/* الهيدر */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">توثيق الهوية</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-card p-6 md:p-8 shadow-sm border border-gray-100">

          {/* ===== حالة: نموذج رفع الصور ===== */}
          {pageState === "form" && (
            <div className="text-right space-y-5">

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary text-xl">shield_person</span>
                  أثبت هويتك
                </h2>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex gap-2.5">
                <span className="material-symbols-rounded text-orange-500 text-lg shrink-0">security</span>
                <div>
                  <p className="text-xs font-bold text-orange-600 mb-1">خطوة التوثيق المطلوبة</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    لضمان أمان عمليات الاستئجار، يرجى تزويدنا بصورة واضحة للهوية وصورة شخصية حديثة.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                {/* صورة الهوية */}
                <label className="border-2 border-dashed border-primary bg-primary-light rounded-section p-4 flex flex-col items-center gap-2 cursor-pointer">
                  {idImage ? (
                    <img src={URL.createObjectURL(idImage)} alt="صورة الهوية" className="w-full h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-rounded text-primary text-2xl">badge</span>
                    </div>
                  )}
                  <span className="text-xs font-bold text-primary text-center">التقط صورة الهوية</span>
                  <span className="text-xs text-gray-400 text-center">الوجه الأمامي</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "id")} />
                </label>

                {/* صورة شخصية */}
                <label className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-section p-4 flex flex-col items-center gap-2 cursor-pointer">
                  {selfieImage ? (
                    <img src={URL.createObjectURL(selfieImage)} alt="صورة شخصية" className="w-full h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-rounded text-gray-400 text-2xl">account_circle</span>
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-500 text-center">التقط صورة شخصية</span>
                  <span className="text-xs text-gray-400 text-center">صورة سيلفي واضحة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "selfie")} />
                </label>

              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!idImage || !selfieImage}
                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-rounded text-lg">verified_user</span>
                إرسال للتوثيق
              </button>
            </div>
          )}

          {/* ===== حالة: قيد المعالجة ===== */}
          {pageState === "processing" && (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-600">جاري معالجة طلبك...</p>
              <p className="text-xs text-gray-400">قد يستغرق هذا بضع لحظات</p>
            </div>
          )}

          {/* ===== حالة: مقبول ===== */}
          {pageState === "accepted" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-primary text-3xl">verified</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">تم توثيق هويتك بنجاح</h2>
              <p className="text-xs text-gray-500 mb-6">يمكنك الآن إضافة منتجات واستئجارها بكل أمان.</p>
              <button
                type="button"
                  onClick={() => router.push(nextPath)}                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                متابعة
              </button>
            </div>
          )}

          {/* ===== حالة: قيد المراجعة اليدوية ===== */}
          {pageState === "pending" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-orange-500 text-3xl">pending_actions</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">طلبك قيد المراجعة</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                لم نتمكن من التأكد التلقائي من هويتك، طلبك الآن قيد المراجعة اليدوية وسيتم إعلامك بالنتيجة خلال 24 ساعة.
              </p>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full py-3 rounded-btn bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all"
              >
                العودة لحسابي
              </button>
            </div>
          )}

          {/* ===== حالة: مرفوض ===== */}
          {pageState === "rejected" && errorReason && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-red-500 text-3xl">cancel</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">تم رفض طلب التوثيق</h2>
              <p className="text-xs text-red-500 font-bold mb-6 leading-relaxed bg-red-50 rounded-xl p-3">
                {VERIFICATION_ERROR_MESSAGES[errorReason]}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function VerifyIdentityPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center bg-bg-page" />}
    >
      <VerifyIdentityContent />
    </Suspense>
  );
}