import { ProductDetails } from "@/types/product";
import { PRODUCTS_DATA } from "@/mock/productsData";

export const mockProductDetails: Record<number, ProductDetails> = Object.fromEntries(
  PRODUCTS_DATA.map((p) => [
    p.id,
    {
      id: p.id,
      title: p.title,
      category: p.category,
      price_per_hour: p.price_per_hour,
      status: p.status,
      description: p.description,
      deposit_amount: p.deposit_amount,
      governorate: p.governorate,
      district: p.district,
      owner_full_name: p.owner_full_name,
      owner_identity_status: p.owner_identity_status,
      product_images: p.images,
      available_dates: p.available_dates,
    },
  ])
);