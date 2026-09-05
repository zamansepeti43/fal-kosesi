"use client";

import { useRef, useState } from "react";
import {
  Camera,
  ChevronRight,
  Coffee,
  ImagePlus,
  Sparkles,
  Upload as UploadIcon,
} from "lucide-react";
import Link from "next/link";

export default function UploadClient() {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(
      (file) => file.type.startsWith("image/")
    );
    setFiles(selected.slice(0, 3));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) return;

    const promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        sessionStorage.setItem("falImages", JSON.stringify(base64Images));
        window.location.href = "/fal/preview";
      })
      .catch((err) => {
        console.error("Error converting files to base64:", err);
        alert("Fotoğraflar işlenirken bir hata oluştu. Lütfen tekrar deneyin.");
      });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <span className="text-sm text-muted">← Geri</span>
            </Link>
            <h1 className="text-2xl font-bold">Fincanını Göster</h1>
          </div>
        </header>

        <section className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Fincan fotoğraflarını yükleyin</h2>
            <p className="text-muted max-w-xl mx-auto">
              1-3 fotoğraf yükleyebilirsiniz. Fincanın içi net görünmeli. Mümkünse fincan ve tabağı ayrı fotoğraflarla ekleyin.
            </p>
          </div>

          <div className="space-y-6">
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center p-8 glass hover:glass-hover transition-all card-lift cursor-pointer border-2 border-dashed border-line/50 rounded-lg"
            >
              <div className="flex flex-col items-center space-y-4">
                <ImagePlus size={32} className="text-gold" />
                <span>Fotoğraf sürükleyin veya tıklayarak seçin</span>
                <p className="text-xs text-muted">JPG, PNG veya WEBP · en fazla 3 fotoğraf</p>
              </div>
              <input
                id="file-input"
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={addFiles}
              />
            </label>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center space-x-2 px-5 py-3 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift"
              >
                <UploadIcon size={18} />
                <span>Cameradan çek</span>
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Seçilen fotoğraflar</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Fotoğraf ${index + 1}`}
                      className="w-full h-52 object-cover rounded-lg glass hover:glass-hover transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col space-y-2">
                        <span className="text-white font-medium">Fotoğraf {index + 1}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="px-3 py-1 bg-gold hover:bg-gold-hover text-background rounded-lg text-xs font-medium"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <button
              className="w-full flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift pulse disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={files.length === 0}
              onClick={handleSubmit}
            >
              <Sparkles size={20} />
              <span>Önizlemeye Geç</span>
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="mt-6 text-sm text-muted">
            Fotoğraflar işlenerek güvenli bir şekilde kullanılır ve işlem sonrası silinir.
          </p>
        </section>
      </div>
    </main>
  );
}