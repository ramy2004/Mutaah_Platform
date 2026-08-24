import { apiClient } from "@/api/client";

interface UpdateProfilePayload {
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  governorate: string;
  district: string;
  password?: string;
  avatar?: File | null;
}

export const profileService = {
  updateProfile: async (data: UpdateProfilePayload) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("governorate", data.governorate);
    formData.append("district", data.district);
    if (data.phone) formData.append("phone", data.phone);
    if (data.password) formData.append("password", data.password);
    if (data.avatar) formData.append("avatar", data.avatar);

    const res = await apiClient.post("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};