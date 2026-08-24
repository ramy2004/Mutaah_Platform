"use client";
import { useState } from "react";
import Link from "next/link";
import RentalRequestCard from "@/components/RentalRequestCard";
import { MOCK_RENTAL_REQUESTS } from "@/mock/rental-requests";
import UserDropdown from "@/components/UserDropdown";
import Footer from "@/components/Footer";

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState(MOCK_RENTAL_REQUESTS);

  const handleAccept = (id: number) => {
    console.log("Accepted request:", id);
    setRequests(prev => prev.filter(r => r.id !== id)); // إزالة الطلب بعد القرار كمحاكاة
  };

  const handleReject = (id: number) => {
    console.log("Rejected request:", id);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-xs">
      
      {/* هيدر نحيف جداً مطابق لـ "إدارة عناصري" */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-[100] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/my-items" className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
            <span className="material-symbols-rounded text-base">arrow_forward</span>
          </Link>
          <h1 className="text-xs font-black text-gray-800 tracking-tight">طلبات الاستئجار</h1>
        </div>
        <div className="text-lg font-black text-primary italic">مُتاح</div>
        <UserDropdown />
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-4">
        
        {/* ترويسة الصفحة */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h2 className="text-sm font-black text-gray-800">الطلبات الواردة</h2>
            <p className="text-[10px] text-gray-400 font-bold">لديك {requests.length} طلبات بانتظار قرارك</p>
          </div>
          <span className="material-symbols-rounded text-primary/20 text-4xl">pending_actions</span>
        </div>

        {/* قائمة الطلبات */}
        {requests.length > 0 ? (
          <div className="flex flex-col gap-2.5 pb-20">
            {requests.map(req => (
              <RentalRequestCard 
                key={req.id} 
                request={req} 
                onAccept={handleAccept} 
                onReject={handleReject} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-3">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                <span className="material-symbols-rounded text-3xl">inbox</span>
             </div>
             <p className="text-gray-400 font-bold">لا توجد طلبات معلقة حالياً</p>
             <Link href="/dashboard" className="text-primary font-black hover:underline">العودة للداشبورد</Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}