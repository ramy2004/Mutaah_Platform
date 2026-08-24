"use client";
import { useRouter } from "next/navigation";

interface RentalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalRequestModal({ isOpen, onClose }: RentalRequestModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const handleGoToNotifications = () => {
    onClose();
    router.push("/notifications");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white animate-in zoom-in-95 duration-300 text-center">

        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-rounded text-primary text-3xl">pending_actions</span>
        </div>

        <h2 className="text-lg font-black text-gray-800 mb-2">تم إرسال طلبك!</h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          طلبك بانتظار قبول المالك. تفقّدي صفحة الإشعارات لمتابعة حالة الطلب.
        </p>

        <button
          type="button"
          onClick={handleGoToNotifications}
          className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded text-lg">notifications</span>
          اذهب للإشعارات
        </button>

      </div>
    </div>
  );
}