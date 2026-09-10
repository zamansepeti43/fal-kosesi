"use client";

import Link from "next/link";
import { Heart, Mic2, Star, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string };
const filters: Array<[string, string, FortuneKind | "all"]> = [
  ["Tümü", "Hepsi", "all"], ["Kahve", "Kahve", "coffee"], ["Aşk", "Aşk", "love"], ["Tarot", "Tarot", "tarot"], ["Rüya", "Rüya", "dream"], ["Numeroloji", "Numeroloji", "numerology"],
];

export default function FalcilarPage() {
  const [kind, setKind] = useState<FortuneKind | "all">("all");
  const [items, setItems] = useState<Commentator[]>(DIGITAL_COMMENTATORS.map((item) => ({ ...item, favorite: false, type: "ai" })));
  const [sort, setSort] = useState("online");

  useEffect(() => {
    const query = kind === "all" ? "" : `?kind=${encodeURIComponent(kind)}`;
    void fetch(`/api/fal/commentators${query}`).then((r) => r.ok ? r.json() : null).then((data) => {
      if (Array.isArray(data?.commentators) && data.commentators.length) setItems(data.commentators);
    }).catch(() => undefined);
  }, [kind]);

  const visible = useMemo(() => [...items].sort((a, b) => {
    if (sort === "fast") return a.etaMinutes - b.etaMinutes;
    if (sort === "price") return a.priceCredits - b.priceCredits;
    return Number(b.availability === "online") - Number(a.availability === "online") || b.rating - a.rating;
  }), [items, sort]);

  async function toggleFavorite(item: Commentator) {
    const next = !item.favorite;
    setItems((current) => current.map((value) => value.id === item.id ? { ...value, favorite: next } : value));
    try {
      await fetch("/api/commentators/favorite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ commentatorId: item.id, favorite: next }) });
    } catch { setItems((current) => current.map((value) => value.id === item.id ? { ...value, favorite: item.favorite } : value)); }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,.22),transparent_32%),#070714] px-4 py-6 text-white sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/" className="text-xs text-slate-400">← Ana sayfa</Link><p className="mt-5 text-[10px] font-bold uppercase tracking-[.28em] text-amber-200">Fal Köşesi • Yorumcular</p><h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Sana uygun falcıyı seç</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Uzmanlık, puan, hız ve kredi ücretini karşılaştır. Şimdilik listede dijital yorumcularımız var; doğrulanmış insan falcılar geldiğinde aynı pazaryerinde yer alacak.</p></div><Link href="/kredi" className="rounded-full border border-amber-300/25 bg-amber-300/[.05] px-4 py-2 text-xs font-bold text-amber-100">Kredileri gör</Link></header>

        <section className="mt-7 rounded-3xl border border-white/10 bg-white/[.035] p-4 shadow-2xl sm:p-5">
          <div className="flex flex-wrap gap-2">{filters.map(([label, , value]) => <button type="button" key={value} onClick={() => setKind(value)} className={`rounded-full border px-4 py-2 text-xs font-semibold ${kind === value ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 text-slate-400"}`}>{label}</button>)}</div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500"><span>{visible.length} yorumcu</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300"><option value="online">Çevrimiçi + puan</option><option value="fast">En hızlı</option><option value="price">En uygun kredi</option></select></div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => <article key={item.id} className="rounded-3xl border border-white/10 bg-white/[.035] p-5 shadow-xl">
            <div className="flex items-start gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-fuchsia-400/15"><UserRound className="h-6 w-6 text-violet-100" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-serif text-xl font-bold">{item.name}</h2>{item.verified && <span className="text-[9px] text-emerald-200">✓ doğrulanmış</span>}</div><p className="text-xs text-violet-200">{item.title}</p></div><button type="button" onClick={() => toggleFavorite(item)} className="rounded-full border border-white/10 p-2 text-slate-400" aria-label={`${item.name} favori`}><Heart className={`h-4 w-4 ${item.favorite ? "fill-current text-rose-300" : ""}`} /></button></div>
            <p className="mt-3 text-xs leading-5 text-slate-400">{item.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white/[.03] p-2"><Star className="mx-auto h-3.5 w-3.5 fill-current text-amber-300"/><strong className="mt-1 block text-sm">{item.rating}</strong><span className="text-[9px] text-slate-500">puan</span></div><div className="rounded-xl bg-white/[.03] p-2"><strong className="block text-sm">{item.readingCount.toLocaleString("tr-TR")}</strong><span className="text-[9px] text-slate-500">yorum</span></div><div className="rounded-xl bg-white/[.03] p-2"><strong className="block text-sm">{item.etaMinutes} dk</strong><span className="text-[9px] text-slate-500">bekleme</span></div></div>
            <div className="mt-4 flex items-center justify-between"><span className={`text-[10px] font-semibold ${item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}`}>● {item.availability === "online" ? "Çevrimiçi" : item.availability === "busy" ? "Meşgul" : "Çevrimdışı"}</span><span className="text-right"><strong className="block text-amber-200">{item.priceCredits} kredi</strong><span className="inline-flex items-center gap-1 text-[9px] text-slate-500"><Mic2 className="h-3 w-3" />+{item.voiceCredits}</span></span></div>
            <Link href={`/fal/${item.specialties.includes("coffee") ? "upload" : item.specialties.includes("tarot") ? "tarot" : item.specialties.includes("love") ? "sor" : "sor"}?commentator=${encodeURIComponent(item.id)}`} className="mt-4 flex w-full items-center justify-center rounded-full bg-amber-300 px-4 py-3 text-xs font-black text-slate-950">Bu yorumcuyu seç</Link>
          </article>)}
        </section>
      </div>
    </main>
  );
}
