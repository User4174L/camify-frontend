import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Camify - Tweedehands Camera's, Lenzen & Accessoires",
  description:
    "Koop en verkoop tweedehands camera's, lenzen en foto-accessoires bij Camify. Kwaliteit gegarandeerd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={dmSans.className}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
