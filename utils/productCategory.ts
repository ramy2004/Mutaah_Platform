export const CATEGORY_ICON_MAP: Record<string, string> = {
  "تصوير": "photo_camera",
  "إلكترونيات": "devices",
  "أدوات كهربائية": "construction",
  "طاقة": "bolt",
  "مركبات": "directions_car",
  "طبي": "medical_services",
  "أخرى": "inventory_2",
};

export const PRODUCT_CATEGORIES = Object.keys(CATEGORY_ICON_MAP) as readonly string[];

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_MAP[category] ?? "inventory_2";
}