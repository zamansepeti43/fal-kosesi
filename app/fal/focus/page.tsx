import type { Metadata } from "next";
import Link from "next/link";
import FocusClient from "./focus-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Odak Seçin",
  description: "Falınızın odaklanacağı alanları seçin veya kendi sorununuzu yazın.",
};

export default function Focus() {
  return (
    <FocusClient />
  );
}