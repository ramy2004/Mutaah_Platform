"use client";
import ProductCard from "@/components/ProductCard";
import UserDropdown from "@/components/UserDropdown";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useState, useMemo } from "react";
import { PRODUCT_CATEGORIES } from "@/types/addProduct";
import { useNotifications } from "@/context/NotificationsContext";

export default function Dashboard() {
  const { products } = useProducts();
const { unreadCount } = useNotifications();
const [activeCategory, setActiveCategory] = useState("الكل");

const categories = ["الكل", ...PRODUCT_CATEGORIES];

const filteredProducts = useMemo(
  () => (activeCategory === "الكل" ? products : products.filter((p) => p.category === activeCategory)),
  [products, activeCategory]
);

  return (
    <div className="min-h-screen flex flex-col bg-white">
     <header className="flex flex-col border-b border-gray-100 bg-white sticky top-0 z-50">

  <div className="flex items-center justify-between px-4 md:px-6 py-3">
  <Link href="/" className="text-2xl font-black text-primary italic cursor-pointer ">مُتاح</Link>
<div className="relative flex-1 max-w-md mx-10 hidden md:block">
  
  <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">search</span>
  <input
    type="text"
    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all"
    placeholder="ابحث عن أدوات، كاميرات، مولدات..."
  />
</div>

   <div className="flex items-center gap-5">
  <Link href="/notifications" className="relative cursor-pointer group">
    <span className="material-symbols-rounded text-gray-500 text-2xl group-hover:text-primary transition-colors">notifications</span>
     {unreadCount > 0 && (
    <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
       )} 
  </Link>
  <UserDropdown align="left" />
</div>
  </div>

  <div className="px-4 pb-3 md:hidden">
    <div className="relative">
      <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">search</span>
      <input
        type="text"
        className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all"
        placeholder="ابحث عن أدوات، كاميرات، مولدات..."
      />
    </div>
  </div>

</header>

      <main className="grow">

        <div className="w-full border-b border-gray-100 py-3 mb-6 bg-white">
          <div className="px-6 flex items-center justify-start gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
  <button
    key={cat}
    onClick={() => setActiveCategory(cat)}
    className={`px-7 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
      activeCategory === cat
        ? "bg-primary text-white shadow-md"
        : "bg-white text-gray-500 border border-gray-100 hover:border-primary hover:text-primary"
    }`}
  >
    {cat}
  </button>
))}
          </div>
        </div>

        <div className="px-6 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>

      </main>
     
    </div>
  );
}