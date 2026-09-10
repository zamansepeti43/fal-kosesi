"use client";

import Link from "next/link";
import { Heart, Sparkles, Star, Clock3, Coins, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DIGITAL_COMMENTATORS, FORTUNE_PRODUCTS, type DigitalCommentator, type FortuneKind } from "@/lib/fortune/catalog";

type Commentator = DigitalCommentator & { favorite?: boolean; type?: string };

const sections: Array<{ kind: FortuneKind; label: string; icon: string }> = [
  { kind: "coffee", label: "Kahve Falı Falcıları", icon: "☕" },
  { kind: "tarot", label: "Tarot Falcıları", icon: "🃏" },
  { kind: "love", label: "Aşk Falı Falcıları", icon: "💗" },
  { kind: "money", label: "Para Falı Falcıları", icon: "🪙" },
  { kind: "career", label: "Kariyer Falı Falcıları", icon: "💼" },
  { kind: "dream", label: "Rüya Tabirleri Falcıları", icon: "🌙" },
  { kind: "numerology", label: "Numeroloji Falcıları", icon: "⑨" },
  { kind: "astrology", label: "Astroloji Falcıları", icon: "☀️" },
  { kind: "katina", label: "Katina Falcıları", icon: "🌸" },
  { kind: "lenormand", label: "Lenormand Falcıları", icon: "🔮" },
  { kind: "angel", label: "Melek Kartları Falcıları", icon: "🪽" },
  { kind: "future", label: "Gelecek Falcıları", icon: "✨" },
  { kind: "daily", label: "Günlük Fal Falcıları", icon: "🌅" },
  { kind: "general", label: "Falcıya Sor Uzmanları", icon: "❓" },
];

const filters: Array<[string, FortuneKind | "all"]> = [
  ["Tümü", "all"], ["Kahve", "coffee"], ["Tarot", "tarot"], ["Aşk", "love"], ["Para", "money"], ["Kariyer", "career"], ["Rüya", "dream"], ["Astroloji", "astrology"],
];

function routeFor(kind: FortuneKind) {
  const routes: Partial<Record<FortuneKind, string>> = {
    coffee: "/fal/upload", tarot: "/fal/tarot", love: "/fal/ask", money: "/fal/para", career: "/fal/kariyer",
    dream: "/fal/ruya", numerology: "/fal/numeroloji", astrology: "/fal/yildizname", katina: "/fal/tarot",
    lenormand: "/fal/tarot", angel: "/fal/tarot", future: "/fal/sor", daily: "/fal/gunluk", general: "/fal/sor",
  };
  return routes[kind] ?? "/";
}

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
    } catch {
      setItems((current) => current.map((value) => value.id === item.id ? { ...value, favorite: item.favorite } : value));
    }
  }

  function cardsFor(sectionKind: FortuneKind) {
    return visible.filter((item) => item.specialties.includes(sectionKind)).slice(0, 5);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(139,92,246,.2),transparent_30%),#070714] px-3 py-5 text-white sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-violet-200">← Ana sayfa</Link>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[.3em] text-violet-300">Fal Köşesi • AI Karakterler</p>
            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">Sana uygun falcıyı seç</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Her fal türünde 5 farklı sanal karakter var. Bunlar gerçek kişi değildir; her karakterin kendine özgü yorum tarzı, uzmanlıkları, teslim süresi ve kredi ücreti bulunur.</p>
          </div>
          <Link href="/kredi" className="rounded-2xl border border-violet-300/20 bg-violet-400/[.08] px-4 py-3 text-xs font-bold text-violet-100">Kredi satın al</Link>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0d0d20]/90 p-3 shadow-2xl sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filters.map(([label, value]) => <button key={value} type="button" onClick={() => setKind(value)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${kind === value ? "border-violet-400/60 bg-violet-500/20 text-violet-100" : "border-white/10 bg-white/[.02] text-slate-500 hover:text-slate-200"}`}>{label}</button>)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{kind === "all" ? `${sections.length} fal türü • ${visible.length} AI karakter` : `${visible.length} AI karakter`}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-white/10 bg-[#111126] px-3 py-2 text-xs text-slate-300"><option value="online">Çevrimiçi + puan</option><option value="fast">En hızlı</option><option value="price">En uygun kredi</option></select>
          </div>
        </section>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {sections.filter((section) => kind === "all" || section.kind === kind).map((section) => {
            const cards = cardsFor(section.kind);
            if (!cards.length) return null;
            return (
              <section key={section.kind} className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d20]/90 p-3 shadow-xl sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500/15 text-xl">{section.icon}</span><div><h2 className="font-serif text-lg font-bold sm:text-xl">{section.label}</h2><p className="text-[10px] text-slate-500">5 farklı AI karakter • {FORTUNE_PRODUCTS[section.kind].label}</p></div></div>
                  <Link href={routeFor(section.kind)} className="hidden items-center gap-1 text-[10px] font-bold text-violet-300 sm:flex">Fal türüne git <ChevronRight className="h-3 w-3" /></Link>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {cards.map((item) => {
                    const selectedHref = `${routeFor(section.kind)}?commentator=${encodeURIComponent(item.id)}`;
                    return (
                      <article key={item.id} className="group min-w-0 rounded-2xl border border-white/8 bg-white/[.025] p-2 transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/[.05] sm:p-2.5">
                        <div className="relative overflow-hidden rounded-xl bg-[#17152c]">
                          <img src={item.avatarUrl} alt={`${item.name} AI karakter avatarı`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                          <span className={`absolute left-1.5 top-1.5 rounded-full bg-black/65 px-1.5 py-1 text-[8px] font-bold backdrop-blur ${item.availability === "online" ? "text-emerald-300" : item.availability === "busy" ? "text-amber-300" : "text-slate-400"}`}>● {item.availability === "online" ? "Çevrimiçi" : item.availability === "busy" ? "Meşgul" : "Çevrimdışı"}</span>
                          <button type="button" onClick={() => toggleFavorite(item)} aria-label={`${item.name} favori`} className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 backdrop-blur"><Heart className={`h-3 w-3 ${item.favorite ? "fill-current text-rose-300" : "text-white/80"}`} /></button>
                        </div>
                        <div className="mt-2 flex items-center gap-1"><h3 className="truncate text-[12px] font-extrabold">{item.name}</h3><Sparkles className="h-3 w-3 shrink-0 text-violet-300" /></div>
                        <p className="mt-0.5 h-7 overflow-hidden text-[9px] leading-3.5 text-violet-200">{item.title}</p>
                        <div className="mt-1 flex items-center gap-1 text-[9px] text-amber-300"><Star className="h-2.5 w-2.5 fill-current" />{item.rating}<span className="truncate text-slate-600">• {item.readingCount.toLocaleString("tr-TR")}</span></div>
                        <p className="mt-1.5 line-clamp-2 h-7 text-[8px] leading-3.5 text-slate-500">{item.description}</p>
                        <div className="mt-2 flex items-center justify-between gap-1 text-[8px]"><span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="h-2.5 w-2.5" />{item.etaMinutes} dk</span><span className="inline-flex items-center gap-1 font-black text-amber-200"><Coins className="h-2.5 w-2.5" />{item.priceCredits} kredi</span></div>
                        <Link href={selectedHref} className="mt-2 flex w-full items-center justify-center rounded-xl bg-violet-500 px-2 py-2 text-[9px] font-black text-white shadow-lg shadow-violet-900/20">Seç</Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
