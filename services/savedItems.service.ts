import { apiClient } from "@/api/client";

export const savedItemsService = {
  list: async () => {
    const res = await apiClient.get("/saved-items");
    return res.data?.data ?? res.data ?? [];
  },

  save: async (productId: string) => {
    const res = await apiClient.post("/saved-items", { product_id: productId });
    return res.data?.data ?? res.data;
  },

  remove: async (productId: string) => {
    const res = await apiClient.delete(`/saved-items/${productId}`);
    return res.data;
  },

  toggle: async (productId: string) => {
    const res = await apiClient.post(`/products/${productId}/toggle-save`);
    return res.data;
  },
};
