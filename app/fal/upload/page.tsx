import type { Metadata } from "next";
import Link from "next/link";
import UploadClient from "./upload-client";

export const metadata: Metadata = {
  title: "Fal Köşesi - Fotoğraf Yükle",
  description: "Fincanınızın fotoğraflarını yükleyerek fal yolculuğunuza başlayın.",
};

export default function Upload() {
  return (
    <UploadClient />
  );
}