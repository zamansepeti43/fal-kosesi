import type { Metadata } from "next";
import AnalyzeClient from "./analyze-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Analiz",
  description: "Falınız analiz ediliyor, lütfen bekleyiniz.",
};

export default function Analyze() {
  return (
    <AnalyzeClient />
  );
}