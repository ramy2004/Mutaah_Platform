"use client";
import { useState } from "react";
import Link from "next/link";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { useRouter } from "next/navigation";
import { validateLogin } from "@/validations/auth.validation";
import { LoginErrors, LoginFormData } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/utils/tokenStorage";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] =
  useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(""); 
  const [errors, setErrors] = useState<LoginErrors>({});  
  const router = useRouter();
  const handleSubmit = async () => {
  const validationErrors = validateLogin(formData);
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setApiError("");
  setIsSubmitting(true);
  try {
    const res = await authService.login(formData);
    tokenStorage.setToken(res.access_token);
    router.push("/dashboard");
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message
        : "بيانات الدخول غير صحيحة";
    setApiError(message || "بيانات الدخول غير صحيحة");
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    // [DESIGN/STRUCTURE] - خلفية ناعمة
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f7] p-4">
      {/* // [DESIGN/STRUCTURE] - الكارد الرئيسي (تم تصغير العرض من 390 لـ 340) */}
      <div className="bg-white w-full max-w-[340px] rounded-[32px] p-6 md:p-7 shadow-xl shadow-primary/5 border border-white/50">
        {/* اللوجو  */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-black italic tracking-tighter bg-gradient-to-r from-primary to-[#43a047] bg-clip-text text-transparent">
            مُتاح
          </h1>
          <p className="text-gray-400 text-[11px] font-medium">منصة التأجير الأولى في فلسطين</p>
        </div>
        {/* سويتش (تسجيل دخول / إنشاء حساب) - تم تصغير الارتفاع والخط */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
          <button className="flex-1 py-2 rounded-[10px] bg-primary text-white text-[12px] font-bold shadow-sm shadow-primary/20">
            تسجيل الدخول
          </button>
          <Link href="/register" className="flex-1 py-2 text-center text-gray-400 text-[12px] font-bold hover:text-primary transition-colors">
            إنشاء حساب
          </Link>
        </div>

        {/* أيقونة البروفايل - تم تصغير الدائرة من 16 لـ 14 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-rounded text-[30px]">person</span>
          </div>
          <h2 className="text-[15px] font-black text-gray-800 mt-3">أهلاً بعودتك</h2>
          <p className="text-gray-400 text-[11px]">سجل دخولك للمتابعة</p>
        </div>

        {/* // [DESIGN/STRUCTURE] - نموذج تسجيل الدخول */}
        <div className="space-y-3.5 text-right">
          
          {/* حقل اسم المستخدم - تم تقليل الـ padding الداخلي */}
          <div className="relative group">
            <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-primary transition-colors">
              person
            </span>
            <input 
            value={formData.identifier}
            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              type="text"
              placeholder="اسم المستخدم أو البريد الالكتروني"
              className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
          {errors.identifier && (
          <p className="text-red-500 text-[10px] mt-1 text-right">{errors.identifier}</p>
           )}

          {/* حقل كلمة السر */}
          <div className="relative group">
            <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-primary transition-colors">
              lock
            </span>
            <input 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
              type={showPassword ? "text" : "password"}
              placeholder="كلمة السر"
              className="w-full pr-11 pl-11 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all"
            
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-rounded text-[16px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          {/* رسالة الخطأ هون ✅ */}
             {errors.password && (
              <p className="text-red-500 text-[10px] mt-1 text-right">{errors.password}</p>
             )}

          {/* نسيت كلمة السر */}
          <div className="text-right">
            <button type="button"
                        onClick={() => setIsModalOpen(true)} // نفتح المودال هنا
                        className="text-primary text-[11px] font-bold hover:underline transition-all">
              نسيت كلمة السر؟
            </button>
          </div>

          {/* زر الدخول - تم تصغير الارتفاع والخط */}
<button 
    type="button"
    onClick={handleSubmit}
    disabled={isSubmitting}
     className="w-full py-3 mt-1 rounded-[16px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[14px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
  {isSubmitting ? "جارِ الدخول..." : "تسجيل الدخول"}
</button>
        </div>
      
{apiError && (
  <p className="text-red-500 text-[11px] text-center mt-2">{apiError}</p>
)}


        {/* فاصل "أو" */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-100"></div>
          <span className="text-gray-300 text-[10px] font-bold uppercase">أو</span>
          <div className="flex-1 h-[1px] bg-gray-100"></div>
        </div>

        {/* أزرار السوشيال ميديا - تم تصغير الدوائر */}
        <div className="flex justify-center gap-3">
          <button className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          </button>
        </div>

        {/* التذييل - تم تصغير الخط */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-[11px] font-medium">
            ليس لديك حساب؟ <Link href="/register" className="text-primary font-black hover:underline mr-1 transition-all">إنشاء حساب جديد</Link>
          </p>
        </div>

      </div>
      {/* استدعاء المودال في نهاية الصفحة */}
      <ForgotPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}