import { AddProductStep1Data } from "@/types/addProduct";

export interface AddProductStep1Errors {
  title?: string;
  category?: string;
  description?: string;
  price_per_hour?: string;
  deposit_amount?: string;
}

export const validateAddProductStep1 = (
  data: AddProductStep1Data
): AddProductStep1Errors => {
  const errors: AddProductStep1Errors = {};

  if (!data.title.trim()) {
    errors.title = "اسم المنتج مطلوب";
  } else if (data.title.trim().length < 3) {
    errors.title = "اسم المنتج يجب أن يكون 3 أحرف على الأقل";
  }

  if (!data.category) {
    errors.category = "اختر تصنيفاً للمنتج";
  }

  if (!data.description.trim()) {
    errors.description = "وصف المنتج مطلوب";
  } else if (data.description.trim().length < 10) {
    errors.description = "الوصف يجب أن يكون 10 أحرف على الأقل";
  }

  if (!data.price_per_hour.trim()) {
    errors.price_per_hour = "سعر الإيجار مطلوب";
  } else if (isNaN(Number(data.price_per_hour)) || Number(data.price_per_hour) <= 0) {
    errors.price_per_hour = "أدخل سعراً صحيحاً";
  }

  if (!data.deposit_amount.trim()) {
    errors.deposit_amount = "مبلغ التأمين مطلوب";
  } else if (isNaN(Number(data.deposit_amount)) || Number(data.deposit_amount) <= 0) {
    errors.deposit_amount = "أدخل مبلغاً صحيحاً";
  }

  return errors;
};