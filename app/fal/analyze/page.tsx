import type { Metadata } from "next";
import AnalyzeClient from "./analyze-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Falın Hazırlanıyor",
  description: "Yorumcun fincanını inceliyor; falın hazır olduğunda sana haber vereceğiz.",
};

export default function Analyze() {
  return <AnalyzeClient />;
}
