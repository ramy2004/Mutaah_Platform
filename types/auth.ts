import { PlanLimits } from "@/types/subscriptions";

export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginErrors {
  identifier?: string;
  password?: string;
}

export interface RegisterFormData {
  full_name: string;
  username: string;
  email: string;
  governorate: string;
  district: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface RegisterErrors {
  full_name?: string;
  username?: string;
  email?: string;
  governorate?: string;
  district?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}
 export interface UserProfile {
  id: number;              // ⭐ جديد — للربط مع owner_id بالمنتجات وتمييز اليوزرز عن بعض
  full_name: string;
  username: string;
  email: string; 
  phone?: string; 
  governorate: string;
  district: string;
  avatar?: string;
  identity_status?: "pending" | "accepted" | "rejected";
}
export interface ProfileErrors {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  governorate?: string;
  district?: string;
}
export interface UserStats {
  products_count: number;
  rentals_count: number;
}

export interface FinancialSummary {
  rental_price_total: number;
  deposit_amount: number;
}

export interface UserPlan extends PlanLimits {
  listings_count_this_month: number;
  rentals_count_this_month: number;
}