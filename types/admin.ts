export interface AdminDashboardStats {
  users_count: number;
  active_products_count: number;
  pending_rental_requests_count: number;
  pending_payments_count: number;
  pending_subscriptions_count: number;
  active_subscriptions_count: number;
  manual_identity_reviews_count: number;
}

export interface AdminDashboardItem {
  id?: number | string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  owner_status?: string;
  payment_status?: string;
  expires_at?: string;
  amount?: number | string;
  total_amount?: number | string;
  receipt_amount?: number | string;
  plan?: {
    name?: string;
    title?: string;
    plan_type?: string;
  };
  user?: {
    id?: number | string;
    full_name?: string;
    name?: string;
    username?: string;
  };
  renter?: {
    id?: number | string;
    full_name?: string;
    name?: string;
    username?: string;
  };
  payer?: {
    id?: number | string;
    full_name?: string;
    name?: string;
    username?: string;
  };
  product?: {
    id?: number | string;
    title?: string;
    name?: string;
  };
  rental?: {
    product?: {
      title?: string;
      name?: string;
    };
  };
  [key: string]: unknown;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recent_rental_requests: AdminDashboardItem[];
  pending_payments: AdminDashboardItem[];
  identity_reviews: AdminDashboardItem[];
  pending_subscriptions: AdminDashboardItem[];
}
