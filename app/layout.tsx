import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Fal Köşesi | Kahve Falın Burada", description: "Fincanını gönder, Fal Köşesi senin için yorumlasın." };

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
