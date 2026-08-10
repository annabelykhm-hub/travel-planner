import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan, track, and share trips in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-muted/30">
        <Header />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
