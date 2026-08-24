"use client";
import { useUserProfile } from "@/context/UserProfileContext";
import ProfileForm from "./ProfileForm"; // كومبوننت جديد رح ننشئه

export default function ProfilePage() {
  const { profile, isLoading } = useUserProfile();

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <div className="text-gray-400 text-sm font-bold">جارِ التحميل...</div>
      </div>
    );
  }

  // الـ key هون هو الحل — أي مرة profile.id يتغير، React يعيد بناء ProfileForm من الصفر بقيمة formData جديدة
  return <ProfileForm key={profile.id} initialProfile={profile} />;
}