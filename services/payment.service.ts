import { apiClient } from "@/api/client";

export const paymentService = {
  list: async () => {
    const res = await apiClient.get("/payments");
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  submit: async (formData: FormData) => {
    const res = await apiClient.post("/payments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  adminList: async () => {
    const res = await apiClient.get("/admin/payments");
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  verify: async (paymentId: string | number) => {
    const res = await apiClient.patch(`/admin/payments/${paymentId}/verify`);
    return res.data?.data ?? res.data;
  },

  reject: async (paymentId: string | number) => {
    const res = await apiClient.patch(`/admin/payments/${paymentId}/reject`);
    return res.data?.data ?? res.data;
  },
};
