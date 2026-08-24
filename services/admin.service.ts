import { apiClient } from "@/api/client";
import type { AdminDashboardResponse } from "@/types/admin";

const defaultDashboard: AdminDashboardResponse = {
  stats: {
    users_count: 0,
    active_products_count: 0,
    pending_rental_requests_count: 0,
    pending_payments_count: 0,
    pending_subscriptions_count: 0,
    active_subscriptions_count: 0,
    manual_identity_reviews_count: 0,
  },
  recent_rental_requests: [],
  pending_payments: [],
  identity_reviews: [],
  pending_subscriptions: [],
};

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardResponse> => {
    try {
      const res = await apiClient.get("/admin/dashboard");
      const payload = res.data?.data ?? res.data ?? {};

      return {
        stats: {
          users_count: Number(payload?.stats?.users_count ?? 0),
          active_products_count: Number(payload?.stats?.active_products_count ?? 0),
          pending_rental_requests_count: Number(payload?.stats?.pending_rental_requests_count ?? 0),
          pending_payments_count: Number(payload?.stats?.pending_payments_count ?? 0),
          pending_subscriptions_count: Number(payload?.stats?.pending_subscriptions_count ?? 0),
          active_subscriptions_count: Number(payload?.stats?.active_subscriptions_count ?? 0),
          manual_identity_reviews_count: Number(payload?.stats?.manual_identity_reviews_count ?? 0),
        },
        recent_rental_requests: Array.isArray(payload?.recent_rental_requests)
          ? payload.recent_rental_requests
          : [],
        pending_payments: Array.isArray(payload?.pending_payments)
          ? payload.pending_payments
          : [],
        identity_reviews: Array.isArray(payload?.identity_reviews)
          ? payload.identity_reviews
          : [],
        pending_subscriptions: Array.isArray(payload?.pending_subscriptions)
          ? payload.pending_subscriptions
          : [],
      };
    } catch (error) {
      console.warn("Falling back to empty admin dashboard because the API failed:", error);
      return defaultDashboard;
    }
  },
};
