import { VerificationResult } from "@/types/verification";

// لتجربة كل سيناريو بسهولة، غيري القيمة المُرجعة بدالة mockSubmitVerification أدناه

export const mockVerificationOutcomes: Record<string, VerificationResult> = {
  accepted: { status: "accepted" },
  pendingManualReview: { status: "pending" }, // قيد المراجعة اليدوية (نسبة تطابق أقل من 85%)
  rejectedBlurry: { status: "rejected", error_status: "blurry_image" },
  rejectedNoFace: { status: "rejected", error_status: "no_face_detected" },
  rejectedMultipleFaces: { status: "rejected", error_status: "multiple_faces" },
  rejectedNotIdCard: { status: "rejected", error_status: "not_id_card" },
  rejectedFaceMismatch: { status: "rejected", error_status: "face_mismatch" },
};

export const mockSubmitVerification = async (): Promise<VerificationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // غيّري المفتاح هون لتجربة سيناريو مختلف، مثلاً mockVerificationOutcomes.rejectedFaceMismatch
      resolve(mockVerificationOutcomes.accepted);
    }, 500);
  });
};


//accepted✅ نجاح التوثيق
// pendingManualReview⏳ قيد المراجعة اليدوية
// rejectedBlurry❌ الصورة غير واضحة (يمسح الاثنين)
// rejectedNoFace❌ مافي وجه بالسيلفي (يمسح السيلفي بس)
// rejectedMultipleFaces❌ أكتر من وجه (يمسح السيلفي بس)
// rejectedNotIdCard❌ مش بطاقة هوية (يمسح صورة الهوية بس)
// rejectedFaceMismatch❌ الوجه ما طابق (يمسح الاثنين)