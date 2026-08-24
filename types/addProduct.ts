import { DayAvailability } from "@/types/product";

export interface AddProductStep1Data {
  title: string;
  category: string;
  description: string;
  price_per_hour: string;
  deposit_amount: string;
  product_images: File[];
}

// إعادة استخدام DayAvailability الموجودة أصلاً بـ types/product.ts بدل تكرار نفس الشكل
export type AvailabilityDate = DayAvailability;

export interface AddProductStep2Data {
  available_dates: AvailabilityDate[];
}

export type AddProductFormData = AddProductStep1Data & AddProductStep2Data;

export { PRODUCT_CATEGORIES } from "@/utils/productCategory";