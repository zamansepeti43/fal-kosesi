import type { Metadata } from "next";
import IsClient from "./is-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - İş & Kariyer",
  description: "Kariyer yolundaki sembolleri keşfet.",
};

export default function Is() {
  return (
    <IsClient />
  );
}
