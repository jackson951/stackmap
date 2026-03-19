import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReposProvider } from "@/contexts/ReposContext";
import { QueryProvider } from "@/contexts/QueryContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StackMap - AI Codebase Onboarding",
  description: "AI-powered codebase onboarding intelligence tool",
  icons: {
    icon: '/stackmap.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-900 text-white">
        <AuthProvider>
          <ReposProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ReposProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
