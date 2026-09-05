import type { Metadata } from "next";
import YildiznameClient from "./yildizname-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Yıldızname / Burç",
  description: "Gökyüzünün ipuçlarını çöz.",
};

export default function Yildizname() {
  return (
    <YildiznameClient />
  );
}
