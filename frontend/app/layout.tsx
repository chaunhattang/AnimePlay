import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/components/AppProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnimePlay Movies",
  description: "Movie discovery platform with trailers, ratings, filters, details, and watchlist."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
