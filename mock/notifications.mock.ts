 import { Notification } from "@/types/notifications";

 export const mockNotifications: Notification[] = [

    { id: 1, title: "طلب استئجار جديد", message: 'أحمد محمد يريد استئجار "كاميرا سوني A7 III"', time: "منذ 5 د", is_read: false, icon: "inventory_2", color: "primary", hasActions: true, type: "rental_status", ref_id: 1},
    { id: 2, title: "تم استلام مبلغ الرهن", message: "تم احتجاز ₪ 300 داخل المنصة بنجاح", time: "منذ 1 س", is_read: false, icon: "lock", color: "orange" , type: "payment_update", ref_id: 2  },
    { id: 3, title: "تم إعادة المنتج بسلامة", message: 'أعادت سمر خالد "مثقاب بوش"', time: "أمس", is_read: true, icon: "move_to_inbox", color: "green" , type: "rental_status", ref_id: 3},
    { id: 4, title: "تم قبول طلبك!", message: 'وافق أحمد على طلب استئجار "كاميرا سوني A7 III"', time: "3 أيام", is_read: true, icon: "check_circle", color: "primary", actionLabel: "اضغط هنا لاستكمال عملية الإيجار" , type: "rental_status", ref_id: 4  },
  ];