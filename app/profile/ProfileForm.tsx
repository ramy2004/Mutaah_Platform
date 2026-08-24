"use client";
import { useState } from "react";
import Link from "next/link";
import { locationData , governorateLabels } from "@/mock/locations";
import { UserProfile, ProfileErrors } from "@/types/auth";
import UserDropdown from "@/components/UserDropdown";
import { validateProfile } from "@/validations/auth.validation";
import { mockUserStats, mockFinancialSummary, mockUserPlan } from "@/mock/user.mock";
import { profileService } from "@/services/profile.service";
import { AxiosError } from "axios";
import { plans } from "@/mock/plans.data";
import PlanFeaturesModal from "@/components/PlanFeaturesModal";

interface ProfileFormProps {
  initialProfile: UserProfile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
const [formData, setFormData] = useState<UserProfile>(initialProfile);
const [errors, setErrors] = useState<ProfileErrors>({});
const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
const [avatarFile, setAvatarFile] = useState<File | null>(null);
const [newPassword, setNewPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState("");
const [saveSuccess, setSaveSuccess] = useState(false);
const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

const currentPlan = plans.find((p) => p.plan_type === mockUserPlan.plan_type);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }
};
const handleRemoveImage = () => {
  setAvatarFile(null);
  setAvatarPreview(null);
};

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  const validationErrors = validateProfile(formData);
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;
  if (newPassword && newPassword.length < 6) {
    setPasswordError("يجب أن تكون 6 حروف على الأقل");
    return;
  }
  setPasswordError("");
  setSaveError("");
  setSaveSuccess(false);
  setIsSaving(true);
  try {
    await profileService.updateProfile({
      full_name: formData.full_name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      governorate: formData.governorate,
      district: formData.district,
      password: newPassword || undefined,
      avatar: avatarFile,
    });
    setSaveSuccess(true);
    setNewPassword("");
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message
        : "فشل حفظ التغييرات، حاول مرة أخرى";
    setSaveError(message || "فشل حفظ التغييرات، حاول مرة أخرى");
  } finally {
    setIsSaving(false);
  }
};


 return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      {/* الهيدر */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">حسابي</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>
      <main className="grow max-w-6xl mx-auto w-full p-4 md:p-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* العمود الجانبي */}
          <div className="lg:col-span-1 space-y-4">

            {/* كارد البروفايل */}
            <div className="bg-linear-to-br from-primary to-green-harvest rounded-container p-6 shadow-xl shadow-primary/20 text-center text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative w-20 h-20 mx-auto mb-4 z-10">
                <div className="w-full h-full rounded-full bg-white/20 border-2 border-white/50 shadow-inner overflow-hidden flex items-center justify-center backdrop-blur-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-rounded text-5xl text-white">person</span>
                  )}
                </div>
                <label htmlFor="avatar-upload" className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 cursor-pointer transition-all active:scale-90">
                  <span className="material-symbols-rounded text-sm">photo_camera</span>
                  <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {avatarPreview && (
                  <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center border border-white hover:scale-110 transition-all shadow-md">
                    <span className="material-symbols-rounded text-xs">close</span>
                  </button>
                )}
              </div>

              {/* بيانات الاسم */}
              <div className="mb-4 z-10 relative">
                <h2 className="text-base font-black leading-tight tracking-tight">{formData.full_name || "أحمد محمد سالم"}</h2>
                <p className="text-xs text-white/80 font-medium mt-1" dir="ltr">@{formData.username || "user"}</p>
              </div>

              {/* شارة التوثيق */}
<div className="flex justify-center mb-5 z-10 relative">
  {formData.identity_status === "accepted" && (
    <span className="flex items-center gap-1 text-xs font-black text-primary bg-white px-3 py-1 rounded-full shadow-sm">
      <span className="material-symbols-rounded text-xs">verified</span> موثق
    </span>
  )}

  {formData.identity_status === "pending" && (
    <Link
      href="/verify-identity"
      className="flex items-center gap-1 text-xs font-black text-orange-500 bg-white px-3 py-1 rounded-full shadow-sm hover:bg-orange-50 transition-all"
    >
      <span className="material-symbols-rounded text-xs">pending</span> قيد المراجعة
    </Link>
  )}

  {formData.identity_status === "rejected" && (
  <Link
    href="/verify-identity"
    className="flex items-center gap-1.5 text-xs font-black text-red-500 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full shadow-sm hover:bg-red-100 transition-all"
  >
    <span className="material-symbols-rounded text-xs">cancel</span>
    غير موثق — وثّق الآن
  </Link>
)}
</div>

              {/* قسم الخطة */}
              <div className="bg-white/10 rounded-btn p-3 mb-4 border border-white/10 text-right z-10 relative backdrop-blur-sm">
  <button
    type="button"
    onClick={() => setIsPlanModalOpen(true)}
    className="w-full flex justify-between items-center mb-2 px-1 hover:opacity-80 transition-opacity"
  >
    <span className="text-xs text-white/70 font-bold">نوع الخطة</span>
    <span className="text-xs text-white font-black flex items-center gap-1">
      {currentPlan?.name ?? mockUserPlan.plan_type}
      <span className="material-symbols-rounded text-sm">info</span>
    </span>
  </button>
  <Link href="/subscriptions" className="w-full py-1.5 bg-white text-primary text-xs font-black rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 shadow-md">
    <span className="material-symbols-rounded text-sm">workspace_premium</span> ترقية الخطة الآن
  </Link>
</div>

              {/* الإحصائيات */}
              <div className="flex items-center justify-center gap-5 py-3 border-t border-white/10 mt-2 z-10 relative">
                <div className="text-center">
                  <span className="text-lg font-black text-white leading-none">{mockUserStats.products_count}</span>
                  <p className="text-xs text-white/70 font-bold uppercase mt-0.5">منتجاتي</p>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="text-center">
                  <span className="text-lg font-black text-white leading-none">{mockUserStats.rentals_count}</span>
                  <p className="text-xs text-white/70 font-bold uppercase mt-0.5">تأجيراتي</p>
                </div>
              </div>
            </div>

            {/* الملخص المالي */}
            <div className="bg-white rounded-section border border-gray-100 p-5 shadow-sm text-right">
              <h3 className="text-xs font-black text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-lg text-primary">account_balance_wallet</span> الملخص المالي
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500 font-medium">أرباح التأجير</span>
                  <span className="text-sm font-black text-primary">₪ {mockFinancialSummary.rental_price_total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-500 font-medium">رهانات محتجزة</span>
                  <span className="text-sm font-black text-orange-500">₪ {mockFinancialSummary.deposit_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الرئيسي */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card border border-gray-100 p-6 md:p-10 shadow-sm text-right">
              <h3 className="text-base font-black text-gray-800 mb-8 border-b border-gray-50 pb-4">تعديل البيانات الأساسية</h3>

              <form onSubmit={handleUpdate} className="space-y-5">

                {/* الاسم + اليوزرنيم */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 mr-1">الاسم الكامل</label>
                    <div className={`relative transition-all ${errors.full_name ? "ring-1 ring-red-400 rounded-xl shadow-sm" : ""}`}>
                      <span className={`material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-lg ${errors.full_name ? "text-red-400" : "text-gray-400"}`}>badge</span>
                      <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium" />
                    </div>
                    {errors.full_name && <p className="text-xs text-red-500 mr-1 font-bold">{errors.full_name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 mr-1">اسم المستخدم</label>
                    <div className={`relative transition-all ${errors.username ? "ring-1 ring-red-400 rounded-xl shadow-sm" : ""}`}>
                      <span className={`material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-lg ${errors.username ? "text-red-400" : "text-gray-400"}`}>alternate_email</span>
                      <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium" />
                    </div>
                    {errors.username && <p className="text-xs text-red-500 mr-1 font-bold">{errors.username}</p>}
                  </div>
                </div>

                {/* الإيميل + الهاتف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 mr-1">البريد الإلكتروني</label>
                    <div className={`relative transition-all ${errors.email ? "ring-1 ring-red-400 rounded-xl shadow-sm" : ""}`}>
                      <span className={`material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-lg ${errors.email ? "text-red-400" : "text-gray-400"}`}>mail</span>
                      <input type="email" dir="ltr" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium text-right" />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mr-1 font-bold">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 mr-1">رقم الجوال</label>
                    <div className={`relative transition-all ${errors.phone ? "ring-1 ring-red-400 rounded-xl shadow-sm" : ""}`}>
                      <span className={`material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-lg ${errors.phone ? "text-red-400" : "text-gray-400"}`}>phone</span>
                      <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium" dir="ltr" />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mr-1 font-bold">{errors.phone}</p>}
                  </div>
                </div>

                {/* المنطقة السكنية */}
                <div className="bg-gray-50 p-5 rounded-section border border-gray-100 space-y-4">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-700">
                    <span className="material-symbols-rounded text-primary">map</span> تعديل الموقع السكني
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <select value={formData.governorate} onChange={(e) => setFormData({ ...formData, governorate: e.target.value, district: "" })} className="w-full pr-10 pl-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs outline-none appearance-none focus:border-primary font-bold text-gray-700">
                        <option value="" disabled={formData.governorate !== ""}>اختر المحافظة</option>
                        {Object.keys(locationData).map(gov => <option key={gov} value={gov}>{governorateLabels[gov]}</option>)}
                      </select>
                      <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 text-lg">location_city</span>
                      <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                    </div>

                    <div className="relative">
                      <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full pr-10 pl-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs outline-none appearance-none focus:border-primary font-bold text-gray-700">
                        <option value="" disabled={formData.district !== ""}>اختر المنطقة</option>
                        {locationData[formData.governorate]?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 text-lg">location_on</span>
                      <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* كلمة السر */}
                <div className="space-y-1.5 pb-4">
                  <label className="text-xs font-bold text-gray-500 mr-1">كلمة السر الجديدة</label>
                  <div className={`relative transition-all ${passwordError ? "ring-1 ring-red-400 rounded-xl shadow-sm" : ""}`}>
                    <span className={`material-symbols-rounded absolute right-4 top-1/2 -translate-y-1/2 text-lg ${passwordError ? "text-red-400" : "text-gray-400"}`}>lock</span>
                    <input type="password" placeholder="اتركه فارغاً إذا لم تود التغيير" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-medium" />
                  </div>
                  {passwordError && <p className="text-xs text-red-500 mr-1 font-bold">{passwordError}</p>}
                </div>

                <button type="submit" disabled={isSaving} className="w-full py-4 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
  <span className="material-symbols-rounded text-xl">save</span>
  {isSaving ? "جارِ الحفظ..." : "حفظ كافة التغييرات"}
</button>
{saveError && <p className="text-red-500 text-xs text-center font-bold">{saveError}</p>}
{saveSuccess && <p className="text-primary text-xs text-center font-bold">تم حفظ التغييرات بنجاح ✓</p>}

              </form>
            </div>
          </div>

             </div>

      </main>

      {currentPlan && (
        <PlanFeaturesModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          plan={currentPlan}
        />
      )}
    </div>
  );
}