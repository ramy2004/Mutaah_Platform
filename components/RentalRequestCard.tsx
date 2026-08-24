"use client";
import React from "react";
import { RentalRequest } from "@/types/rental";

interface Props {
  request: RentalRequest;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function RentalRequestCard({ request, onAccept, onReject }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all">
      {/* أيقونة المنتج المصغرة */}
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <span className="material-symbols-rounded text-xl text-gray-300 italic">
          {request.category === 'electronics' ? 'photo_camera' : 'construction'}
        </span>
      </div>

      {/* تفاصيل الطلب */}
      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-bold text-gray-800 text-xs md:text-sm truncate">{request.product_title}</h3>
          <span className="text-[10px] text-primary bg-primary/5 px-1.5 rounded font-bold">جديد</span>
        </div>
        
        <p className="text-[10px] text-gray-500 font-medium">
          المستأجر: <span className="text-gray-800 font-bold">{request.renter_name}</span>
        </p>
        
        <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400 font-bold italic">
          <span className="flex items-center gap-0.5"><span className="material-symbols-rounded text-[12px]">schedule</span> {request.start_time} - {request.end_time}</span>
          <span className="text-primary font-black">₪{request.total_price}</span>
        </div>
      </div>

      {/* أزرار القرار (Accept / Reject) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          onClick={() => onAccept(request.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black hover:brightness-105 transition-all shadow-sm shadow-primary/20"
        >
          <span className="material-symbols-rounded text-sm">check</span>
          <span className="hidden sm:inline">قبول</span>
        </button>
        <button 
          onClick={() => onReject(request.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-[10px] font-black hover:bg-red-50 transition-all"
        >
          <span className="material-symbols-rounded text-sm">close</span>
          <span className="hidden sm:inline">رفض</span>
        </button>
      </div>
    </div>
  );
}