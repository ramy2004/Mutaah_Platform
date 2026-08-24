"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleClose = () => {
    // إعادة ضبط الحالة لما المودال يسكر، حتى تفتح نظيفة المرة الجاية
    setEmail("");
    setError("");
    setIsSent(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("أدخل بريدك الإلكتروني");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : "حدث خطأ، حاول مرة أخرى";
      setError(message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm animate-in fade-in duration-300">

      <div className="absolute inset-0" onClick={handleClose}></div>

      <div className="relative bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white animate-in zoom-in-95 duration-300">

        {!isSent ? (
          <>
            {/* أيقونة القفل */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
                <span className="material-symbols-rounded text-[32px]">lock_reset</span>
              </div>
              <h2 className="text-[18px] font-black text-gray-800 mb-2">استعادة كلمة السر</h2>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                أدخل بريدك الإلكتروني<br/>
                وسنرسل لك رابط إعادة تعيين كلمة السر
              </p>
            </div>

            {/* حقل الإدخال */}
            <div className="relative group mb-2">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                person
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-xs text-right mb-4">{error}</p>}

            {/* زر الإرسال */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 mt-4 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جارِ الإرسال..." : "إرسال رابط الاستعادة"}
            </button>
          </>
        ) : (
          <>
            {/* حالة النجاح */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
                <span className="material-symbols-rounded text-[32px]">mark_email_read</span>
              </div>
              <h2 className="text-[18px] font-black text-gray-800 mb-2">تفقد بريدك الإلكتروني</h2>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                أرسلنا رابط إعادة تعيين كلمة السر إلى بريدك الإلكتروني.<br/>
                افتح الرابط لتسجيل الدخول وتحديث كلمة السر.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              حسناً
            </button>
          </>
        )}

        {/* العودة لتسجيل الدخول */}
        <button
          onClick={handleClose}
          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 text-[12px] font-bold hover:text-primary transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
          العودة لتسجيل الدخول
        </button>

      </div>
    </div>
  );
}