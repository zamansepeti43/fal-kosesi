"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function PreviewClient() {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("falImages");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setImages(parsed);
        } else {
          setError("Geçersiz veri formatı");
        }
      } catch (e) {
        setError("Veri okunurken bir hata oluştu");
      }
    } else {
      setError("Henüz fotoğraf yüklenmedi. Lütfen önce fotoğraf yükleyin.");
    }
  }, []);

  const handleRetry = () => {
    sessionStorage.removeItem("falImages");
    window.location.href = "/fal/upload";
  };

  const handleContinue = () => {
    window.location.href = "/fal/focus";
  };

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Link href="/fal/upload">
                <span className="text-sm text-muted">← Geri</span>
              </Link>
              <h1 className="text-2xl font-bold">Fotoğraf Önizleme</h1>
            </div>
          </header>

          <section className="space-y-6">
            <div className="flex items-center mb-6">
              <span className="text-red-400 mr-3">⚠️</span>
              <span>{error}</span>
            </div>
            <div className="mt-6">
              <Link href="/fal/upload">
                <button className="w-full flex items-center justify-center px-6 py-3 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift">
                  <Sparkles size={18} />
                  <span>Yeniden Yükle</span>
                  <ChevronRight size={17} />
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Link href="/fal/upload">
              <span className="text-sm text-muted">← Geri</span>
            </Link>
            <h1 className="text-2xl font-bold">Fotoğraf Önizleme</h1>
          </div>
        </header>

        <section className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Yüklenen Fotoğraflarınız</h2>
            <p className="text-muted max-w-xl mx-auto">
              Aşağıdaki fotoğraflar fal analizi için kullanılacaktır. Fotoğrafları değiştirmek isterseniz, geri dönerek yeniden yükleyebilirsiniz.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Fotoğraf ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg glass hover:glass-hover transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Fotoğraf {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link href="/fal/focus">
              <button className="w-full flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift">
                <Sparkles size={20} />
                <span>Odak Seçimine Geç</span>
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}