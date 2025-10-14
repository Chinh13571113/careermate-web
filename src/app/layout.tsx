import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/auth-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import AuthGuard from "@/components/auth/auth-guard";
import HomeBg from "@/components/home-bg";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AuthCleanup } from "@/components/auth/AuthCleanup";
import { PostLoginRedirect } from "@/components/auth/PostLoginRedirect";
import { SecurityCleanup } from "@/components/auth/SecurityCleanup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerMate",
  description: "Your AI Career Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <LayoutProvider>
            {/* Security cleanup on app load */}
            <SecurityCleanup />

            {/* Temporarily disabled PostLoginRedirect to debug infinite loop */}
            {/* <PostLoginRedirect> */}
            {/* <AuthCleanup /> */}
            <HomeBg>{children}</HomeBg>
            {/* </PostLoginRedirect> */}

            <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
            <Analytics />
          </LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
