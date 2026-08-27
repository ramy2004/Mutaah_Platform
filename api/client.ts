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
      const hadToken = !!tokenStorage.getAccessToken();
      tokenStorage.clear();
      if (
        typeof window !== "undefined" &&
        hadToken &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);