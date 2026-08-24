"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ProductId } from "@/types/product";

interface FavoritesContextType {
  favoriteIds: ProductId[];
  toggleFavorite: (id: ProductId) => void;
  isFavorite: (id: ProductId) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<ProductId[]>([]);

  const toggleFavorite = (id: ProductId) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: ProductId) => favoriteIds.includes(id);

  const clearFavorites = () => setFavoriteIds([]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}