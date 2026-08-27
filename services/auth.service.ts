import { apiClient } from "@/api/client";
import { AuthSession, LoginFormData, RegisterFormData, UserProfile } from "@/types/auth";

type AuthApiBody = {
  message?: string;
  access_token?: string;
  token_type?: string;
  user?: UserProfile;
  data?: {
    access_token?: string;
    token_type?: string;
    user?: UserProfile;
  };
};

type ProfileApiBody = {
  user?: Record<string, unknown> & Partial<UserProfile> & { is_verified?: boolean };
  data?: {
    user?: Record<string, unknown> & Partial<UserProfile> & { is_verified?: boolean };
  } & Partial<UserProfile> & { is_verified?: boolean };
} & Partial<UserProfile> & { is_verified?: boolean };

const unwrapAuthSession = (body: AuthApiBody): AuthSession => {
  const nested = body.data;
  const access_token = nested?.access_token ?? body.access_token;
  const token_type = nested?.token_type ?? body.token_type ?? "Bearer";
  const user = nested?.user ?? body.user;

  if (!access_token || !user) {
    throw new Error(body.message || "فشل حفظ جلسة المستخدم");
  }

  return { access_token, token_type, user };
};

const mapUserProfile = (body: ProfileApiBody): UserProfile => {
  const user = body.data?.user ?? body.user ?? body.data ?? body;
  const verified = Boolean(user.is_verified);

  return {
    id: user.id as UserProfile["id"],
    full_name: String(user.full_name ?? ""),
    username: String(user.username ?? ""),
    email: String(user.email ?? ""),
    phone: user.phone ? String(user.phone) : undefined,
    governorate: String(user.governorate ?? ""),
    district: String(user.district ?? ""),
    avatar: user.avatar ? String(user.avatar) : undefined,
    identity_status: verified ? "accepted" : user.identity_status ?? "pending",
  };
};

export const authService = {
  login: async (data: LoginFormData): Promise<AuthSession> => {
    const res = await apiClient.post<AuthApiBody>("/login", {
      login: data.identifier,
      password: data.password,
    });
    return unwrapAuthSession(res.data);
  },

  register: async (data: RegisterFormData): Promise<AuthSession> => {
    const { confirmPassword, terms, ...rest } = data;
    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
      terms,
    };
    const res = await apiClient.post<AuthApiBody>("/register", payload);
    return unwrapAuthSession(res.data);
  },

  logout: async () => {
    await apiClient.post("/logout");
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get<ProfileApiBody>("/profile");
    return mapUserProfile(res.data);
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/forgot-password", { email });
    return res.data;
  },
};