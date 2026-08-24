"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { AddProductFormData } from "@/types/addProduct";

const initialData: AddProductFormData = {
  title: "",
  category: "",
  description: "",
  price_per_hour: "",
  deposit_amount: "",
  product_images: [],
  available_dates: [],
};

interface AddProductContextType {
  formData: AddProductFormData;
  updateFormData: (data: Partial<AddProductFormData>) => void;
  resetFormData: () => void;
}

const AddProductContext = createContext<AddProductContextType | undefined>(undefined);

export function AddProductProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<AddProductFormData>(initialData);

  const updateFormData = (data: Partial<AddProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => setFormData(initialData);

  return (
    <AddProductContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </AddProductContext.Provider>
  );
}

export function useAddProduct() {
  const context = useContext(AddProductContext);
  if (!context) {
    throw new Error("useAddProduct must be used within an AddProductProvider");
  }
  return context;
}