"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import UserDropdown from "@/components/UserDropdown";
import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptions.service";
import { queryKeys } from "@/api/queryKeys";
import { PlanType } from "@/types/subscriptions";

export default function SubscriptionsPage() {
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: queryKeys.plans,
    queryFn: subscriptionsService.getPlans,
  });

  const { data: currentPlan, isLoading: isLoadingCurrentPlan } = useQuery({
    queryKey: queryKeys.currentPlan,
    queryFn: subscriptionsService.getCurrentPlan,
  });

  const getButtonText = (planType: PlanType) => {
    if (planType === currentPlan?.plan_type) return "خطتك الحالية";
    if (planType === "standard") return "العودة لهذه الخطة";
    return "اشترك الآن";
  };

  if (isLoadingPlans || isLoadingCurrentPlan || !plans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <div className="text-gray-400 text-sm font-bold">جارِ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* الهيدر */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 bg-white sticky top-0 z-[100]">
        <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
          <span className="material-symbols-rounded text-lg">arrow_forward</span>
        </Link>
        <div className="text-lg font-black text-gray-800">الاشتراكات</div>
        <div className="flex-1 flex justify-center">
          <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
        </div>
        <div className="flex items-center gap-3">
          <UserDropdown align="left" />
        </div>
      </header>

      <main className="grow flex flex-col p-4 md:p-6">

        <section className="bg-primary-light rounded-card py-8 px-4 md:px-10 text-center max-w-6xl mx-auto w-full shadow-sm">

          <div className="max-w-xl mx-auto mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-1">اختر خطتك</h1>
            <p className="text-gray-500 text-xs font-medium">جميع الخطط تشمل الوصول الكامل للمنصة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto items-stretch">
            {plans.map((plan, index) => {
              const isCurrent = plan.plan_type === currentPlan?.plan_type;
              const isPlus = plan.plan_type === "plus";
              const isPro = plan.plan_type === "pro";

              return (
                <div
                  key={plan.plan_type || index}
                  className={`relative bg-white p-6 rounded-container flex flex-col transition-all duration-500 hover:shadow-xl ${
                    isPlus || isPro
                      ? "border-2 border-primary shadow-lg scale-105 z-10"
                      : "border border-gray-100 shadow-sm"
                  }`}
                >
                  {/* شارة الأكثر شيوعاً — على البلس */}
                  {isPlus && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-green-harvest text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                      الأكثر شيوعاً ⭐
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <span className={`text-xs font-black tracking-wider uppercase ${isPro ? "text-primary" : "text-gray-400"}`}>
                      {plan.name}
                    </span>
                    <div className="mt-3 flex flex-col items-center">
                      <span className="text-3xl font-black text-gray-800 leading-none">
                        {plan.price !== "مجاناً" && "₪"}{plan.price}
                      </span>
                      {plan.unit && <span className="text-xs text-gray-400 font-bold mt-1">{plan.unit}</span>}
                    </div>
                  </div>

                  {/* الميزات */}
                  <div className="flex flex-col gap-3 mb-8 text-right grow">
                    {plan.features.map((feature, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs ${feature.active ? "text-gray-600" : "text-gray-300"}`}>
                        <span className={`material-symbols-rounded text-base ${feature.active ? "text-green-500" : "text-gray-200"}`}>
                          {feature.active ? "check_circle" : "cancel"}
                        </span>
                        <span className="font-medium line-clamp-1">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* الزر */}
                  <button
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                      isCurrent
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                        : "bg-linear-to-r from-primary to-green-harvest text-white shadow-md hover:brightness-105"
                    }`}
                  >
                    {getButtonText(plan.plan_type)}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-gray-400 text-xs font-medium italic">
            جميع الاشتراكات تجدد شهرياً بشكل تلقائي
          </p>
        </section>
      </main>
 <Footer />
    </div>
  );
}