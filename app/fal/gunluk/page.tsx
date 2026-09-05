import type { Metadata } from "next";
import GunlukClient from "./gunluk-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Günlük Fal",
  description: "Bugünün enerjisini öğren.",
};

export default function Gunluk() {
  return (
    <GunlukClient />
  );
}
