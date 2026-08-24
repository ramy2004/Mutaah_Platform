/*"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/utils/tokenStorage";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const OTP_DURATION = 135; // 02:15 بالثواني

export default function EmailVerificationModal({ isOpen, onClose, email }: ModalProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // إعادة ضبط الحالة لما المودال ينفتح من جديد (مسموح تسوي setState أثناء الرندر بهالطريقة تحديداً)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSecondsLeft(OTP_DURATION);
      setOtp(["", "", "", "", "", ""]);
      setError("");
    }
  }

  // العداد التنازلي — الاشتراك بـ setInterval فقط، بدون أي setState فوري بجسم الـ effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isExpired = secondsLeft === 0;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setSecondsLeft(OTP_DURATION);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputsRef.current[0]?.focus();
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("أدخل الكود كاملاً (6 أرقام)");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await authService.verifyOtp(email, code);
      tokenStorage.setTokens(res.access_token, res.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : "الكود غير صحيح، حاول مرة أخرى";
      setError(message || "الكود غير صحيح، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm animate-in fade-in duration-300">

      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white animate-in zoom-in-95 duration-300">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="إغلاق"
        >
          <span className="material-symbols-rounded text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
            <span className="material-symbols-rounded text-[32px]">mark_email_unread</span>
          </div>
          <h2 className="text-[18px] font-black text-gray-800 mb-2">تحقق من بريدك</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            أرسلنا كود مكوّن من <strong className="text-gray-600">6 أرقام</strong> إلى<br/>
            <strong className="text-primary font-bold text-[12px]">{email}</strong>
          </p>
        </div>

        <div className="flex gap-2 justify-center mb-3" dir="ltr">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-10 h-12 text-center text-lg font-bold rounded-2xl border-2 bg-white transition-all outline-none
                ${digit
                  ? 'border-primary shadow-[0_0_0_3px_rgba(0,167,157,0.1)]'
                  : 'border-gray-200 focus:border-primary'}
              `}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

        <div className="text-center mb-6">
          <div className="text-[11px] text-gray-400 mb-1">
            {isExpired ? (
              <span className="text-red-500 font-bold">انتهت صلاحية الكود</span>
            ) : (
              <>ينتهي الكود بعد <strong className="text-primary font-jakarta">{timeDisplay}</strong></>
            )}
          </div>
          <button
            type="button"
            onClick={handleResend}
            disabled={!isExpired}
            className="text-[12px] text-gray-500 font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            لم يصلك الكود؟{" "}
            <span className={isExpired ? "text-primary font-bold hover:underline cursor-pointer" : "text-gray-400"}>
              إعادة الإرسال
            </span>
          </button>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "جارِ التحقق..." : "تأكيد البريد"}
        </button>

      </div>
    </div>
  );
} */