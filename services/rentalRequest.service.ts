import { apiClient } from "@/api/client";

export interface CreateRentalRequestPayload {
  product_id: string;
  start_time: string;
  end_time: string;
}

export const rentalRequestService = {
  listMine: async () => {
    const res = await apiClient.get("/rental-requests");
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  listRelated: async () => {
    const res = await apiClient.get("/rental-requests/my");
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  create: async (payload: CreateRentalRequestPayload) => {
    const res = await apiClient.post("/rental-requests", payload);
    return res.data?.data ?? res.data;
  },

  updateStatus: async (id: string | number, status: "accepted" | "rejected") => {
    const res = await apiClient.patch(`/rental-requests/${id}/status`, { status });
    return res.data?.data ?? res.data;
  },

  cancel: async (id: string | number, reason: string) => {
    const res = await apiClient.patch(`/rental-requests/${id}/cancel`, { reason });
    return res.data?.data ?? res.data;
  },
};
