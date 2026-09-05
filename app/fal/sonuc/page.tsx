import type { Metadata } from "next";
import ResultClient from "./result-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Sonuç",
  description: "Fal sonuçlarınızı görüntüleyin.",
};

export default function Sonuc() {
  return (
    <ResultClient />
  );
}