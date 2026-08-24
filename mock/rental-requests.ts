import { RentalRequest } from "@/types/rental";

export const MOCK_RENTAL_REQUESTS: RentalRequest[] = [
  {
    id: 1,
    product_title: "كاميرا سوني A7 III",
    renter_name: "أحمد محمد",
    start_time: "13 مايو، 10 ص",
    end_time: "13 مايو، 1 م",
    total_price: 75,
    category: "electronics",
    owner_status: 'pending'
  },
  {
    id: 2,
    product_title: "مثقاب بوش كهربائي",
    renter_name: "سمر خالد",
    start_time: "14 مايو، 9 ص",
    end_time: "14 مايو، 5 م",
    total_price: 80,
    category: "tools",
    owner_status: 'pending'
  }
];