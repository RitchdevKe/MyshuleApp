import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import "./globals.css";
import TopLoader from "@/components/TopLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduSystem Kenya | School Management",
  description: "Modern School Management System for the Kenyan Market (CBC & 8-4-4)",
};

import { getTenantProfile } from "@/app/actions/tenant";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getTenantProfile();

  // Simple override for the main brand colors
  // In a full implementation, you'd use a color library to generate the 50-950 scale
  const primary = profile?.primaryColor || "#3a1127";
  const secondary = profile?.secondaryColor || "#e11d48";

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <style>{`
          :root {
            --color-primary-950: ${primary};
            --color-primary-900: ${primary};
            --color-primary-800: ${primary};
            --color-primary-700: ${primary};
            --color-primary-600: ${primary};
            --color-secondary-500: ${secondary};
            --color-secondary-600: ${secondary};
          }
        `}</style>
      </head>
      <body className="h-full w-full bg-slate-50 dark:bg-slate-950">
        <TopLoader />
        {children}
      </body>
    </html>
  );
}
