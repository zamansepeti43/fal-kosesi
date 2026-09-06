import type { Metadata } from "next";
import ResultClient from "./result-client-v2";

export const metadata: Metadata = {
  title: "Fal Köşesi - Sonuç",
  description: "Fal sonuçlarınızı görüntüleyin.",
};

export default function Sonuc() {
  return <ResultClient />;
}
