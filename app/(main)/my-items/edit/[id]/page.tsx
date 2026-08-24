"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mockProductDetails } from "@/mock/productDetails.mock";
import { useProducts } from "@/context/ProductsContext";
import { PRODUCT_CATEGORIES, AvailabilityDate } from "@/types/addProduct";
import { getCategoryIcon } from "@/utils/productCategory";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, isTimeComplete, getAllHours } from "@/utils/time";

type ImageSlot = string | File;

const ALL_HOURS = getAllHours();

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const { products, updateProduct, updateProductStatus, removeProduct } = useProducts();
  const contextProduct = products.find((p) => p.id === productId);
  const detailProduct = mockProductDetails[productId];

  // --- الحقول الأساسية (title/category/price مصدرها ProductsContext — هو الحقيقة بالنسبة للداشبورد) ---
  const [title, setTitle] = useState(contextProduct?.title ?? "");
  const [category, setCategory] = useState(contextProduct?.category ?? "");
  const [pricePerHour, setPricePerHour] = useState(String(contextProduct?.price_per_hour ?? ""));

  // --- حقول إضافية (مصدرها mockProductDetails) ---
  const [description, setDescription] = useState(detailProduct?.description ?? "");
  const [depositAmount, setDepositAmount] = useState(String(detailProduct?.deposit_amount ?? ""));
  const [images, setImages] = useState<ImageSlot[]>(detailProduct?.product_images ?? []);
  const [availableDates] = useState<AvailabilityDate[]>(detailProduct?.available_dates ?? []);

  // --- منطق الكاليندر والساعات (نفس نمط Add Product Step 2) ---
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isFullDayAvailability, setIsFullDayAvailability] = useState(false);
  const [sameHoursForAllDays, setSameHoursForAllDays] = useState(false);
  const [sharedStart, setSharedStart] = useState<TimeValue>({ hour: null, period: null });
  const [sharedEnd, setSharedEnd] = useState<TimeValue>({ hour: null, period: null });
  const [perDaySlots, setPerDaySlots] = useState<Record<string, { start: TimeValue; end: TimeValue }>>({});

  if (!contextProduct || !detailProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">المنتج غير موجود</p>
      </div>
    );
  }

  const availableByDate = new Map(availableDates.map((d) => [d.date, d]));

  const year = 2025;
  const monthIndex = 4;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();

  const calendarCells: { day: number; isoDate: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ day: d, isoDate });
  }

  const toggleSelectDay = (isoDate: string) => {
    const availability = availableByDate.get(isoDate);
    if (!availability || availability.is_booked) return;

    setSelectedDates((prev) =>
      prev.includes(isoDate) ? prev.filter((d) => d !== isoDate) : [...prev, isoDate]
    );
    setIsFullDayAvailability(false);
    setSameHoursForAllDays(false);
    setSharedStart({ hour: null, period: null });
    setSharedEnd({ hour: null, period: null });
    setPerDaySlots({});
  };

  const isEditComplete =
    selectedDates.length > 0 &&
    (isFullDayAvailability ||
      (sameHoursForAllDays && isTimeComplete(sharedStart) && isTimeComplete(sharedEnd)) ||
      (!sameHoursForAllDays &&
        selectedDates.every(
          (d) =>
            isTimeComplete(perDaySlots[d]?.start || { hour: null, period: null }) &&
            isTimeComplete(perDaySlots[d]?.end || { hour: null, period: null })
        )));

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 4) return;
    setImages((prev) => [...prev, file]);
  };

  const handleFreeze = () => {
    updateProductStatus(productId, "frozen");
  };

  const handleReactivate = () => {
    updateProductStatus(productId, "active");
  };

  const handleDelete = () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.");
    if (!confirmed) return;
    removeProduct(productId);
    router.push("/dashboard");
  };

  const handleSave = () => {
    updateProduct(productId, {
      title,
      category,
      icon: getCategoryIcon(category),
      price_per_hour: Number(pricePerHour),
    });
    router.push("/dashboard");
  };

  const categoryOptions = PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])
    ? PRODUCT_CATEGORIES
    : [category, ...PRODUCT_CATEGORIES];

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/my-items" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">تعديل المنتج</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-card p-5 md:p-6 shadow-sm border border-gray-100">

          {/* أزرار الحالة */}
          <div className="flex items-center justify-end gap-2 mb-5 pb-4 border-b border-gray-100">
            <button
              type="button"
              onClick={handleReactivate}
              disabled={contextProduct.status === "active"}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                contextProduct.status === "active"
                  ? "border-green-200 text-green-600 bg-green-50 cursor-default"
                  : "border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600"
              }`}
            >
              <span className="material-symbols-rounded text-sm">check_circle</span>
              منشور
            </button>

            <button
              type="button"
              onClick={handleFreeze}
              disabled={contextProduct.status === "frozen"}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border transition-all ${
                contextProduct.status === "frozen"
                  ? "border-orange-200 text-orange-500 bg-orange-50 cursor-default"
                  : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              <span className="material-symbols-rounded text-sm">pause_circle</span>
              تجميد
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all"
            >
              <span className="material-symbols-rounded text-sm">delete</span>
              حذف
            </button>
          </div>

          <div className="space-y-4 text-right">

            {/* الصور */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">صور المنتج — اضغط لحذف أو إضافة</label>
              <div className="grid grid-cols-4 gap-2">
                {images.map((imgSlot, i) => (
                  <div key={i} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                    <img
                      src={typeof imgSlot === "string" ? imgSlot : URL.createObjectURL(imgSlot)}
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

                {images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                    <span className="material-symbols-rounded text-xl text-primary">add_photo_alternate</span>
                    <span className="text-xs text-gray-400">إضافة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* التصنيف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">تصنيف المنتج</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">وصف المنتج</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all resize-none"
              />
            </div>

            {/* السعر والتأمين */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">سعر الإيجار / ساعة (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">payments</span>
                  <input
                    type="text"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">مبلغ التأمين (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">security</span>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="material-symbols-rounded text-primary text-xs">info</span>
                  محجوز حتى استرداد المنتج
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* الكاليندر */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <span className="material-symbols-rounded text-primary text-sm">calendar_today</span>
                الأيام المتاحة
              </label>

              <div className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-rounded text-gray-400 text-base">chevron_right</span>
                  <span className="text-xs font-bold text-gray-800">{MONTH_NAMES[monthIndex]} {year}</span>
                  <span className="material-symbols-rounded text-gray-400 text-base">chevron_left</span>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_LABELS.map((day) => (
                    <div key={day} className="text-center text-xs text-gray-300 font-bold">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`}></div>)}
                  {calendarCells.map(({ day, isoDate }) => {
                    const availability = availableByDate.get(isoDate);
                    const isBooked = !!availability?.is_booked;
                    const isSelected = selectedDates.includes(isoDate);
                    const isClickable = !!availability && !availability.is_booked;

                    let cellClass = "text-gray-300 cursor-not-allowed";
                    if (isSelected) cellClass = "bg-primary text-white";
                    else if (isBooked) cellClass = "bg-gray-100 text-gray-400 line-through cursor-not-allowed";
                    else if (isClickable) cellClass = "bg-primary-light text-gray-700 hover:bg-primary/20";

                    return (
                      <button
                        key={isoDate}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => toggleSelectDay(isoDate)}
                        className={`aspect-square rounded-full text-xs font-bold transition-all ${cellClass}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary-light border border-primary"></span> متاح للتعديل</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> مختار</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200"></span> غير مضاف</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> مؤجر</span>
                </div>
              </div>
            </div>

            {/* خيارات تعديل الساعات */}
            {selectedDates.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 pt-3">

                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <input
                    type="checkbox"
                    checked={isFullDayAvailability}
                    onChange={(e) => {
                      setIsFullDayAvailability(e.target.checked);
                      setSameHoursForAllDays(false);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs font-bold text-gray-700">متاح خلال جميع ساعات الأيام المختارة (24 ساعة)</span>
                </label>

                {!isFullDayAvailability && (
                  <div className="border border-dashed border-primary/40 rounded-xl p-3 space-y-3">
                    <p className="text-xs text-gray-400 font-bold">من الساعة</p>
                    <HourPeriodSelect value={sharedStart} onChange={setSharedStart} allowedHours={ALL_HOURS} />

                    <p className="text-xs text-gray-400 font-bold">إلى الساعة</p>
                    <HourPeriodSelect value={sharedEnd} onChange={setSharedEnd} allowedHours={ALL_HOURS} />

                    <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-gray-100">
                      <input
                        type="checkbox"
                        checked={sameHoursForAllDays}
                        onChange={(e) => setSameHoursForAllDays(e.target.checked)}
                        disabled={!isTimeComplete(sharedStart) || !isTimeComplete(sharedEnd)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-xs font-bold text-gray-700">تطبيق هذه الساعات على كل الأيام المختارة</span>
                    </label>
                  </div>
                )}

                {!isFullDayAvailability && !sameHoursForAllDays && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">أو حدد ساعات كل يوم على حدة:</p>
                    {selectedDates.map((date) => {
                      const daySlot = perDaySlots[date] || { start: { hour: null, period: null }, end: { hour: null, period: null } };
                      return (
                        <div key={date} className="border border-gray-100 rounded-lg p-2.5 space-y-2">
                          <p className="text-xs font-bold text-gray-700">{date}</p>

                          <p className="text-xs text-gray-400 font-bold">من الساعة</p>
                          <HourPeriodSelect
                            value={daySlot.start}
                            onChange={(val) => setPerDaySlots((prev) => ({ ...prev, [date]: { ...daySlot, start: val } }))}
                            allowedHours={ALL_HOURS}
                          />

                          <p className="text-xs text-gray-400 font-bold">إلى الساعة</p>
                          <HourPeriodSelect
                            value={daySlot.end}
                            onChange={(val) => setPerDaySlots((prev) => ({ ...prev, [date]: { ...daySlot, end: val } }))}
                            allowedHours={ALL_HOURS}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* الأزرار */}
            <div className="flex gap-3 pt-2">
              <Link
                href="/my-items"
                className="flex-1 py-3 rounded-btn bg-gray-50 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded text-base">arrow_forward</span>
                رجوع
              </Link>
              <button
                type="button"
                onClick={handleSave}
                className="flex-[2] py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded text-base">save</span>
                حفظ التعديلات
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}