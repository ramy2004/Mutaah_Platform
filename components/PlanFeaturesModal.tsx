"use client";
import Link from "next/link";
import { Plan } from "@/types/subscriptions";

interface PlanFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
}

export default function PlanFeaturesModal({ isOpen, onClose, plan }: PlanFeaturesModalProps) {
  if (!isOpen) return null;

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

        <div className="text-center mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-1">خطة {plan.name}</h2>
          <p className="text-gray-400 text-xs">
            {plan.price === "مجاناً" ? "مجاناً" : `₪${plan.price} ${plan.unit}`}
          </p>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-xs font-medium">
              <span className={`material-symbols-rounded text-base ${feature.active ? "text-primary" : "text-gray-300"}`}>
                {feature.active ? "check_circle" : "cancel"}
              </span>
              <span className={feature.active ? "text-gray-700" : "text-gray-400 line-through"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/subscriptions"
          className="w-full py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded text-lg">workspace_premium</span>
          ترقية الخطة الآن
        </Link>
      </div>
    </div>
  );
}