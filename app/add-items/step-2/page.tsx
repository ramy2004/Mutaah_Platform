"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAddProduct } from "@/context/AddProductContext";
import { AvailabilityDate } from "@/types/addProduct";
import { createProduct } from "@/services/product.service";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, isTimeComplete, to24Hour, getAllHours } from "@/utils/time";
import { useState } from "react";


const ALL_HOURS = getAllHours();

export default function AddProductStep2Page() {
  const router = useRouter();
  const { formData, updateFormData, resetFormData } = useAddProduct();

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isFullDayAvailability, setIsFullDayAvailability] = useState(false);
  const [sameHoursForAllDays, setSameHoursForAllDays] = useState(false);

  const [sharedStart, setSharedStart] = useState<TimeValue>({ hour: null, period: null });
  const [sharedEnd, setSharedEnd] = useState<TimeValue>({ hour: null, period: null });

  const [perDaySlots, setPerDaySlots] = useState<Record<string, { start: TimeValue; end: TimeValue }>>({});

  const year = 2025;
  const monthIndex = 4; // مايو — ثابتة بنفس نمط صفحة Product Details
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();

  const calendarCells: { day: number; isoDate: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ day: d, isoDate });
  }

  const toggleSelectDay = (isoDate: string) => {
    setSelectedDates((prev) =>
      prev.includes(isoDate) ? prev.filter((d) => d !== isoDate) : [...prev, isoDate]
    );
    setIsFullDayAvailability(false);
    setSameHoursForAllDays(false);
    setSharedStart({ hour: null, period: null });
    setSharedEnd({ hour: null, period: null });
    setPerDaySlots({});
  };

  const isAvailabilityComplete =
    selectedDates.length > 0 &&
    (isFullDayAvailability ||
      (sameHoursForAllDays && isTimeComplete(sharedStart) && isTimeComplete(sharedEnd)) ||
      (!sameHoursForAllDays &&
        selectedDates.every(
          (d) =>
            isTimeComplete(perDaySlots[d]?.start || { hour: null, period: null }) &&
            isTimeComplete(perDaySlots[d]?.end || { hour: null, period: null })
        )));

  const buildAvailableDates = (): AvailabilityDate[] => {
    return selectedDates.map((date) => {
      if (isFullDayAvailability) {
        return { date, start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false };
      }
      if (sameHoursForAllDays) {
        return {
          date,
          start_time: to24Hour(sharedStart.hour as number, sharedStart.period as "ص" | "م"),
          end_time: to24Hour(sharedEnd.hour as number, sharedEnd.period as "ص" | "م"),
          is_all_day: false,
          is_booked: false,
        };
      }
      const slot = perDaySlots[date];
      return {
        date,
        start_time: to24Hour(slot.start.hour as number, slot.start.period as "ص" | "م"),
        end_time: to24Hour(slot.end.hour as number, slot.end.period as "ص" | "م"),
        is_all_day: false,
        is_booked: false,
      };
    });
  };

  const handleBack = () => router.push("/add-items/step-1");

  const handlePublish = async () => {
    const available_dates = buildAvailableDates();
    updateFormData({ available_dates });

    await createProduct({ ...formData, available_dates });
    resetFormData();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/add-items/step-1" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
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
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-rounded text-base">check</span>
              </div>
              <span className="text-xs font-bold text-primary">المعلومات</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary mx-2 mb-4"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs font-bold text-primary">الوقت والإتاحة</span>
            </div>
          </div>

          <div className="space-y-4 text-right">

            {/* الكاليندر */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <span className="material-symbols-rounded text-primary text-sm">calendar_month</span>
                أولاً: اختر أيام التوفر من التقويم
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
                    const isSelected = selectedDates.includes(isoDate);
                    return (
                      <button
                        key={isoDate}
                        type="button"
                        onClick={() => toggleSelectDay(isoDate)}
                        className={`aspect-square rounded-full text-xs font-bold transition-all ${
                          isSelected ? "bg-primary text-white" : "bg-primary-light text-gray-700 hover:bg-primary/20"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* خيارات الإتاحة */}
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
                      <span className="text-xs font-bold text-gray-700">متاح خلال هذه الساعات في كل الأيام المختارة</span>
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

            {/* ملاحظة تنبيهية */}
            <div className="bg-amber-50 border-r-4 border-amber-400 rounded-xl p-3 flex items-start gap-2">
              <span className="material-symbols-rounded text-amber-500 text-base">info</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>ملاحظة هامة:</strong> المنتج سيكون متاحاً للاستئجار لمدة شهر واحد فقط من تاريخ النشر. بعد انتهاء الشهر، سيتعين عليك تحديث وقت الإتاحة من صفحة تعديل المنتج.
              </p>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 rounded-btn bg-gray-50 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded text-base">arrow_forward</span>
                رجوع
              </button>
              <button
                type="button"
                disabled={!isAvailabilityComplete}
                onClick={handlePublish}
                className="flex-[2] py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-rounded text-base">cloud_upload</span>
                حفظ ونشر المنتج
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}