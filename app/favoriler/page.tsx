"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Sparkles, Trash2 } from "lucide-react";

type Reading = {
  id: string;
  kind: string;
  focus: string | null;
  question: string | null;
  result: { summary?: string; symbols?: unknown[] };
  is_favorite: boolean;
  created_at: string;
};

const labels: Record<string, string> = {
  coffee: "Kahve Falı",
  love: "Aşk Falı",
  money: "Para & Kısmet",
  career: "İş & Kariyer",
  future: "Yakın Gelecek",
  daily: "Günlük Fal",
  dream: "Rüya Yorumu",
  astrology: "Doğum Haritası",
  numerology: "Numeroloji",
  general: "Fal Yorumu",
};

export default function FavorilerPage() {
  const [items, setItems] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/favorites", { cache: "no-store" });
      const data = (await response.json()) as { favorites?: Reading[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Favoriler alınamadı.");
      setItems(data.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Favoriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    try {
      const response = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readingId: id, favorite: false }) });
      if (!response.ok) await load();
    } catch {
      await load();
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.18),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 py-7 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-3"><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300"><ArrowLeft className="h-4 w-4" /> Ana sayfa</Link><div className="flex items-center gap-2 text-rose-200"><Heart className="h-4 w-4 fill-current" /> Favorilerim</div></header>
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.25em] text-rose-200">Kaydedilen okumalar</p><h1 className="mt-2 font-serif text-3xl font-black">Favorilerim</h1><p className="mt-2 text-sm text-slate-400">Beğendiğin yorumları burada sakla ve istediğin zaman yeniden aç.</p></div><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-slate-300">{items.length} kayıt</span></div>

          {loading ? <div className="py-16 text-center text-sm text-slate-400">Favoriler yükleniyor...</div> : error ? <div className="py-12 text-center"><p className="text-rose-200">{error}</p><Link href="/giris" className="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950">Giriş yap</Link></div> : items.length === 0 ? <div className="py-16 text-center"><Heart className="mx-auto h-10 w-10 text-slate-600"/><h2 className="mt-4 text-lg font-bold">Henüz favorin yok</h2><p className="mt-2 text-sm text-slate-400">Bir fal sonucundaki kalp düğmesine dokunarak buraya kaydedebilirsin.</p><Link href="/fal/upload" className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-black text-slate-950"><Sparkles className="h-4 w-4"/> Falıma Bak</Link></div> : <div className="mt-7 grid gap-3 sm:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.22em] text-amber-200">{labels[item.kind] || "Fal Yorumu"}</p><h2 className="mt-1 font-serif text-xl font-bold">{item.focus || "Genel yorum"}</h2></div><button type="button" onClick={() => void remove(item.id)} aria-label="Favoriden çıkar" className="grid h-9 w-9 place-items-center rounded-full border border-rose-300/20 bg-rose-400/10 text-rose-200"><Trash2 className="h-4 w-4"/></button></div><p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">{item.result?.summary || "Bu falın özeti bulunamadı."}</p><div className="mt-4 flex items-center justify-between"><span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleString("tr-TR")}</span><Link href={`/fal/sonuc?id=${item.id}`} className="text-xs font-semibold text-amber-200">Falımı aç →</Link></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
