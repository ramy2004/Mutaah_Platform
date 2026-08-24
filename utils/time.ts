export interface TimeValue {
  hour: number | null;
  period: "ص" | "م" | null;
}

export const HOUR_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1); // [1..12]

export const PERIODS = [
  { value: "ص", label: "صباحاً" },
  { value: "م", label: "مساءً" },
] as const;

// يحول (ساعة 1-12 + فترة) إلى صيغة 24 ساعة "HH:00" للمقارنة بالـ availability
export function to24Hour(hour12: number, period: "ص" | "م"): string {
  let hour24 = hour12 % 12;
  if (period === "م") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:00`;
}

// يحول صيغة 24 ساعة "HH:00" إلى { hour12, period }
export function from24Hour(time24: string): { hour: number; period: "ص" | "م" } {
  const hour24 = parseInt(time24.split(":")[0], 10);
  const period: "ص" | "م" = hour24 >= 12 ? "م" : "ص";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour: hour12, period };
}

export function isTimeComplete(t: TimeValue): boolean {
  return t.hour !== null && t.period !== null;
}

// كل الساعات الممكنة بدون أي قيود إتاحة (1-12 × ص/م) — تستخدم عند عدم وجود availability سابقة (مثل صفحة الإضافة)
export function getAllHours(): { hour: number; period: "ص" | "م" }[] {
  return HOUR_NUMBERS.flatMap((h) => PERIODS.map((p) => ({ hour: h, period: p.value as "ص" | "م" })));
}