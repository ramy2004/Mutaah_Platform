export type IdentityStatus = "pending" | "accepted" | "rejected";

export interface VerificationResult {
  status: IdentityStatus;
  error_status?: VerificationErrorReason;
}
export type VerificationErrorReason =
  | "blurry_image"          // blur detection - الصورة مهزوزة أو غير واضحة
  | "no_face_detected"      // face detection - مافي وجه (سيلفي)
  | "multiple_faces"        // face detection - أكتر من وجه (سيلفي)
  | "not_id_card"           // ID detection - الصورة مش بطاقة هوية (هوية)
  | "face_mismatch";        // verification - الوجه ما بطابق الهوية (الاثنين)

export type AffectedImage = "id_image" | "selfie_image" | "both";

export const VERIFICATION_ERROR_MESSAGES: Record<VerificationErrorReason, string> = {
  blurry_image: "الصورة غير واضحة أو فيها اهتزاز، يرجى إعادة التصوير في إضاءة جيدة",
  no_face_detected: "لم يتم العثور على وجه واضح بالصورة الشخصية",
  multiple_faces: "تم رصد أكثر من وجه بالصورة، يرجى إعادة التصوير بشكل فردي",
  not_id_card: "الصورة المرفوعة لا تبدو كصورة هوية صالحة",
  face_mismatch: "لم يتطابق وجهك مع صورة الهوية المرفوعة",
};

export const ERROR_TO_AFFECTED_IMAGE: Record<VerificationErrorReason, AffectedImage> = {
  blurry_image: "both", // ⚠️ معلّق — الباك لازم يحدد أي صورة بالضبط كانت مهزوزة
  no_face_detected: "selfie_image",
  multiple_faces: "selfie_image",
  not_id_card: "id_image",
  face_mismatch: "both",
};