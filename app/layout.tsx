import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import Script from "next/script";
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
  title: "Camera-tweedehands.nl - Tweedehands Camera's, Lenzen & Accessoires",
  description:
    "Koop en verkoop tweedehands camera's, lenzen en foto-accessoires bij Camera-tweedehands.nl. Kwaliteit gegarandeerd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={dmSans.className}>
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
        />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
