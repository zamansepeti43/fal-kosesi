import type { Metadata } from "next";
import IsClient from "../is/is-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - İş & Kariyer",
  description: "Kariyer yolundaki fırsatları ve yönü keşfet.",
};

export default function Kariyer() {
  return <IsClient />;
}
