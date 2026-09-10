"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AnalyzeClient() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(180);
  const [statusText, setStatusText] = useState("Fotoğrafların sıraya alınıyor...");
  const steps = ["Fotoğraflar alındı", "Semboller inceleniyor", "Profilin eşleştiriliyor", "Yorum hazırlanıyor", "Sonuç yayınlanıyor"];

  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | null = null;
    let countdown: ReturnType<typeof setInterval> | null = null;

    const start = async () => {
      try {
        const images = JSON.parse(sessionStorage.getItem("falImages") || "[]");
        const focusData = JSON.parse(sessionStorage.getItem("falFocus") || "{\"focus\":\"genel\",\"question\":\"\"}");
        const profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}");
        if (!Array.isArray(images) || images.length === 0) throw new Error("Henüz fotoğraf yüklenmedi. Lütfen önce fotoğraf yükleyin.");

        const response = await fetch("/api/fal/queue", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "coffee", focus: focusData.focus ?? "genel", question: focusData.question ?? "", images, profile, deliveryMode: "queued", delaySeconds: 180 }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Fal sıraya alınamadı.");
        if (cancelled) return;
        setReadingId(String(data.readingId));
        setRemaining(Number(data.etaSeconds ?? 180));
        setStatusText("Falın kuyruğa alındı. Hemen sonuç göstermiyoruz; yorum hazırlanırken ilerlemeyi takip edebilirsin.");
        setStep(1);

        let lastStatus = "queued";
        poll = setInterval(async () => {
          if (!data.readingId || cancelled) return;
          try {
            const detailResponse = await fetch(`/api/readings/${encodeURIComponent(data.readingId)}`, { cache: "no-store" });
            const detail = await detailResponse.json();
            const reading = detail.reading;
            if (!reading) return;
            const status = String(reading.status ?? "queued");
            if (status !== lastStatus) {
              lastStatus = status;
              setStatusText(status === "processing" ? "Semboller ve kişisel bağlam birlikte yorumlanıyor..." : status === "ready" ? "Falın hazır. Sonuç ekranına geçiyoruz..." : status === "failed" ? (reading.error_message || "Fal hazırlanamadı.") : "Falın sırada; hazırlık başlamak üzere...");
              setStep(status === "processing" ? 3 : status === "ready" ? 4 : 1);
            }
            if (status === "ready") {
              sessionStorage.setItem("falResult", JSON.stringify(reading.result));
              if (poll) clearInterval(poll);
              window.location.href = `/fal/sonuc?id=${encodeURIComponent(data.readingId)}`;
            }
            if (status === "failed") {
              if (poll) clearInterval(poll);
              setError(reading.error_message || "Fal analizi sırasında bir hata oluştu.");
            }
          } catch { /* transient polling failure */ }
        }, 5000);

        countdown = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Fal verileri okunamadı.");
      }
    };

    void start();
    return () => { cancelled = true; if (poll) clearInterval(poll); if (countdown) clearInterval(countdown); };
  }, []);

  if (error) return <main className="min-h-screen bg-[#070714] px-5 py-10 text-white"><div className="mx-auto max-w-2xl"><Link href="/fal/upload" className="text-sm text-slate-300">← Yeniden dene</Link><section className="mt-10 rounded-3xl border border-red-400/15 bg-white/[.04] p-8 text-center"><span className="text-3xl">⚠️</span><p className="mt-4 text-slate-200">{error}</p><Link href="/fal/upload" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950"><Sparkles size={17}/> Yeniden dene</Link></section></div></main>;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const percent = Math.max(2, Math.min(99, ((180 - remaining) / 180) * 100));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,.20),_transparent_35%),#070714] px-4 py-8 text-white"><div className="mx-auto max-w-3xl"><header className="mb-8 flex items-center justify-between"><Link href="/fal/upload" className="text-sm text-slate-300">← Geri</Link><span className="text-xs text-slate-500">Kuyruk ID: {readingId ? `${readingId.slice(0, 8)}…` : "hazırlanıyor"}</span></header><section className="rounded-[30px] border border-white/10 bg-white/[.045] p-6 shadow-2xl sm:p-9"><div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400"><Clock3 className="h-7 w-7"/></div><h1 className="mt-5 font-serif text-3xl font-bold">Falın hazırlanıyor</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">{statusText}</p></div><div className="mx-auto mt-8 max-w-sm rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-4 text-center"><p className="text-[10px] uppercase tracking-[.25em] text-amber-200">Tahmini kalan süre</p><strong className="mt-2 block font-mono text-3xl">{mins}:{String(secs).padStart(2, "0")}</strong><p className="mt-1 text-[10px] text-slate-500">Falın hemen açılmıyor; sembol ve yorum katmanı tamamlandıktan sonra yayınlanacak.</p></div><div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-violet-400 transition-all" style={{ width: `${percent}%` }}/></div><div className="mt-4 grid gap-2 sm:grid-cols-5">{steps.map((label, index) => <div key={label} className={`rounded-xl border p-2 text-center text-[10px] ${index <= step ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-white/5 bg-white/[.02] text-slate-500"}`}>{index + 1}. {label}</div>)}</div><p className="mt-7 text-center text-xs text-slate-500">Sayfayı kapatsan bile kaydın hesabında kalır; sonuç hazır olduğunda “Fal Geçmişim” bölümünden de ulaşabilirsin.</p><Link href="/fal/gecmis" className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-200">Fal geçmişine git <ChevronRight size={15}/></Link></section></div></main>
  );
}
