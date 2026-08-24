import { apiClient } from "@/api/client";
import { ApiResponse } from "@/types/api";
import { AddProductFormData } from "@/types/addProduct";
import { ApiProduct, MyProduct, ProductDetails, PublicProduct } from "@/types/product";

const mapApiProduct = (product: ApiProduct): PublicProduct => ({
  id: product.id,
  title: product.title,
  category: product.category,
  price_per_hour: product.price_per_hour,
  status: product.status,
  icon: "inventory_2",
  governorate: product.location.governorate,
  district: product.location.district,
  image_url: product.primary_image ?? undefined,
  is_currently_rented: !product.is_available,
});

const mapApiProductDetails = (product: ApiProduct): ProductDetails => ({
  ...mapApiProduct(product),
  description: product.description,
  deposit_amount: product.deposit_amount,
  owner_full_name: product.owner.full_name,
  owner_identity_status: product.owner.is_verified ? "accepted" : "pending",
  product_images: product.product_images,
  available_dates: product.available_dates.map((date) => ({
    date,
    start_time: product.start_time.slice(0, 5),
    end_time: product.end_time.slice(0, 5),
    is_all_day: product.is_all_day,
    is_booked: false,
  })),
});

export const getProducts = async (): Promise<PublicProduct[]> => {
  const response = await apiClient.get<ApiResponse<ApiProduct[]>>("/products");
  return response.data.data.map(mapApiProduct);
};

export const getProduct = async (id: string): Promise<ProductDetails> => {
  const response = await apiClient.get<ApiResponse<ApiProduct>>(`/products/${id}`);
  return mapApiProductDetails(response.data.data);
};

export const createProduct = async (data: AddProductFormData): Promise<PublicProduct> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("price_per_hour", data.price_per_hour);
  formData.append("deposit_amount", data.deposit_amount);
  data.product_images.forEach((image) => formData.append("images[]", image));

  data.available_dates.forEach((availability) => {
    formData.append("available_dates[]", availability.date);
  });
  const firstAvailability = data.available_dates[0];
  if (firstAvailability) {
    formData.append("start_time", firstAvailability.start_time);
    formData.append("end_time", firstAvailability.end_time);
    formData.append("is_all_day", String(firstAvailability.is_all_day));
  }

  const response = await apiClient.post<ApiResponse<ApiProduct>>("/products", formData);
  return mapApiProduct(response.data.data);
};

export const getMyProducts = async (): Promise<MyProduct[]> => {
  const response = await apiClient.get<ApiResponse<ApiProduct[]>>("/products/my");
  return response.data.data.map((product) => ({
    ...mapApiProduct(product),
    deposit_amount: product.deposit_amount,
    rental_count: 0,
  }));
};



