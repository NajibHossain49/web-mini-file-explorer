import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web File Explorer",
  description: "Web File Explorer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
