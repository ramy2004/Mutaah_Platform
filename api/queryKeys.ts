export const queryKeys = {
  profile: ["profile"] as const,
  products: (filters?: Record<string, unknown>) => ["products", filters] as const,
  product: (id: string) => ["product", id] as const,
  myProducts: ["my-products"] as const,
  notifications: ["notifications"] as const,
  plans: ["plans"] as const,
  currentPlan: ["current-plan"] as const,
  savedItems: ["saved-items"] as const,
  rentalRequests: ["rental-requests"] as const,
  payments: ["payments"] as const,
  verification: ["verification"] as const,
  adminDashboard: ["admin-dashboard"] as const,
};