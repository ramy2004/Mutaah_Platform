"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddProduct } from "@/context/AddProductContext";
import { validateAddProductStep1, AddProductStep1Errors } from "@/validations/addProduct.validation";
import { PRODUCT_CATEGORIES } from "@/types/addProduct";
import UserDropdown from "@/components/UserDropdown";
import { useUserProfile } from "@/context/UserProfileContext";

export default function AddProductStep1Page() {
  const router = useRouter();
  const { formData, updateFormData } = useAddProduct();
  const [errors, setErrors] = useState<AddProductStep1Errors>({});
  const { profile } = useUserProfile();
  const isVerified = profile?.identity_status === "accepted";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (formData.product_images.length >= 4) return;
    updateFormData({ product_images: [...formData.product_images, file] });
  };

  const handleRemoveImage = (index: number) => {
    updateFormData({
      product_images: formData.product_images.filter((_, i) => i !== index),
    });
  };

  const handleNext = async () => {
    const validationErrors = validateAddProductStep1(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    router.push("/add-items/step-2");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      {/* الهيدر */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">إضافة منتج</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-card p-5 md:p-6 shadow-sm border border-gray-100">

          {/* شريط الخطوات */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-xs font-bold text-primary">المعلومات</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-4"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs font-bold text-gray-400">الوقت والإتاحة</span>
            </div>
          </div>

          <div className="space-y-4 text-right">

{!isVerified && (
  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span className="material-symbols-rounded text-orange-500 text-lg">security</span>
      <p className="text-xs font-bold text-orange-600">لازم توثّق هويتك قبل نشر أي منتج</p>
    </div>
    <Link
      href="/verify-identity?next=/add-items/step-1"
      className="bg-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg whitespace-nowrap hover:brightness-105 transition-all"
    >
      وثّق الآن
    </Link>
  </div>
)}


            {/* صور المنتج */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">صور المنتج (حتى 4 صور)</label>
              <div className="grid grid-cols-4 gap-2">
                {formData.product_images.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="معاينة المنتج"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <span className="material-symbols-rounded text-xs">close</span>
                    </button>
                  </div>
                ))}

                {formData.product_images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                    <span className="material-symbols-rounded text-xl text-primary">add_photo_alternate</span>
                    <span className="text-xs text-gray-400">إضافة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* اسم المنتج */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">اسم المنتج</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">inventory_2</span>
                <input
                  type="text"
                  placeholder="مثال: كاميرا سوني A7 III"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>
              {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title}</p>}
            </div>

            {/* التصنيف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">تصنيف المنتج</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">category</span>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                >
                  <option value="">اختر تصنيفاً</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
              {errors.category && <p className="text-xs text-red-500 font-bold">{errors.category}</p>}
            </div>

            {/* الوصف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">وصف المنتج</label>
              <textarea
                rows={3}
                placeholder="اشرح حالة المنتج، مواصفاته، وأي تفاصيل مهمة للمستأجر..."
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description}</p>}
            </div>

            {/* السعر والتأمين */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">سعر الإيجار / ساعة (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">payments</span>
                  <input
                    type="text"
                    placeholder="25"
                    value={formData.price_per_hour}
                    onChange={(e) => updateFormData({ price_per_hour: e.target.value })}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                {errors.price_per_hour && <p className="text-xs text-red-500 font-bold">{errors.price_per_hour}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">مبلغ التأمين / الرهن (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">security</span>
                  <input
                    type="text"
                    placeholder="300"
                    value={formData.deposit_amount}
                    onChange={(e) => updateFormData({ deposit_amount: e.target.value })}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                {errors.deposit_amount && <p className="text-xs text-red-500 font-bold">{errors.deposit_amount}</p>}
              </div>
            </div>
            <p className="text-xs text-gray-400 flex items-start gap-1">
              <span className="material-symbols-rounded text-primary text-xs mt-0.5">info</span>
              مبلغ التأمين محجوز داخل المنصة حتى استرداد المنتج وتأكيد سلامته
            </p>

            {/* زر التالي */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              التالي — الوقت والإتاحة
              <span className="material-symbols-rounded text-base">arrow_back</span>
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}