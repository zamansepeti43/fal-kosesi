"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AnalyzeClient() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const steps = [
    "Fincanın inceleniyor...",
    "Şekiller ve semboller belirleniyor...",
    "Profilin ve odak alanın eşleştiriliyor...",
    "Sana özel yorum oluşturuluyor...",
    "Sonuçların hazırlanıyor...",
  ];

  useEffect(() => {
    let images: string[] = [];
    let focusData: { focus?: string; question?: string } = { focus: "genel", question: "" };
    let profile: Record<string, unknown> = {};

    try {
      images = JSON.parse(sessionStorage.getItem("falImages") || "[]");
      focusData = JSON.parse(sessionStorage.getItem("falFocus") || "{\"focus\":\"genel\",\"question\":\"\"}");
      profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}");
    } catch {
      setError("Fal verileri okunamadı. Lütfen yeniden deneyin.");
      return;
    }

    if (!Array.isArray(images) || images.length === 0) {
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
                    kind: "coffee",
                    focus: focusData.focus ?? "genel",
                    question: focusData.question ?? "",
                    images,
                    profile,
                  }),
                });

                if (!response.ok) throw new Error("Fal analizi alınamadı.");
                const result = await response.json();
                sessionStorage.setItem("falResult", JSON.stringify(result));
                setCompleted(true);
                setTimeout(() => { window.location.href = "/fal/sonuc"; }, 900);
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

    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#070714] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-16 pt-8">
          <header className="mb-10 flex items-center gap-3"><Link href="/fal/upload" className="text-sm text-slate-300">← Geri</Link><h1 className="text-xl font-bold">Analiz Hatası</h1></header>
          <section className="rounded-3xl border border-white/10 bg-white/[.04] p-7 text-center shadow-2xl backdrop-blur-xl">
            <span className="text-3xl">⚠️</span><p className="mt-4 text-slate-200">{error}</p>
            <Link href="/fal/upload" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-6 py-3 font-bold text-slate-950"><Sparkles size={17}/> Yeniden Dene <ChevronRight size={17}/></Link>
          </section>
        </div>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[#070714] text-white"><div className="mx-auto max-w-3xl px-5 py-16 text-center"><Sparkles size={34} className="mx-auto text-amber-300"/><h2 className="mt-5 font-serif text-3xl font-bold">Falın hazır ✦</h2><p className="mt-2 text-slate-300">Kişisel yorumun oluşturuldu. Sonuçlarına geçiyoruz...</p><Link href="/fal/sonuc" className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-300 px-7 py-3 font-bold text-slate-950">Sonuçları Gör <ChevronRight size={18}/></Link></div></main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,.20),_transparent_35%),#070714] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center gap-3"><Link href="/fal/upload" className="text-sm text-slate-300">← Geri</Link><h1 className="text-xl font-bold sm:text-2xl">Falın hazırlanıyor</h1></header>
        <section className="rounded-[28px] border border-white/10 bg-white/[.045] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 shadow-[0_0_35px_rgba(168,85,247,.35)]"><Sparkles className="h-7 w-7"/></div><h2 className="mt-5 font-serif text-2xl font-bold">Sana özel okuma hazırlanıyor</h2><p className="mt-2 text-sm leading-6 text-slate-300">Fincanındaki semboller, seçtiğin odak ve profilindeki bilgiler birlikte değerlendiriliyor.</p></div>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-violet-400 transition-all" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}/></div>
          <div className="mt-3 flex justify-between text-xs text-slate-400"><span>{steps[step]}</span><span>{Math.round(progress)}%</span></div>
          <div className="mt-8 grid gap-2 sm:grid-cols-5">{steps.map((label, index) => <div key={label} className={`rounded-xl border p-2 text-center text-[10px] ${index <= step ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-white/5 bg-white/[.02] text-slate-500"}`}>{index + 1}. {label.replace("...", "")}</div>)}</div>
          <p className="mt-7 text-center text-xs text-slate-500">Bu işlem birkaç saniye sürebilir. Sayfayı kapatma.</p>
        </section>
      </div>
    </main>
  );
}
