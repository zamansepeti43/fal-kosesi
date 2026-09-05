"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function AnalyzeClient() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const steps = [
    "Fincanın inceleniyor...",
    "Şekiller belirleniyor...",
    "Öne çıkan semboller aranıyor...",
    "Falın yorumlanıyor...",
    "Sonuçlar hazırlanıyor..."
  ];

  useEffect(() => {
    const images = JSON.parse(sessionStorage.getItem("falImages") || "[]");
    const focusData = JSON.parse(sessionStorage.getItem("falFocus") || "{\"focus\":\"genel\",\"question\":\"\"}");

    if (images.length === 0) {
      setError("Henüz fotoğraf yüklenmedi. Lütfen önce fotoğraf yükleyin.");
      return;
    }

    let currentStep = 0;
    let progressValue = 0;
    let mounted = true;
    let analysisStarted = false;

    const interval = setInterval(() => {
      if (!mounted) return;
      progressValue += Math.random() * 15;
      if (progressValue >= 100) {
        progressValue = 0;
        currentStep++;
        if (currentStep >= steps.length) {
          clearInterval(interval);
          if (!analysisStarted) {
            analysisStarted = true;
            void (async () => {
              try {
                const response = await fetch("/api/fal/reading", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    kind: focusData.focus ?? "general",
                    focus: focusData.focus ?? "genel",
                    question: focusData.question ?? "",
                    images,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Fal analizi alınamadı.");
                }

                const result = await response.json();
                sessionStorage.setItem("falResult", JSON.stringify(result));
                setCompleted(true);
                setTimeout(() => {
                  window.location.href = "/fal/sonuc";
                }, 1000);
              } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Fal analizi sırasında bir hata oluştu.");
              }
            })();
          }
        } else {
          setStep(currentStep);
        }
      }
      setProgress(progressValue);
    }, 100);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Link href="/fal/upload">
                <span className="text-sm text-muted">← Geri</span>
              </Link>
              <h1 className="text-2xl font-bold">Analiz Hatası</h1>
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
                  <span>Yeniden Dene</span>
                  <ChevronRight size={17} />
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Link href="/fal/upload">
                <span className="text-sm text-muted">← Geri</span>
              </Link>
              <h1 className="text-2xl font-bold">Analiz Tamamlandı</h1>
            </div>
          </header>

          <div className="text-center py-12">
            <Sparkles size={32} className="text-gold mb-4" />
            <h2 className="text-3xl font-bold">Falınız Hazır!</h2>
            <p className="text-muted mb-6">
              Sonuçlarınız yükleniyor... Lütfen bekleyiniz.
            </p>
            <Link href="/fal/sonuc">
              <button className="w-full flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift">
                <Sparkles size={20} />
                <span>Sonuçları Gör</span>
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>
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
            <h1 className="text-2xl font-bold">Falınız Hazırlanıyor</h1>
          </div>
        </header>

        <section className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Analiz Süreci</h2>
            <p className="text-muted max-w-xl mx-auto">
              Fal çözümlemenizdeki adımları aşağıda takip edebilirsiniz.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-full bg-line/30 rounded-lg h-4 overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-1000"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <p className="mt-2 text-sm text-center text-muted">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-xl mb-2">Şu anki adım:</p>
            <p className="text-muted text-lg">
              {steps[step]}
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted max-w-lg mx-auto">
              Bu işlem genellikle 10-15 saniye sürer. Lütfen sayfayı yenilemeyin veya geri dönmeyin.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}