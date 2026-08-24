"use client";
import React from "react";
import { FavoriteProduct } from "@/types/product";

export default function FavoriteCard({ item }: { item: FavoriteProduct }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center gap-3 hover:shadow-sm transition-all">
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <span className="material-symbols-rounded text-xl text-gray-300">
          {item.category === 'electronics' ? 'videocam' : 'grid_view'}
        </span>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <h3 className="font-bold text-gray-800 text-xs truncate">{item.title}</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">المالك: {item.owner_name}</p>
        <div className="text-primary font-black text-[11px] mt-1">₪{item.price_per_hour}/ساعة</div>
      </div>
      <div className="flex gap-1.5">
        
        <button className="p-1.5 rounded-lg text-red-400 border border-red-50 hover:bg-red-50 transition-all">
          <span className="material-symbols-rounded text-base">heart_broken</span>
        </button>
      </div>
    </div>
  );
}