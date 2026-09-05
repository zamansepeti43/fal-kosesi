import type { Metadata } from "next";
import ParaClient from "./para-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Para & Kısmet",
  description: "Bereket ve kısmet enerjini keşfet.",
};

export default function Para() {
  return (
    <ParaClient />
  );
}
