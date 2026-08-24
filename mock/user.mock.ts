import { UserProfile ,UserPlan, UserStats ,FinancialSummary } from "@/types/auth";

export const mockUser: UserProfile = {
   id: 1,                    
  full_name: "أحمد سالم",
  username: "ahmed_salem",
  email: "ahmed@email.com",
  phone: "0599123456",
  governorate: "غزة",
  district: "الرمال",
  avatar: "",
  identity_status: "rejected",
}

export const mockUserStats: UserStats = {
  products_count: 5,
  rentals_count: 17,
}

export const mockFinancialSummary: FinancialSummary = {
  rental_price_total: 1240,
  deposit_amount: 300,
}
// mock/user.mock.ts
export const mockUserPlan: UserPlan = {
  plan_type: "standard",
  max_listings_per_month: 1,
  max_rentals_per_month: 5,
  commission_rate: 10,
  has_detailed_reports: false,
  listings_count_this_month: 0,
  rentals_count_this_month: 0,
};