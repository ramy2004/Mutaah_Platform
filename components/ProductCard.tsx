"use client";
import { useState } from "react";
import Link from "next/link";
import { PublicProduct } from "@/types/product";
import { useFavorites } from "@/context/FavoritesContext";

export default function ProductCard({ id, title, governorate, district, price_per_hour, icon, image_url, status,is_currently_rented  }: PublicProduct) {
  const isAvailable = status === "active";
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <Link
      href={`/products/${id}`}
      className="group bg-white rounded-container border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >

       <div className="h-48 bg-primary-light flex items-center justify-center relative m-2 rounded-section overflow-hidden">
    {image_url ? (
      <img
        src={image_url}
        alt={title}
        className=" h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    ) : (
      <span className="material-symbols-rounded text-4xl text-gray-300 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </span>
    )}

        <div className="absolute top-2 right-2">
  {is_currently_rented ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold border bg-orange-50 text-orange-500 border-orange-100">
      مؤجر حالياً
    </span>
  ) : (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
      isAvailable ? "bg-white/90 text-primary border-primary/20" : "bg-orange-50 text-orange-500 border-orange-100"
    }`}>
      {isAvailable ? "متاح" : "غير متاح"}
    </span>
  )}
</div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(id);
          }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all active:scale-75"
        >
          <span
            className="material-symbols-rounded text-base transition-all duration-300"
            style={{
              fontVariationSettings: `'FILL' ${isFavorite(id) ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
              color: isFavorite(id) ? "#ef4444" : "#d1d5db",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="p-4 flex flex-col items-start text-right">

        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <span className="material-symbols-rounded text-xs text-primary">location_on</span>
          <span>{governorate} — {district}</span>
        </div>

        <div className="flex items-center gap-1 mb-3 font-bold text-primary">
          <span className="text-lg">₪</span>
          <span className="text-lg">{price_per_hour}</span>
          <span className="text-gray-400 text-xs font-medium mr-1">/ ساعة</span>
        </div>

        <span className={`w-full py-2.5 rounded-btn font-bold text-sm text-center transition-all ${
          isAvailable
            ? "bg-linear-to-r from-primary to-green-harvest text-white shadow-md shadow-primary/20 group-hover:brightness-105"
            : "bg-gray-50 text-gray-400"
        }`}>
          {isAvailable ? "تأجر الآن" : "غير متاح حالياً"}
        </span>
      </div>
    </Link>
  );
}