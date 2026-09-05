import type { Metadata } from "next";
import Link from "next/link";
import PreviewClient from "./preview-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Fotoğraf Önizleme",
  description: "Yüklenen fotoğraflarınızı kontrol edip fal yolculuğunuza devam edin.",
};

export default function Preview() {
  return (
    <PreviewClient />
  );
}