"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // توجيه المستخدم تلقائياً لصفحة تسجيل الدخول بمجرد فتح الموقع
    router.push("/login");
  }, [router]);

  return null; // لن يظهر شيء لأن التحويل سريع جداً
}
