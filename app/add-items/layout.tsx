import { AddProductProvider } from "@/context/AddProductContext";

export default function AddItemsLayout({ children }: { children: React.ReactNode }) {
  return <AddProductProvider>{children}</AddProductProvider>;
}