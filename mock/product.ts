import { PublicProduct } from "@/types/product";
import { PRODUCTS_DATA } from "@/mock/productsData";

export const mockProducts: PublicProduct[] = PRODUCTS_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  governorate: p.governorate,
  district: p.district,
  price_per_hour: p.price_per_hour,
  icon: p.icon,
  image_url: p.images[0],
  status: p.status,
}));