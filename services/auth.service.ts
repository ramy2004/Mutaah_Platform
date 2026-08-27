import { apiClient } from "@/api/client";
import { AuthSession, LoginFormData, RegisterFormData, UserProfile } from "@/types/auth";

/**
 * الـ API ما بيلتزم بغلاف واحد:
 *   /register و /login  -> بيرجّعوا الكائن مباشرة { access_token, user, ... }
 *   /profile            -> بيرجّع الملف تحت مفتاح user
 *   موارد Laravel       -> بترجع تحت data
 * unwrap بتتعامل مع الحالات الثلاث، فبتظل شغّالة لو وحّد الباك إند الغلاف لاحقاً.
 */
function unwrap<T>(body: unknown, key?: string): T {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (key && obj[key] !== undefined) return obj[key] as T;
    if (obj.data !== undefined) return obj.data as T;
  }
  return body as T;
}

function asSession(body: unknown): AuthSession {
  const session = unwrap<AuthSession>(body);
  // بدون هالتحقق، الصفحة بتطيح على TypeError وبتعرض "حدث خطأ" بدون سبب واضح
  if (!session?.access_token) {
    throw new Error("لم يصل رمز الدخول من الخادم");
  }
  return session;
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthSession> => {
    const res = await apiClient.post("/login", {
      login: data.identifier,
      password: data.password,
    });
    return asSession(res.data);
  },

  register: async (data: RegisterFormData): Promise<AuthSession> => {
    const { confirmPassword, terms, ...rest } = data;
    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
      terms,
    };
    const res = await apiClient.post("/register", payload);
    return asSession(res.data);
  },

  logout: async () => {
    await apiClient.post("/logout");
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get("/profile");
    return unwrap<UserProfile>(res.data, "user");
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/forgot-password", { email });
    return res.data;
  },
};
