import { IdentityStatus } from "./verification";
export type ProductStatus = 'active' |  'frozen' | 'deleted' | 'pending';
export type ProductId = string | number;

export interface ApiProduct {
  id: string;
  title: string;
  category: string;
  price_per_hour: number;
  primary_image?: string | null;
  status: ProductStatus;
  is_available: boolean;
  description: string;
  deposit_amount: number;
  product_images: string[];
  available_dates: string[];
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  location: {
    governorate: string;
    district: string;
  };
  owner: {
    id: string;
    full_name: string;
    is_verified: boolean;
  };
}

// ===== الحقول المشتركة (مطابقة لجدول Products بالباك) =====
export interface BaseProduct {
  id: ProductId;
  title: string;
  category: string;
  price_per_hour: number;
  status: ProductStatus;
}

// ===== منتج للعرض العام (الداشبورد + المفضلة) =====
export interface PublicProduct extends BaseProduct {
  icon: string; // front-end only — يتحدد حسب category
  governorate: string;
  image_url?: string; // ⭐ جديد — أول صورة حقيقية، اختيارية (fallback للأيقونة لو غير موجودة)
  district: string;
  is_currently_rented?: boolean; // ⭐ جديد

}

export interface FavoriteProduct {
  id: ProductId;
  title: string;
  category: string;
  price_per_hour: number;
  owner_name: string;
}

// ===== منتج اليوزر بصفحة "إدارة عناصري" =====
export interface MyProduct extends BaseProduct {
  deposit_amount: number;
  rental_count: number;
  rating?: number;
  expiry_date?: string;
  is_currently_rented?: boolean; // ← جديد، محتسب من rental_requests

}

// ===== منتج مؤجر حالياً =====
export interface RentedItem extends MyProduct {
  renter_name: string;
  rental_end_date: string;
}

// ===== إحصائيات صفحة "إدارة عناصري" =====
export interface MyItemsStats {
  active_count: number;
  rented_count: number;
  favorites_count: number;
  pending_requests_count: number;
}
export interface DayAvailability {
  date: string; // ISO date "2025-05-01"
  start_time: string; // "08:00"
  end_time: string;   // "20:00"
  is_all_day: boolean;
  is_booked: boolean;
}

export interface ProductDetails extends BaseProduct {
  description: string;
  deposit_amount: number;
  governorate: string;
  district: string;
  owner_full_name: string;
  owner_identity_status: IdentityStatus;
  product_images: string[];
  available_dates: DayAvailability[]; // كل يوم متاح وساعاته الخاصة فيه
}
// ===== بيانات طلب الحجز (المستأجر) =====
export interface BookingSlot {
  date: string;
  start_time: string;
  end_time: string;
}
 
export interface RentalBookingRequest {
  product_id: number;
  slots: BookingSlot[];
}