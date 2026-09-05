import type { Metadata } from "next";
import TarotClient from "./tarot-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Tarot Falı",
  description: "Desteni seç, kartların sana ne söylediğini keşfet.",
};

export default function Tarot() {
  return (
    <TarotClient />
  );
}
