"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { notificationsService } from "@/services/notifications.service";
import { Notification } from "@/types/notifications";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, "id">) => void;
  markAllRead: () => void;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const mapApiNotification = (item: any): Notification => {
  const type = item.type ?? "rental_status";
  const iconMap: Record<string, string> = {
    rental_status: "notifications_active",
    payment_update: "payments",
    identity_verification: "verified_user",
    plan_expired: "warning",
  };

  const colorMap: Record<string, "primary" | "orange" | "green"> = {
    rental_status: "primary",
    payment_update: "orange",
    identity_verification: "green",
    plan_expired: "orange",
  };

  return {
    id: item.id,
    title: item.title ?? "إشعار",
    message: item.message ?? "",
    time: item.created_at ? new Date(item.created_at).toLocaleDateString("ar-EG", { day: "2-digit", month: "short" }) : "الآن",
    is_read: Boolean(item.is_read),
    icon: iconMap[type] ?? "notifications",
    type,
    ref_id: item.ref_id ?? item.id,
    color: colorMap[type] ?? "primary",
    hasActions: type === "rental_status",
    actionLabel: type === "rental_status" ? "عرض التفاصيل" : undefined,
  };
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationsService.list();
      const mapped = Array.isArray(response) ? response.map(mapApiNotification) : [];
      setNotifications(mapped);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const addNotification = (notif: Omit<Notification, "id">) => {
    setNotifications((prev) => [{ ...notif, id: Date.now() }, ...prev]);
  };

  const markAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, isLoading }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}