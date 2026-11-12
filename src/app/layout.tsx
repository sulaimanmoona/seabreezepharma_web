import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Seabreeze Pharma | ร้านยาซีบรีซ ฟาร์มา",
    template: "%s | Seabreeze Pharma",
  },
  description:
    "ร้านขายยา Seabreeze Pharma ให้คำปรึกษาโดยเภสัชกร ตรวจสอบราคายา และบทความความรู้เรื่องการใช้ยา",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${prompt.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
