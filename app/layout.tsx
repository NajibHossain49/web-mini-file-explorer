import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web File Explorer",
  description: "Web File Explorer",
  icons: {
    icon: "/app/favicon.png",
  },
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
