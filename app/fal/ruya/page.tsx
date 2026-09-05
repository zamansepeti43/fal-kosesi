import type { Metadata } from "next";
import RuyaClient from "./ruya-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Rüya Yorumu",
  description: "Rüyalarındaki mesajları yorumla.",
};

export default function Ruya() {
  return (
    <RuyaClient />
  );
}
