import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fal Köşesi",
  description: "Kahve falı, tarot, aşk, para, kariyer ve rüya yorumları için premium mistik deneyim.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
