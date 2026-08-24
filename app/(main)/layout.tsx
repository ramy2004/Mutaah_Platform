import { FavoritesProvider } from "@/context/FavoritesContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}