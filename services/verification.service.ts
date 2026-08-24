import { apiClient } from "@/api/client";

export const verificationService = {
  submit: async (formData: FormData) => {
    const res = await apiClient.post("/identity-verifications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  current: async () => {
    const res = await apiClient.get("/identity-verifications/current");
    return res.data?.data ?? res.data ?? null;
  },

  adminList: async (status?: string) => {
    const url = status ? `/admin/identity-verifications?status=${status}` : "/admin/identity-verifications";
    const res = await apiClient.get(url);
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  approve: async (verificationId: string | number) => {
    const res = await apiClient.patch(`/admin/identity-verifications/${verificationId}/approve`);
    return res.data?.data ?? res.data;
  },

  reject: async (verificationId: string | number, adminNote?: string) => {
    const res = await apiClient.patch(`/admin/identity-verifications/${verificationId}/reject`, {
      admin_note: adminNote ?? "",
    });
    return res.data?.data ?? res.data;
  },
};
