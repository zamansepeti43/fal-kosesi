"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Heart, Sparkles } from "lucide-react";

type Reading = {
  id: string;
  kind: string;
  focus: string | null;
  question: string | null;
  result: { summary?: string };
  is_favorite: boolean;
  created_at: string;
};

const labels: Record<string, string> = {
  coffee: "Kahve Falı", love: "Aşk Falı", money: "Para & Kısmet", career: "İş & Kariyer", future: "Yakın Gelecek", daily: "Günlük Fal", dream: "Rüya Yorumu", astrology: "Doğum Haritası", numerology: "Numeroloji", general: "Fal Yorumu",
};

export default function Gecmis() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/readings?limit=100", { cache: "no-store" });
      const data = (await response.json()) as { readings?: Reading[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Fal geçmişi alınamadı.");
      setReadings(data.readings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fal geçmişi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const toggleFavorite = async (reading: Reading) => {
    const next = !reading.is_favorite;
    setReadings((current) => current.map((item) => item.id === reading.id ? { ...item, is_favorite: next } : item));
    try {
      const response = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readingId: reading.id, favorite: next }) });
      if (!response.ok) await load();
    } catch {
      await load();
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.18),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 py-7 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-3"><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300"><ArrowLeft className="h-4 w-4"/> Ana sayfa</Link><Link href="/favoriler" className="text-xs font-semibold text-rose-200">Favorilerim →</Link></header>
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.25em] text-amber-200">Kayıtlı okumaların</p><h1 className="mt-2 font-serif text-3xl font-black">Fal Geçmişim</h1><p className="mt-2 text-sm text-slate-400">Daha önce yaptığın tüm okumaları aç, favorile ve tekrar incele.</p></div><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-slate-300">{readings.length} fal</span></div>
          {loading ? <div className="py-16 text-center text-sm text-slate-400">Geçmiş yükleniyor...</div> : error ? <div className="py-12 text-center"><p className="text-rose-200">{error}</p><Link href="/giris" className="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950">Giriş yap</Link></div> : readings.length === 0 ? <div className="py-16 text-center"><Sparkles className="mx-auto h-10 w-10 text-slate-600"/><h2 className="mt-4 text-lg font-bold">Henüz kayıtlı falın yok</h2><p className="mt-2 text-sm text-slate-400">İlk falını hazırladığında burada otomatik olarak saklanacak.</p><Link href="/fal/upload" className="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-black text-slate-950">Falımı Yorumla</Link></div> : <div className="mt-7 space-y-3">{readings.map((reading) => <article key={reading.id} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-[9px] uppercase tracking-[.22em] text-amber-200">{labels[reading.kind] || "Fal Yorumu"}</p><h2 className="mt-1 font-serif text-xl font-bold">{reading.focus || "Genel yorum"}</h2><p className="mt-1 text-[10px] text-slate-500">{new Date(reading.created_at).toLocaleString("tr-TR")}</p></div><button type="button" onClick={() => void toggleFavorite(reading)} aria-label={reading.is_favorite ? "Favoriden çıkar" : "Favoriye ekle"} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${reading.is_favorite ? "border-rose-300/30 bg-rose-400/15 text-rose-200" : "border-white/10 bg-white/[.03] text-slate-400"}`}><Heart className={`h-4 w-4 ${reading.is_favorite ? "fill-current" : ""}`}/></button></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{reading.result?.summary || "Özet bulunamadı."}</p><div className="mt-4 flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500"><Clock className="h-3.5 w-3.5"/> Kayıtlı okuma</span><Link href={`/fal/sonuc?id=${reading.id}`} className="text-xs font-semibold text-amber-200">Falımı aç →</Link></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
