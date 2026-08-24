"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardItem } from "@/types/admin";

const statMeta = [
  { key: "users_count", label: "المستخدمون", icon: "people", color: "bg-primary/10 text-primary" },
  { key: "active_products_count", label: "المنتجات النشطة", icon: "inventory_2", color: "bg-emerald-100 text-emerald-700" },
  { key: "pending_rental_requests_count", label: "طلبات الإيجار", icon: "pending_actions", color: "bg-amber-100 text-amber-700" },
  { key: "pending_payments_count", label: "المدفوعات المعلقة", icon: "payments", color: "bg-indigo-100 text-indigo-700" },
  { key: "pending_subscriptions_count", label: "الاشتراكات المعلقة", icon: "subscriptions", color: "bg-pink-100 text-pink-700" },
  { key: "active_subscriptions_count", label: "اشتراكات نشطة", icon: "workspace_premium", color: "bg-violet-100 text-violet-700" },
  { key: "manual_identity_reviews_count", label: "مراجعات الهوية", icon: "verified_user", color: "bg-sky-100 text-sky-700" },
] as const;

const formatNumber = (value: number | string | undefined) =>
  Number(value ?? 0).toLocaleString("ar-EG");

const getDisplayName = (user: AdminDashboardItem["user"] | AdminDashboardItem["renter"] | AdminDashboardItem["payer"] | undefined) =>
  user?.full_name || user?.name || user?.username || "مستخدم";

const getProductName = (item: AdminDashboardItem) => {
  const fromProduct = item.product?.title || item.product?.name;
  const fromRentalProduct = item.rental?.product?.title || item.rental?.product?.name;
  return fromProduct || fromRentalProduct || "منتج";
};

const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    pending: "قيد المراجعة",
    active: "نشط",
    accepted: "مقبول",
    approved: "موافق عليه",
    rejected: "مرفوض",
    archived: "مؤرشف",
    manual_review: "مراجعة يدويّة",
    completed: "مكتمل",
    canceled: "ملغي",
    expired: "منتهي",
  };

  return map[status ?? ""] ?? status ?? "غير محدد";
};

const statusClasses = (status?: string) => {
  const value = (status ?? "").toLowerCase();

  if (["active", "approved", "accepted", "completed"].includes(value)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["pending", "manual_review", "waiting"].includes(value)) {
    return "bg-amber-100 text-amber-700";
  }

  if (["rejected", "canceled", "expired"].includes(value)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const toMoney = (value: number | string | undefined) =>
  `${Number(value ?? 0).toLocaleString("ar-EG")} ₪`;

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: adminService.getDashboard,
  });

  const dashboard = data ?? {
    stats: {
      users_count: 0,
      active_products_count: 0,
      pending_rental_requests_count: 0,
      pending_payments_count: 0,
      pending_subscriptions_count: 0,
      active_subscriptions_count: 0,
      manual_identity_reviews_count: 0,
    },
    recent_rental_requests: [],
    pending_payments: [],
    identity_reviews: [],
    pending_subscriptions: [],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-primary hover:text-primary">
              <span className="material-symbols-rounded text-lg">arrow_forward</span>
            </Link>
            <div>
              <p className="text-xs font-bold text-slate-400">لوحة تحكم</p>
              <h1 className="text-lg font-black text-slate-800">الإدارة</h1>
            </div>
          </div>

          <div className="text-2xl font-black italic text-primary">مُتاح</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-[32px] bg-gradient-to-r from-primary to-green-harvest p-6 text-white shadow-[0_18px_40px_rgba(0,167,157,0.18)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold text-white/75">نظرة عامة</p>
              <h2 className="mt-2 text-2xl font-black">لوحة تحكم إدارة منصة مُتاح</h2>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-sm">
              <span className="material-symbols-rounded text-base">insights</span>
              <span>مؤشرات مباشرة من الخادم</span>
            </div>
          </div>
        </section>

        {isError ? (
          <div className="mb-6 rounded-[28px] border border-red-200 bg-red-50 p-4 text-right text-sm font-bold text-red-700">
            فشل تحميل لوحة الإدارة. {error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى."}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statMeta.map((stat) => (
            <div key={stat.key} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm" dir="rtl">
              <div className="mb-5 flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.color}`}>
                  <span className="material-symbols-rounded text-xl">{stat.icon}</span>
                </span>
                <span className="text-xs font-bold text-slate-400">{stat.label}</span>
              </div>

              <div className="text-3xl font-black text-slate-800">
                {isLoading ? "..." : formatNumber(dashboard.stats[stat.key])}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">الطلبات الأخيرة</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                {dashboard.recent_rental_requests.length} طلب
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">جارٍ التحميل...</div>
              ) : dashboard.recent_rental_requests.length ? (
                dashboard.recent_rental_requests.map((item) => (
                  <div key={String(item.id ?? Math.random())} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses(item.status ?? item.owner_status)}`}>
                        {getStatusLabel(item.status ?? item.owner_status)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{formatDate(item.created_at)}</span>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">{getProductName(item)}</p>
                        <p className="mt-1 text-xs text-slate-500">{getDisplayName(item.renter ?? item.user)}</p>
                      </div>
                      <span className="material-symbols-rounded text-2xl text-primary">request_quote</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">لا توجد طلبات حديثة حالياً.</div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">المدفوعات المعلقة</h3>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                {dashboard.pending_payments.length} عنصر
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">جارٍ التحميل...</div>
              ) : dashboard.pending_payments.length ? (
                dashboard.pending_payments.map((item) => (
                  <div key={String(item.id ?? Math.random())} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-800">{getDisplayName(item.payer ?? item.user)}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                        {getStatusLabel(item.payment_status ?? item.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{getProductName(item)}</span>
                      <span className="font-black text-primary">{toMoney(item.amount ?? item.total_amount ?? item.receipt_amount)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">لا توجد مدفوعات معلقة.</div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">مراجعات الهوية</h3>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                {dashboard.identity_reviews.length} مراجعة
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">جارٍ التحميل...</div>
              ) : dashboard.identity_reviews.length ? (
                dashboard.identity_reviews.map((item) => (
                  <div key={String(item.id ?? Math.random())} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-800">{getDisplayName(item.user)}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClasses(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">تاريخ التقديم: {formatDate(item.created_at)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">لا توجد مراجعات حالياً.</div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">اشتراكات معلقة</h3>
              <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[10px] font-bold text-pink-700">
                {dashboard.pending_subscriptions.length} عنصر
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">جارٍ التحميل...</div>
              ) : dashboard.pending_subscriptions.length ? (
                dashboard.pending_subscriptions.map((item) => (
                  <div key={String(item.id ?? Math.random())} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-800">{getDisplayName(item.user)}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClasses(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{item.plan?.name || item.plan?.title || item.plan?.plan_type || "خطة"}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">لا توجد اشتراكات معلقة.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
