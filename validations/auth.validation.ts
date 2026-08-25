import { LoginErrors, LoginFormData } from "@/types/auth";
import { RegisterFormData, RegisterErrors } from "@/types/auth";
import { UserProfile, ProfileErrors } from "@/types/auth";



export const validateLogin = (
  data: LoginFormData
): LoginErrors => {
  const errors: LoginErrors = {};

if (!data.identifier.trim()) {
  errors.identifier = "هذا الحقل مطلوب";
} else if (data.identifier.includes("@")) {
  // مسار الإيميل فقط
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)) {
    errors.identifier = "صيغة البريد الإلكتروني غير صحيحة";
  }
} else {
  // مسار اسم المستخدم فقط
  if (data.identifier.trim().length < 3) {
    errors.identifier = "اسم المستخدم يجب أن يكون 3 حروف على الأقل";
  } else if (/\s/.test(data.identifier)) {
    errors.identifier = "اسم المستخدم لا يجب أن يحتوي على مسافات";
  } else if (!/^[a-zA-Z\u0600-\u06FF][a-zA-Z0-9\u0600-\u06FF_]*$/.test(data.identifier)) {
    errors.identifier = "اسم المستخدم يجب أن يبدأ بحرف";
  }
}

  if (!data.password) {
    errors.password = "كلمة السر مطلوبة";
  } else if (data.password.length < 6) {
    errors.password = "كلمة السر يجب أن تكون 6 أحرف على الأقل";
  }

  return errors;
};

export const validateRegister = (data: RegisterFormData): RegisterErrors => {
  const errors: RegisterErrors = {};

  if (!data.full_name.trim())
    errors.full_name = "الاسم الكامل مطلوب";
  else if (data.full_name.trim().length < 3)
    errors.full_name = "الاسم يجب أن يكون 3 أحرف على الأقل";

  if (!data.username.trim()) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (data.username.trim().length < 3) {
    errors.username = "اسم المستخدم يجب أن يكون 3 حروف على الأقل";
  } else if (/\s/.test(data.username)) {
    errors.username = "اسم المستخدم لا يجب أن يحتوي على مسافات";
  } else if (!/^[a-zA-Z\u0600-\u06FF][a-zA-Z0-9\u0600-\u06FF_]*$/.test(data.username)) {
    errors.username = "اسم المستخدم يجب أن يبدأ بحرف";
  }

  if (!data.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  // phone validation: required and format rules
  if (!data.phone || !data.phone.trim()) {
    errors.phone = "رقم الهاتف مطلوب";
  } else {
    const phone = data.phone.trim();
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = "يجب إدخال أرقام فقط";
    } else if (phone.length !== 10) {
      errors.phone = "يجب أن يتكون الرقم من 10 خانات";
    } else if (!phone.startsWith("059") && !phone.startsWith("056")) {
      errors.phone = "يجب أن يبدأ الرقم بـ 059 أو 056";
    }
  }

  if (!data.governorate)
    errors.governorate = "اختر المحافظة";

  if (!data.district)
    errors.district = "اختر المنطقة";

  if (!data.password)
    errors.password = "كلمة المرور مطلوبة";
  else if (data.password.length < 6)
    errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

  if (!data.confirmPassword)
    errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "كلمتا المرور غير متطابقتين";

  if (!data.terms)
    errors.terms = "يجب الموافقة على الشروط";

  return errors;
};


export const validateProfile = (data: UserProfile): ProfileErrors => {
  const errors: ProfileErrors = {};

  if (!data.full_name.trim())
    errors.full_name = "الاسم الكامل مطلوب";
  else if (data.full_name.trim().length < 3)
    errors.full_name = "الاسم يجب أن يكون 3 حروف على الأقل";

  if (!data.username.trim()) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (data.username.trim().length < 3) {
    errors.username = "يجب أن يكون 3 حروف على الأقل";
  } else if (/\s/.test(data.username)) {
    errors.username = "لا يسمح بوجود مسافات";
  }

  if (!data.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "صيغة البريد غير صحيحة";
  }

  if (data.phone && data.phone.trim() !== "") {
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "يجب إدخال أرقام فقط";
    } else if (data.phone.length !== 10) {
      errors.phone = "يجب أن يتكون الرقم من 10 خانات";
    } else if (!data.phone.startsWith("059") && !data.phone.startsWith("056")) {
      errors.phone = "يجب أن يبدأ الرقم بـ 059 أو 056";
    }
  }

  if (!data.governorate)
    errors.governorate = "اختر المحافظة";

  if (!data.district)
    errors.district = "اختر المنطقة";

  return errors;
};