import axios from "axios";
import { tokenStorage } from "@/utils/tokenStorage";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// حقن التوكن تلقائياً بكل طلب محمي
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو التوكن انتهت صلاحيته، رجّعي المستخدم لتسجيل الدخول
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(tokenStorage.getAccessToken());
      const requestUrl = String(error.config?.url ?? "");
      const isAuthAttempt = /\/(login|register|forgot-password|reset-password)$/.test(requestUrl);

      tokenStorage.clear();

      if (hadToken && !isAuthAttempt && typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);