import type { Metadata } from "next";
import AskClient from "./ask-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Aşk Falı",
  description: "Aşk hayatındaki meraklarınızı keşfedin.",
};

export default function Ask() {
  return (
    <AskClient />
  );
}
