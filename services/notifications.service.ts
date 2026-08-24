import { apiClient } from "@/api/client";

export const notificationsService = {
  list: async () => {
    const res = await apiClient.get("/notifications");
    return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
  },

  unreadCount: async (): Promise<number> => {
    const res = await apiClient.get("/notifications/unread-count");
    return Number(res.data?.unread_count ?? res.data?.data?.unread_count ?? 0);
  },

  markAsRead: async (notificationId: string | number) => {
    const res = await apiClient.patch(`/notifications/${notificationId}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch("/notifications/read-all");
    return res.data;
  },
};
