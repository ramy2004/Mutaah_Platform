"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyProducts } from "@/services/product.service";
import { MyProduct, ProductId } from "@/types/product";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { mockProducts } from "@/mock/product";
import MyItemCard from "@/components/MyItemCard";
import ProductCard from "@/components/ProductCard";
import UserDropdown from "@/components/UserDropdown";
import { useMemo } from "react";

export default function ManageItemsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [myItems, setMyItems] = useState<MyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { favoriteIds, clearFavorites } = useFavorites();
 const { products: liveProducts, updateProductStatus, removeProduct } = useProducts();
  const favoriteProducts = mockProducts.filter((p) => favoriteIds.includes(p.id));

  const mergedItems = useMemo(
    () =>
      myItems.map((item) => {
        const liveMatch = liveProducts.find((p) => p.id === item.id);
        return liveMatch
          ? { ...item, is_currently_rented: liveMatch.is_currently_rented ?? item.is_currently_rented, status: liveMatch.status }
          : item;
      }),
    [myItems, liveProducts]
  );

  const rentedItems = mergedItems.filter((item) => item.is_currently_rented);
  const activeItemsCount = mergedItems.filter((item) => item.status === "active").length;
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        setMyItems(await getMyProducts());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleEdit = (id: ProductId) => {
    router.push(`/my-items/edit/${id}`);
  };

  const handleToggleStatus = (id: ProductId, currentStatus: string) => {
    const newStatus = currentStatus === "frozen" ? "active" : "frozen";
    setMyItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    updateProductStatus(id, newStatus);
  };

  const handleDelete = (id: ProductId) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmed) return;
    setMyItems((prev) => prev.filter((item) => item.id !== id));
    removeProduct(id);
  };

  const stats = [
    { label: "منتجات نشطة", val: activeItemsCount, style: "bg-primary/5 border-primary/10 text-primary" },
    { label: "مؤجرة حالياً", val: rentedItems.length, style: "bg-orange-50 border-orange-100 text-orange-500" },
    { label: "في المفضلة", val: favoriteProducts.length, style: "bg-red-50 border-red-100 text-red-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-xs">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">ادارة عناصري</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <div className="flex items-center gap-2">
          <Link href="/add-items/step-1" className="bg-primary text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:brightness-105 text-xs">
            <span className="material-symbols-rounded text-sm">add</span> إضافة
          </Link>
          <UserDropdown align="left" />
        </div>
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-3 md:p-4">

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.style} border p-3 rounded-2xl text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default`}
            >
              <div className="text-xl font-black leading-none">{s.val}</div>
              <div className="text-xs font-bold mt-1 opacity-80 whitespace-nowrap tracking-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* التبويبات */}
        <div className="bg-gray-50 border border-gray-100 p-1 rounded-xl flex mb-6 shadow-inner">
          {["عناصر معروضة", "مؤجرة حالياً", "المفضلة"].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all outline-none ${
                activeTab === i
                  ? "bg-white text-primary shadow-sm ring-1 ring-primary/5"
                  : "text-gray-400 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* تنبيه الطلبات */}
        <div className="bg-primary/5 border border-primary/10 p-2.5 rounded-xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-right">
            <span className="material-symbols-rounded text-primary text-lg leading-none">pending_actions</span>
            <span className="text-xs font-black text-primary">2 طلبات بانتظار قرارك</span>
          </div>
          <Link
            href="/manage-requests"
            className="text-primary text-xs font-black hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all active:scale-95 border border-primary/5"
          >
            عرض الطلبات
          </Link>
        </div>

        {/* عرض المحتوى */}
        <div className="flex flex-col gap-2.5 pb-12">
          {activeTab === 2 && favoriteProducts.length > 0 && (
            <div className="flex justify-end mb-1">
              <button
                onClick={clearFavorites}
                className="flex items-center gap-1.5 text-red-500 font-bold text-xs hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <span className="material-symbols-rounded text-sm">delete_sweep</span> مسح الكل
              </button>
            </div>
          )}
          {activeTab === 2 ? (
            favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favoriteProducts.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-300 font-bold">
                لا توجد عناصر في المفضلة حالياً
              </div>
            )
          ) : isLoading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">جاري جلب البيانات</p>
            </div>
          ) : activeTab === 0 && myItems.length > 0 ? (
            mergedItems.map((item) => (
              <MyItemCard
                key={item.id}
                product={item}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))
          ) : activeTab === 1 && rentedItems.length > 0 ? (
            rentedItems.map((item) => (
              <MyItemCard
                key={item.id}
                product={item}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="py-20 text-center text-gray-300 font-bold">
              لا توجد عناصر في هذا القسم حالياً
            </div>
          )}
        </div>

      </main>

      
    </div>
  );
}