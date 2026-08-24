"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { PublicProduct, ProductId } from "@/types/product";
import { getProducts } from "@/services/product.service";
import { queryKeys } from "@/api/queryKeys";

interface ProductsContextType {
  products: PublicProduct[];
  addProduct: (product: PublicProduct) => void;
  updateProduct: (id: ProductId, updates: Partial<PublicProduct>) => void;
  updateProductStatus: (id: ProductId, status: PublicProduct["status"]) => void;
  removeProduct: (id: ProductId) => void;
  markAsRented: (id: ProductId) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { data: products = [] } = useQuery({ queryKey: queryKeys.products(), queryFn: getProducts });
  const addProduct = (product: PublicProduct) => {
    void product;
  };
  const updateProduct = (id: ProductId, updates: Partial<PublicProduct>) => {
    void id;
    void updates;
  };
  const updateProductStatus = (id: ProductId, status: PublicProduct["status"]) => {
    void id;
    void status;
  };
  const removeProduct = (id: ProductId) => {
    void id;
  };
  const markAsRented = (id: ProductId) => {
    void id;
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, updateProductStatus, removeProduct,markAsRented  }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}