import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "File Explorer — Webbly Media",
  description: "Mini File Explorer — Next.js 16 · TypeScript · Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
