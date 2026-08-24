import { MyProduct } from "@/types/product";
import { PRODUCTS_DATA } from "@/mock/productsData";

// ملاحظة: كل الـ 12 منتج معتبرين ملك نفس اليوزر الحالي، بغياب نظام users حقيقي لسا
export const MOCK_MY_PRODUCTS: MyProduct[] = PRODUCTS_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  price_per_hour: p.price_per_hour,
  status: p.status,
  deposit_amount: p.deposit_amount,
  rental_count: p.rental_count,
  rating: p.rating,
  expiry_date: p.expiry_date,
  is_currently_rented: p.is_currently_rented,
}));
