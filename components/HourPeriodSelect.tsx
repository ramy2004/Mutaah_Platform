"use client";
import { TimeValue } from "@/utils/time";

export default function HourPeriodSelect({
  value,
  onChange,
  allowedHours,
}: {
  value: TimeValue;
  onChange: (val: TimeValue) => void;
  allowedHours: { hour: number; period: "ص" | "م" }[];
}) {
  const availableHourNumbers = Array.from(new Set(allowedHours.map((h) => h.hour))).sort((a, b) => a - b);
  const availablePeriods = value.hour
    ? Array.from(new Set(allowedHours.filter((h) => h.hour === value.hour).map((h) => h.period)))
    : ["ص", "م"];

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative">
        <select
          value={value.hour ?? ""}
          onChange={(e) => onChange({ hour: Number(e.target.value), period: value.period })}
          className="w-full pr-3 pl-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all"
        >
          <option value="">الساعة</option>
          {availableHourNumbers.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span className="material-symbols-rounded absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">expand_more</span>
      </div>

      <div className="relative">
        <select
          value={value.period ?? ""}
          onChange={(e) => onChange({ hour: value.hour, period: e.target.value as "ص" | "م" })}
          disabled={!value.hour}
          className="w-full pr-3 pl-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all disabled:opacity-50"
        >
          <option value="">ص / م</option>
          {availablePeriods.map((p) => (
            <option key={p} value={p}>{p === "ص" ? "صباحاً" : "مساءً"}</option>
          ))}
        </select>
        <span className="material-symbols-rounded absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">expand_more</span>
      </div>
    </div>
  );
}