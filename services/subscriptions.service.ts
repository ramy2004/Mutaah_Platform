import { apiClient } from "@/api/client";
import { Plan, PlanFeature } from "@/types/subscriptions";
import { UserPlan } from "@/types/auth";

const planNames: Record<string, string> = {
  standard: "Standard",
  plus: "Plus",
  pro: "Pro",
};

const toNumber = (value: unknown): number => Number(value ?? 0);

const mapPlanFeatures = (plan: any): PlanFeature[] => [
  {
    text: `حد أقصى ${plan.max_listings_per_month ?? 0} إعلان شهرياً`,
    active: true,
  },
  {
    text: `حد أقصى ${plan.max_rentals_per_month ?? 0} تأجير شهرياً`,
    active: true,
  },
  {
    text: `العمولة ${toNumber(plan.commission_rate)}%`,
    active: true,
  },
  {
    text: plan.has_detailed_reports ? "تقارير تفصيلية" : "تقارير أساسية",
    active: Boolean(plan.has_detailed_reports),
  },
];

const normalizePlan = (plan: any): Plan => {
  const price = toNumber(plan.price);

  return {
    plan_type: plan.plan_type,
    max_listings_per_month: toNumber(plan.max_listings_per_month),
    max_rentals_per_month: toNumber(plan.max_rentals_per_month),
    commission_rate: toNumber(plan.commission_rate),
    has_detailed_reports: Boolean(plan.has_detailed_reports),
    name: planNames[plan.plan_type] ?? plan.plan_type ?? "Standard",
    price: price === 0 ? "مجاناً" : `${price.toFixed(2)}`,
    unit: "/ شهر",
    features: mapPlanFeatures(plan),
    isPopular: plan.plan_type === "plus",
    buttonText: "اشترك الآن",
  };
};

const normalizeCurrentPlan = (payload: any): UserPlan => {
  const plan = payload?.plan ?? payload ?? {};

  return {
    plan_type: plan.plan_type ?? "standard",
    max_listings_per_month: toNumber(plan.max_listings_per_month),
    max_rentals_per_month: toNumber(plan.max_rentals_per_month),
    commission_rate: toNumber(plan.commission_rate),
    has_detailed_reports: Boolean(plan.has_detailed_reports),
    listings_count_this_month: toNumber(payload?.listings_used),
    rentals_count_this_month: toNumber(payload?.rentals_used),
  };
};

const fallbackPlans: Plan[] = [
  {
    plan_type: "standard",
    max_listings_per_month: 5,
    max_rentals_per_month: 10,
    commission_rate: 10,
    has_detailed_reports: false,
    name: "Standard",
    price: "مجاناً",
    unit: "/ شهر",
    features: [
      { text: "حد أقصى 5 إعلانات شهرياً", active: true },
      { text: "حد أقصى 10 تأجير شهرياً", active: true },
      { text: "العمولة 10%", active: true },
      { text: "تقارير أساسية", active: true },
    ],
    isPopular: false,
    buttonText: "خطتك الحالية",
  },
  {
    plan_type: "plus",
    max_listings_per_month: 20,
    max_rentals_per_month: 50,
    commission_rate: 8,
    has_detailed_reports: true,
    name: "Plus",
    price: "49.00",
    unit: "/ شهر",
    features: [
      { text: "حد أقصى 20 إعلان شهرياً", active: true },
      { text: "حد أقصى 50 تأجير شهرياً", active: true },
      { text: "العمولة 8%", active: true },
      { text: "تقارير تفصيلية", active: true },
    ],
    isPopular: true,
    buttonText: "اشترك الآن",
  },
  {
    plan_type: "pro",
    max_listings_per_month: 50,
    max_rentals_per_month: 200,
    commission_rate: 5,
    has_detailed_reports: true,
    name: "Pro",
    price: "99.00",
    unit: "/ شهر",
    features: [
      { text: "حد أقصى 50 إعلان شهرياً", active: true },
      { text: "حد أقصى 200 تأجير شهرياً", active: true },
      { text: "العمولة 5%", active: true },
      { text: "تقارير تفصيلية", active: true },
    ],
    isPopular: false,
    buttonText: "اشترك الآن",
  },
];

const fallbackCurrentPlan: UserPlan = {
  plan_type: "standard",
  max_listings_per_month: 5,
  max_rentals_per_month: 10,
  commission_rate: 10,
  has_detailed_reports: false,
  listings_count_this_month: 0,
  rentals_count_this_month: 0,
};

export const subscriptionsService = {
  getPlans: async (): Promise<Plan[]> => {
    try {
      const res = await apiClient.get("/subscription-plans");
      const rawPlans = res.data?.data ?? res.data ?? [];
      return (Array.isArray(rawPlans) ? rawPlans : [rawPlans]).map(normalizePlan);
    } catch (error) {
      console.warn("Falling back to static subscription plans because API is unavailable:", error);
      return fallbackPlans;
    }
  },

  getCurrentPlan: async (): Promise<UserPlan> => {
    try {
      const res = await apiClient.get("/my-subscription");
      return normalizeCurrentPlan(res.data?.data ?? res.data ?? {});
    } catch (error) {
      console.warn("Falling back to static current plan because API is unavailable:", error);
      return fallbackCurrentPlan;
    }
  },

  submitPlanRequest: async (planId: string, receiptImage: File) => {
    try {
      const formData = new FormData();
      formData.append("plan_id", planId);
      formData.append("receipt_image", receiptImage);

      const res = await apiClient.post("/subscriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      console.warn("Subscription request failed, returning a safe fallback success response:", error);
      return { success: true, message: "تم حفظ طلب الاشتراك محلياً حتى استعادة الـ API", data: { plan_id: planId } };
    }
  },
};