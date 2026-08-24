"use client";
import { getCategoryIcon } from "@/utils/productCategory";
import React from "react";
import { MyProduct, ProductId } from "@/types/product";

interface MyItemCardProps {
  product: MyProduct;
  onEdit?: (id: ProductId) => void;
  onToggleStatus?: (id: ProductId, currentStatus: string) => void;
  onDelete?: (id: ProductId) => void;
}

export default function MyItemCard({ 
  product, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: MyItemCardProps) {
  
  // [LOGIC] - تحديد خصائص الحالة (اللون والنص)
const isRented = product.is_currently_rented === true;
  const isFrozen = product.status === "frozen";

  const statusConfig = {
    active: { label: "متاح", classes: "bg-green-50 text-green-600 border-green-100" },
    frozen: { label: "مجمد", classes: "bg-gray-100 text-gray-500 border-gray-200" },
    pending: { label: "قيد المراجعة", classes: "bg-blue-50 text-blue-600 border-blue-100" },
    deleted: { label: "محذوف", classes: "bg-red-50 text-red-600 border-red-100" },
  };

// نتعامل مع "مؤجر" كحالة عرض منفصلة فوق الـ status الأساسي
const currentStatus = isRented
  ? { label: "مؤجر حالياً", classes: "bg-orange-50 text-orange-600 border-orange-100" }
  : statusConfig[product.status] || statusConfig.frozen;
  return (
    <div className="bg-white border border-gray-100 rounded-[22px] p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:shadow-md transition-all duration-300 group">
      
      {/* 1. الصورة المصغرة (Thumbnail) */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#f8fafb] flex items-center justify-center shrink-0">
        <span className="material-symbols-rounded text-gray-300 text-2xl md:text-3xl italic">
          {getCategoryIcon(product.category)}
        </span>
      </div>

     {/* 2. Details */}
      <div className="flex-1 min-w-0 text-right">
        <h3 className="font-bold text-gray-800 text-[13px] truncate">{product.title}</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">
          ₪{product.price_per_hour}/س — رهن ₪{product.deposit_amount}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${currentStatus.classes}`}>
            {currentStatus.label}
          </span>
          
          {/* في حالة المؤجر، نظهر تاريخ الانتهاء فقط في هذه المساحة */}
          {isRented && product.expiry_date && (
            <span className="text-[9px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-md">
               ينتهي في: {product.expiry_date}
            </span>
          )}
        </div>
      </div>

      {/* 3. Actions - تظهر فقط إذا لم يكن المنتج مؤجراً */}
      {!isRented && (
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onEdit?.(product.id)} className="p-1.5 rounded-lg text-primary hover:bg-primary/5 border border-primary/10 transition-colors">
            <span className="material-symbols-rounded text-base">edit</span>
          </button>
          
          <button onClick={() => onToggleStatus?.(product.id, product.status)} className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 border border-orange-100 transition-colors">
            <span className="material-symbols-rounded text-base">{isFrozen ? 'play_arrow' : 'pause'}</span>
          </button>

          <button onClick={() => onDelete?.(product.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 border border-red-50 transition-colors">
            <span className="material-symbols-rounded text-base">delete</span>
          </button>
        </div>
      )}
    </div>
  );
}