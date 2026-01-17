import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QR Code Tàu Cá Đà Nẵng",
  description: "Tra cứu thông tin tàu cá nhanh chóng và chính xác thông qua mã QR - Sở Nông nghiệp và Phát triển Nông thôn Đà Nẵng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
