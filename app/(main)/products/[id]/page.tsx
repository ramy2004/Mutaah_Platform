"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product.service";
import { queryKeys } from "@/api/queryKeys";
import { useFavorites } from "@/context/FavoritesContext";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, HOUR_NUMBERS, PERIODS, from24Hour, isTimeComplete } from "@/utils/time";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { useNotifications } from "@/context/NotificationsContext";
import RentalRequestModal from "@/components/RentalRequestModal";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = String(params.id);
  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
  });
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const { profile } = useUserProfile();
  const { addNotification } = useNotifications();
  const isVerified = profile?.identity_status === "accepted";
  const [activeImage, setActiveImage] = useState(0);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isFullDayBooking, setIsFullDayBooking] = useState(false);
  const [sameHoursForAllDays, setSameHoursForAllDays] = useState(false);

  const [sharedStart, setSharedStart] = useState<TimeValue>({ hour: null, period: null });
  const [sharedEnd, setSharedEnd] = useState<TimeValue>({ hour: null, period: null });

  const [perDaySlots, setPerDaySlots] = useState<Record<string, { start: TimeValue; end: TimeValue }>>({});

  const availableByDate = useMemo(
    () => new Map(product?.available_dates.map((d) => [d.date, d]) ?? []),
    [product]
  );

  // كل ساعة-فترة مسموحة ضمن تقاطع الأيام المختارة (لـ "نفس الساعات لكل الأيام")
  const intersectionAllowedHours = useMemo(() => {
    if (selectedDates.length === 0) return [];
    const ranges = selectedDates
      .map((date) => availableByDate.get(date))
      .filter((d) => d && !d.is_all_day) as { start_time: string; end_time: string }[];

    if (ranges.length === 0) {
      return HOUR_NUMBERS.flatMap((h) => PERIODS.map((p) => ({ hour: h, period: p.value as "ص" | "م" })));
    }

    const latestStart = ranges.reduce((max, r) => (r.start_time > max ? r.start_time : max), "00:00");
    const earliestEnd = ranges.reduce((min, r) => (r.end_time < min ? r.end_time : min), "23:59");

    if (latestStart >= earliestEnd) return [];

    const result: { hour: number; period: "ص" | "م" }[] = [];
    for (let h = 0; h < 24; h++) {
      const time24 = `${String(h).padStart(2, "0")}:00`;
      if (time24 >= latestStart && time24 <= earliestEnd) {
        result.push(from24Hour(time24));
      }
    }
    return result;
  }, [selectedDates, availableByDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">جارِ تحميل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">المنتج غير موجود</p>
      </div>
    );
  }

  const hasTimeConflict = selectedDates.length > 1 && intersectionAllowedHours.length === 0;
  const allSelectedDaysAreFullDay = selectedDates.every((d) => availableByDate.get(d)?.is_all_day);

  const getAllowedHoursForDay = (date: string) => {
  const availability = availableByDate.get(date);
    if (!availability || availability.is_all_day) {
      return HOUR_NUMBERS.flatMap((h) => PERIODS.map((p) => ({ hour: h, period: p.value as "ص" | "م" })));
    }
  const result: { hour: number; period: "ص" | "م" }[] = [];
    for (let h = 0; h < 24; h++) {
  const time24 = `${String(h).padStart(2, "0")}:00`;
      if (time24 >= availability.start_time && time24 <= availability.end_time) {
        result.push(from24Hour(time24));
      }
    }
    return result;
  };

  const handlePrevImage = () => setActiveImage((prev) => (prev === 0 ? product.product_images.length - 1 : prev - 1));
  const handleNextImage = () => setActiveImage((prev) => (prev === product.product_images.length - 1 ? 0 : prev + 1));

  const toggleSelectDay = (isoDate: string) => {
  const availability = availableByDate.get(isoDate);
    if (!availability || availability.is_booked) return;

    setSelectedDates((prev) =>
      prev.includes(isoDate) ? prev.filter((d) => d !== isoDate) : [...prev, isoDate]
    );
    setIsFullDayBooking(false);
    setSameHoursForAllDays(false);
    setSharedStart({ hour: null, period: null });
    setSharedEnd({ hour: null, period: null });
    setPerDaySlots({});
  };


  const isBookingComplete =
    selectedDates.length > 0 &&
    (isFullDayBooking ||
      allSelectedDaysAreFullDay ||
      (sameHoursForAllDays && isTimeComplete(sharedStart) && isTimeComplete(sharedEnd)) ||
      (!sameHoursForAllDays &&
        selectedDates.every(
          (d) =>
            availableByDate.get(d)?.is_all_day ||
            (isTimeComplete(perDaySlots[d]?.start || { hour: null, period: null }) &&
              isTimeComplete(perDaySlots[d]?.end || { hour: null, period: null }))
        )));

  const year = 2025;
  const monthIndex = 4;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();

  const calendarCells: { day: number; isoDate: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ day: d, isoDate });
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-xs text-gray-400 hidden md:block">
            <span className="text-primary cursor-pointer">الرئيسية</span> / {product.category} / {product.title}
          </div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-5xl mx-auto w-full p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* العمود اليسار: الصور */}
          <div>
            <div className="relative bg-white rounded-card border border-gray-100 h-72 flex items-center justify-center overflow-hidden mb-3">
              <img
  src={product.product_images[activeImage]}
  alt={product.title}
  className="w-full h-full object-contain p-2"
/>

              <button type="button" onClick={() => toggleFavorite(product.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-rounded text-lg"
                  style={{ fontVariationSettings: `'FILL' ${isFavorite(product.id) ? 1 : 0}`, color: isFavorite(product.id) ? "#ef4444" : "#d1d5db" }}
                >
                  favorite
                </span>
              </button>

              <span className="absolute top-3 right-3 text-xs font-bold text-primary bg-white px-3 py-1 rounded-full shadow-sm">متاح</span>

              {product.product_images.length > 1 && (
                <>
                  <button type="button" onClick={handlePrevImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-rounded text-lg">chevron_right</span>
                  </button>
                  <button type="button" onClick={handleNextImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-rounded text-lg">chevron_left</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {product.product_images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${activeImage === i ? "w-6 bg-primary" : "w-1.5 bg-gray-200"}`}></span>
              ))}
            </div>
          </div>

          {/* العمود اليمين */}
          <div className="space-y-3 text-right">

            <div className="bg-white rounded-card border border-gray-100 p-5 space-y-3">
              <h1 className="text-lg font-black text-gray-800">{product.title}</h1>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                <span className="material-symbols-rounded text-xs">sell</span>
                {product.category}
              </span>

              <div className="flex items-center gap-2 pt-1">
                <div className="w-9 h-9 rounded-full bg-primary-light border-2 border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary text-base">person</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{product.owner_full_name}</p>
                  {product.owner_identity_status === "accepted" && (
                    <p className="text-xs text-primary flex items-center gap-0.5">
                      <span className="material-symbols-rounded text-xs">verified</span> موثق
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div>
                <span className="text-2xl font-black text-primary">₪ {product.price_per_hour}</span>
                <span className="text-xs text-gray-400"> / ساعة</span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="material-symbols-rounded text-orange-500 text-sm">lock</span>
                رهن التأمين: <strong className="text-orange-500">₪ {product.deposit_amount}</strong> — محتجز حتى الاسترداد
              </p>

              <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
            </div>

            {!isVerified && (
  <div className="bg-orange-50 border border-orange-100 rounded-card p-4 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span className="material-symbols-rounded text-orange-500 text-xl">security</span>
      <p className="text-xs font-bold text-orange-600">لازم توثّق هويتك أولاً قبل الاستئجار</p>
    </div>
    <Link
      href={`/verify-identity?next=/products/${product.id}`}
      className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap hover:brightness-105 transition-all"
    >
      وثّق الآن
    </Link>
  </div>
)}

            {/* الكاليندر */}
            <div className="bg-white rounded-card border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-gray-800 flex items-center gap-1">
                  <span className="material-symbols-rounded text-primary text-sm">calendar_today</span>
                  اختر أيام الاستئجار
                </h3>
                <span className="text-xs text-gray-400">{MONTH_NAMES[monthIndex]} {year}</span>
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
                  const isAvailable = !!availability && !availability.is_booked;
                  const isBooked = !!availability?.is_booked;
                  const isSelected = selectedDates.includes(isoDate);

                  let cellClass = "text-gray-300 cursor-not-allowed";
                  if (isSelected) cellClass = "bg-primary text-white";
                  else if (isBooked) cellClass = "bg-gray-100 text-gray-400 line-through cursor-not-allowed";
                  else if (isAvailable) cellClass = "bg-primary-light text-gray-700 hover:bg-primary/20";

                  return (
                    <button
                      key={isoDate}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => toggleSelectDay(isoDate)}
                      className={`aspect-square rounded-full text-xs font-bold transition-all ${cellClass}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary-light border border-primary"></span> متاح</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> مختار</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200"></span> غير متاح</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> محجوز</span>
              </div>
            </div>

            {/* خيارات الحجز */}
            {selectedDates.length > 0 && (
              <div className="bg-white rounded-card border border-gray-100 p-4 space-y-3">

                {!allSelectedDaysAreFullDay && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFullDayBooking}
                      onChange={(e) => {
                        setIsFullDayBooking(e.target.checked);
                        setSameHoursForAllDays(false);
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-xs font-bold text-gray-700">حجز خلال جميع ساعات الأيام المختارة (24 ساعة)</span>
                  </label>
                )}

                {!isFullDayBooking && !allSelectedDaysAreFullDay && (
                  <>
                    {hasTimeConflict ? (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-500 font-bold flex items-center gap-1.5">
                        <span className="material-symbols-rounded text-sm">error</span>
                        لا يمكن استخدام نفس الساعات لهذه الأيام — لا يوجد تقاطع بساعات الإتاحة بينها
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-400 font-bold">ساعة البداية</p>
                        <HourPeriodSelect value={sharedStart} onChange={setSharedStart} allowedHours={intersectionAllowedHours} />

                        <p className="text-xs text-gray-400 font-bold">ساعة النهاية</p>
                        <HourPeriodSelect value={sharedEnd} onChange={setSharedEnd} allowedHours={intersectionAllowedHours} />

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={sameHoursForAllDays}
                            onChange={(e) => setSameHoursForAllDays(e.target.checked)}
                            disabled={!isTimeComplete(sharedStart) || !isTimeComplete(sharedEnd)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-xs font-bold text-gray-700">حجز هذه الساعات في جميع الأيام المختارة</span>
                        </label>
                      </>
                    )}
                  </>
                )}

                {!isFullDayBooking && !sameHoursForAllDays && !hasTimeConflict && !allSelectedDaysAreFullDay && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-700">أو حدد ساعات كل يوم على حدة:</p>
                    {selectedDates.map((date) => {
                      const availability = availableByDate.get(date);
                      if (availability?.is_all_day) return null;
                      const allowedHours = getAllowedHoursForDay(date);
                      const daySlot = perDaySlots[date] || { start: { hour: null, period: null }, end: { hour: null, period: null } };

                      return (
                        <div key={date} className="border border-gray-100 rounded-lg p-2.5 space-y-2">
                          <p className="text-xs font-bold text-gray-700">{date}</p>

                          <p className="text-xs text-gray-400 font-bold">من الساعة</p>
                          <HourPeriodSelect
                            value={daySlot.start}
                            onChange={(val) =>
                              setPerDaySlots((prev) => ({ ...prev, [date]: { ...daySlot, start: val } }))
                            }
                            allowedHours={allowedHours}
                          />

                          <p className="text-xs text-gray-400 font-bold">إلى الساعة</p>
                          <HourPeriodSelect
                            value={daySlot.end}
                            onChange={(val) =>
                              setPerDaySlots((prev) => ({ ...prev, [date]: { ...daySlot, end: val } }))
                            }
                            allowedHours={allowedHours}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            <button
  type="button"
  disabled={!isBookingComplete}
 onClick={() => {
  if (!isVerified) {
    router.push(`/verify-identity?next=/products/${product.id}`);
    return;
  }
  addNotification({
    title: "تم قبول طلبك!",
    message: `وافق ${product.owner_full_name} على طلب استئجار "${product.title}"`,
    time: "الآن",
    is_read: false,
    icon: "check_circle",
    color: "primary",
    actionLabel: "اضغط هنا لاستكمال عملية الإيجار",
    type: "rental_status",
    ref_id: product.id,
  });
  setIsRequestModalOpen(true);
}}
  className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
>
  <span className="material-symbols-rounded text-lg">handshake</span>
  طلب استئجار
</button>

          </div>

         </div>
      </main>

      <RentalRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}