import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import Providers from "./providers";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jakarta",
});

const materialSymbols = localFont({
  src: "../public/fonts/MaterialSymbolsRounded.woff2",
  variable: "--font-material-symbols",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مُتاح - شارك واستفيد",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${plusJakarta.variable} ${materialSymbols.variable} antialiased font-sans bg-slate-50 text-slate-900 flex flex-col min-h-screen`}>
       <Providers>
         <ProductsProvider>
          <UserProfileProvider>
            <NotificationsProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
              <Chatbot />
            </NotificationsProvider>
          </UserProfileProvider>
         </ProductsProvider>
       </Providers>
      </body>
    </html>
  );
}