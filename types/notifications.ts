import { ProductId } from "./product";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  is_read: boolean;
  icon: string;
  type: "rental_status" | "payment_update" | "identity_verification" | "plan_expired";
  ref_id: ProductId;
  color?: "primary" | "orange" | "green";
  hasActions?: boolean;
  actionLabel?: string;
} 