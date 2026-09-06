import type { Metadata } from "next";
import "./globals.css";
import GlobalInteractions from "@/components/GlobalInteractions";

export const metadata: Metadata = {
  title: "Fal Köşesi",
  description: "Kahve falı, tarot, aşk, para, kariyer ve rüya yorumları için premium mistik deneyim.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body><GlobalInteractions />{children}</body>
    </html>
  );
}
