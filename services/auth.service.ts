import { apiClient } from "@/api/client";
import { ApiResponse } from "@/types/api";
import { AuthSession, LoginFormData, RegisterFormData, UserProfile } from "@/types/auth";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthSession> => {
    const res = await apiClient.post<ApiResponse<AuthSession>>("/login", {
      login: data.identifier,
      password: data.password,
    });
    return res.data.data;
  },

  register: async (data: RegisterFormData): Promise<AuthSession> => {
    const { confirmPassword, terms, ...rest } = data;
    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
      terms,
    };
    const res = await apiClient.post<ApiResponse<AuthSession>>("/register", payload);
    return res.data.data;
  },

  logout: async () => {
    await apiClient.post("/logout");
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get<ApiResponse<UserProfile>>("/profile");
    return res.data.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<ApiResponse<null>>("/forgot-password", { email });
    return res.data;
  },

};