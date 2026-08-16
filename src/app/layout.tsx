import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/auth/header';
import DevPage from '@/app/dev/page';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Otter — AI-Powered Resource Discovery",
  description: "Discover curated resources for any profession or technical domain using AI-powered search.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          {process.env.NODE_ENV === 'development' && <DevPage />}
        </body>
      </html>
    </ClerkProvider>
  );
}
