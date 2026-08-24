export type PlanType = "standard" | "plus" | "pro";
export interface PlanFeature {
  text: string;
  active: boolean;
}

// الحقول المشتركة بين تعريف الخطة واستهلاك اليوزر لها
export interface PlanLimits {
  plan_type: PlanType;
  max_listings_per_month: number;
  max_rentals_per_month: number;
  commission_rate: number;
  has_detailed_reports: boolean;
}

export interface Plan extends PlanLimits {
  name: string;
  price: string;
  unit: string;
  features: PlanFeature[];
  isPopular: boolean;
  buttonText: string;
}