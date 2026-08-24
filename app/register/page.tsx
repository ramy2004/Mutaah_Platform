"use client";
import { useState } from "react";
import Link from "next/link";
// import EmailVerificationModal from "@/components/EmailVerificationModal";
import { locationData , governorateLabels } from "@/mock/locations";
import { RegisterErrors, RegisterFormData } from "@/types/auth";
import { validateRegister } from "@/validations/auth.validation";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { tokenStorage } from "@/utils/tokenStorage";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    username: "",
    email: "",
    governorate: "",
    district: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const router = useRouter();
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  //const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
const [apiError, setApiError] = useState("");

const handleSubmit = async () => {
  const validationErrors = validateRegister(formData);
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setApiError("");
  setIsSubmitting(true);
  try {
    const res = await authService.register(formData);
    tokenStorage.setToken(res.access_token);
    router.push("/dashboard");
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message
        : "حدث خطأ، حاول مرة أخرى";
    setApiError(message || "حدث خطأ، حاول مرة أخرى");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4 py-12">

      <div className="bg-white w-full max-w-[360px] rounded-card p-6 shadow-xl shadow-primary/5 border border-white/50">

        {/* اللوجو */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-primary to-green-harvest bg-clip-text text-transparent">
            مُتاح
          </h1>
        </div>

        {/* سويتش */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
          <Link href="/login" className="flex-1 py-2 text-center text-gray-400 text-xs font-bold hover:text-primary transition-colors">
            تسجيل الدخول
          </Link>
          <button className="flex-1 py-2 rounded-tab bg-primary text-white text-xs font-bold shadow-sm">
            إنشاء حساب
          </button>
        </div>

        <div className="space-y-3 text-right">

          {/* الاسم الكامل */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">الاسم الكامل</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">badge</span>
              <input
                type="text"
                placeholder="محمد أحمد الخطيب"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>
          {errors.full_name && <p className="text-red-500 text-xs mt-1 text-right">{errors.full_name}</p>}

          {/* اسم المستخدم */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">اسم المستخدم</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">alternate_email</span>
              <input
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>
          {errors.username && <p className="text-red-500 text-xs mt-1 text-right">{errors.username}</p>}

          {/* البريد الإلكتروني */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 text-right">{errors.email}</p>}

          {/* المنطقة */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">المنطقة</label>
            <div className="space-y-2">
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">location_city</span>
                <select
                  className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary"
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value, district: "" })}
                >
                  <option value="">اختر المحافظة</option>
                  {Object.keys(locationData).map((gov) => (
                    <option key={gov} value={gov}>{governorateLabels[gov]}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
              {errors.governorate && <p className="text-red-500 text-xs mt-1 text-right">{errors.governorate}</p>}

              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">location_on</span>
                <select
                  className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary disabled:opacity-50"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  disabled={!formData.governorate}
                >
                  <option value="">اختر المنطقة / الحي</option>
                  {formData.governorate && locationData[formData.governorate].map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
              {errors.district && <p className="text-red-500 text-xs mt-1 text-right">{errors.district}</p>}
            </div>
          </div>

          {/* كلمة المرور */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">كلمة المرور</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pr-11 pl-11 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-rounded text-base">{showPass ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 text-right">{errors.password}</p>}

          {/* تأكيد كلمة المرور */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 mr-1">تأكيد كلمة المرور</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">verified_user</span>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="أعد كتابة كلمة المرور"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pr-11 pl-11 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-rounded text-base">{showConfirmPass ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 text-right">{errors.confirmPassword}</p>}

          {/* شروط الاستخدام */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 accent-primary h-3.5 w-3.5 cursor-pointer"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-tight cursor-pointer select-none">
              أوافق على{" "}
              <Link href="/terms" className="text-primary font-bold hover:underline">شروط الاستخدام</Link>
              {" "}و{" "}
              <Link href="/privacy" className="text-primary font-bold hover:underline">سياسة الخصوصية</Link>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs mt-1 text-right">{errors.terms}</p>}

          {/* زر إنشاء الحساب */}
          <button
  type="button"
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="w-full py-3.5 mt-2 rounded-btn bg-gradient-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? "جارِ الإنشاء..." : "إنشاء حساب"}
</button>
          {apiError && (
  <p className="text-red-500 text-xs text-center mt-2">{apiError}</p>
)}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs font-medium">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary font-black hover:underline mr-1 transition-all">
              تسجيل الدخول
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}