"use client";

import { useRef, useState } from "react";
import { Camera, ChevronRight, ImagePlus, Sparkles, Upload as UploadIcon, X } from "lucide-react";
import Link from "next/link";

const MAX_FILES = 3;
const MAX_BYTES = 8 * 1024 * 1024;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") || file.size > MAX_BYTES) return reject(new Error("Fotoğraf 8 MB'dan küçük olmalı."));
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Görüntü işlenemedi."));
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Geçersiz görüntü.")); };
    image.src = url;
  });
}

export default function UploadClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addFiles = (selected: File[]) => {
    setError("");
    const images = selected.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return setError("Lütfen JPG, PNG veya WEBP bir fotoğraf seç.");
    const oversized = images.find((file) => file.size > MAX_BYTES);
    if (oversized) return setError("Her fotoğraf en fazla 8 MB olabilir.");
    setFiles(images.slice(0, MAX_FILES));
    if (images.length > MAX_FILES) setError("En fazla 3 fotoğraf kullanılabilir; ilk 3 fotoğraf seçildi.");
  };

  const handleSubmit = async () => {
    if (!files.length) return;
    setError("");
    try {
      const base64Images = await Promise.all(files.map(compressImage));
      sessionStorage.setItem("falImages", JSON.stringify(base64Images));
      window.location.href = "/fal/preview";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraflar işlenirken bir hata oluştu.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
        <header className="mb-12 flex items-center justify-between"><div className="flex items-center space-x-3"><Link href="/"><span className="text-sm text-muted">← Geri</span></Link><h1 className="text-2xl font-bold">Fincanını Göster</h1></div></header>
        <section className="space-y-8">
          <div className="mb-8 text-center"><h2 className="mb-4 text-3xl font-bold">Fincan fotoğraflarını yükleyin</h2><p className="mx-auto max-w-xl text-muted">1-3 fotoğraf yükleyebilirsiniz. Fincanın içi net görünmeli. Mümkünse fincan ve tabağı ayrı fotoğraflarla ekleyin.</p></div>
          <div className="space-y-6">
            <label htmlFor="file-input" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }} className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line/50 p-8 glass transition-all hover:glass-hover card-lift"><div className="flex flex-col items-center space-y-4"><ImagePlus size={32} className="text-gold" /><span>Fotoğraf sürükleyin veya tıklayarak seçin</span><p className="text-xs text-muted">JPG, PNG veya WEBP · en fazla 3 fotoğraf · 8 MB/fotoğraf</p></div><input id="file-input" ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => addFiles(Array.from(e.target.files ?? []))} /></label>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => addFiles(Array.from(e.target.files ?? []))} />
            <div className="flex items-center space-x-3"><button type="button" onClick={() => cameraRef.current?.click()} className="flex items-center space-x-2 rounded-lg bg-gold px-5 py-3 font-medium text-background transition-all hover:bg-gold-hover card-lift"><Camera size={18} /><span>Cameradan çek</span></button><button type="button" onClick={() => inputRef.current?.click()} className="flex items-center space-x-2 rounded-lg border border-line px-5 py-3 font-medium transition-all card-lift"><UploadIcon size={18} /><span>Galeriden seç</span></button></div>
          </div>
          {files.length > 0 && <div className="space-y-6"><h3 className="mb-4 text-xl font-bold">Seçilen fotoğraflar</h3><div className="grid gap-6 md:grid-cols-3">{files.map((file, index) => { const src = URL.createObjectURL(file); return <div key={`${file.name}-${file.lastModified}`} className="relative group"><img src={src} alt={`Fotoğraf ${index + 1}`} className="h-52 w-full rounded-lg object-cover glass transition-all duration-300 hover:glass-hover" /><button type="button" aria-label={`Fotoğraf ${index + 1} kaldır`} onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white"><X size={16} /></button></div>; })}</div></div>}
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</p>}
          <div className="mt-10"><button className="flex w-full items-center justify-center px-8 py-4 bg-gold text-background rounded-lg font-medium transition-all card-lift pulse disabled:cursor-not-allowed disabled:opacity-50" disabled={!files.length} onClick={handleSubmit}><Sparkles size={20} /><span>Önizlemeye Geç</span><ChevronRight size={20} /></button></div>
          <p className="mt-6 text-sm text-muted">Fotoğraflar yalnızca fal analizi için işlenir ve tarayıcı oturumunda tutulur.</p>
        </section>
      </div>
    </main>
  );
}
