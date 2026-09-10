"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { tarotCards } from "@/lib/tarot/cards";

const spreads = {
  single: { label: "Tek Kart", cards: 1, credits: 5, positions: ["Ana mesaj"] },
  three: { label: "3 Kart", cards: 3, credits: 12, positions: ["Geçmiş", "Şimdi", "Yakın gelecek"] },
  love: { label: "Aşk Açılımı", cards: 5, credits: 15, positions: ["Sen", "Karşı taraf", "Bağ", "Engel", "Yakın dönem"] },
  career: { label: "Kariyer Açılımı", cards: 5, credits: 15, positions: ["Mevcut durum", "Fırsat", "Engel", "Atılacak adım", "Sonuç"] },
  money: { label: "Para Açılımı", cards: 5, credits: 15, positions: ["Akış", "Fırsat", "Risk", "Denge", "Yakın dönem"] },
  celtic: { label: "Kelt Haçı", cards: 10, credits: 25, positions: ["Durum", "Engel", "Bilinç", "Kök", "Geçmiş", "Yakın gelecek", "Ben", "Çevre", "Umut/korku", "Sonuç"] },
} as const;

type SpreadId = keyof typeof spreads;

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TarotPage() {
  const [spreadId, setSpreadId] = useState<SpreadId>("three");
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState(() => shuffle(tarotCards));
  const [selected, setSelected] = useState<typeof tarotCards>([]);
  const [result, setResult] = useState(false);

  const spread = spreads[spreadId];
  const remaining = spread.cards - selected.length;
  const current = useMemo(() => deck.slice(0, 18), [deck]);

  function pick(card: (typeof tarotCards)[number]) {
    if (selected.length >= spread.cards || selected.some((item) => item.id === card.id)) return;
    setSelected((items) => [...items, { ...card, meaning: card.meaning }]);
  }

  async function finish() {
    if (selected.length !== spread.cards || !question.trim()) return;
    const profile = (() => { try { return JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}"); } catch { return {}; } })();
    const cards = selected.map((card, index) => `${index + 1}. ${card.name} — anahtarlar: ${card.keywords.join(", ")}; anlam: ${card.meaning}`);
    const response = await fetch("/api/fal/reading", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "tarot", focus: spreadId, question: `Açılım: ${spread.label}. Pozisyonlar: ${spread.positions.join(" | ")}. Seçilen kartlar:\n${cards.join("\n")}\nKullanıcı sorusu: ${question.trim()}`, profile }) });
    if (!response.ok) return;
    const data = await response.json();
    sessionStorage.setItem("falResult", JSON.stringify(data));
    setResult(true);
  }

  function reset() { setSelected([]); setDeck(shuffle(tarotCards)); setResult(false); }

  if (result) return <main className="min-h-screen bg-[#070714] px-5 py-10 text-white"><div className="mx-auto max-w-3xl text-center"><Sparkles className="mx-auto h-8 w-8 text-amber-300"/><h1 className="mt-5 font-serif text-3xl font-bold">Tarot açılımın hazır ✦</h1><p className="mt-2 text-slate-300">78 kartlık deste, açılım pozisyonları ve sorunun birlikte yorumlanması tamamlandı.</p><Link href="/fal/sonuc" className="mt-7 inline-flex rounded-full bg-amber-300 px-7 py-3 text-sm font-black text-slate-950">Sonucu gör</Link></div></main>;

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,58,237,.22),transparent_34%),#070714] px-4 py-6 text-white sm:py-10"><div className="mx-auto max-w-6xl"><header className="flex items-center justify-between"><Link href="/" className="text-sm text-slate-300"><ArrowLeft className="mr-1 inline h-4 w-4"/> Geri</Link><span className="text-xs text-amber-200">78 kartlık Tarot</span></header><div className="mt-7 grid gap-5 lg:grid-cols-[.85fr_1.15fr]"><section className="rounded-3xl border border-white/10 bg-white/[.035] p-5 shadow-xl sm:p-7"><p className="text-[10px] uppercase tracking-[.25em] text-violet-200">Açılımı seç</p><h1 className="mt-2 font-serif text-3xl font-bold">Sorunu karta dönüştür</h1><p className="mt-2 text-sm leading-6 text-slate-400">Artık sadece Büyük Arkana değil, klasik 78 kartlık deste üzerinden açılım yapıyoruz.</p><div className="mt-5 grid gap-2">{(Object.keys(spreads) as SpreadId[]).map((id) => <button key={id} type="button" onClick={() => { setSpreadId(id); setSelected([]); }} className={`rounded-2xl border p-3 text-left ${spreadId === id ? "border-amber-300/50 bg-amber-300/[.08]" : "border-white/10 bg-white/[.02]"}`}><div className="flex justify-between"><strong className="text-sm">{spreads[id].label}</strong><span className="text-xs text-amber-200">{spreads[id].credits} kredi</span></div><span className="mt-1 block text-[10px] text-slate-500">{spreads[id].cards} kart · {spreads[id].positions.join(" • ")}</span></button>)}</div><textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} placeholder="Sorunu net yaz. Örn: Bu ilişkide benim görmediğim ana tema ne?" className="mt-5 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400"/><div className="mt-3 rounded-xl border border-amber-300/15 bg-amber-300/[.04] p-3 text-xs text-amber-100"><strong>{spread.credits} kredi</strong> · {spread.cards} kart · Pozisyon + kart kombinasyonlarıyla yorumlanır.</div><button type="button" disabled={remaining !== 0 || !question.trim()} onClick={finish} className="mt-4 w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-40">Açılımı yorumla</button></section><section className="rounded-3xl border border-white/10 bg-white/[.035] p-5 shadow-xl sm:p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.25em] text-violet-200">Kartlarını seç</p><h2 className="mt-1 font-serif text-2xl font-bold">{remaining > 0 ? `${remaining} kart daha seç` : "Kartların tamam"}</h2></div><button type="button" onClick={reset} className="rounded-full border border-white/10 p-2 text-slate-400" aria-label="Tarotu yeniden karıştır"><RotateCcw className="h-4 w-4"/></button></div><div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">{current.map((card) => <button key={card.id} type="button" onClick={() => pick(card)} disabled={selected.some((item) => item.id === card.id) || selected.length >= spread.cards} className={`aspect-[2/3] overflow-hidden rounded-xl border p-1 text-left transition ${selected.some((item) => item.id === card.id) ? "border-amber-300/70 opacity-50" : "border-white/10 bg-gradient-to-br from-violet-950 to-slate-900 hover:border-amber-200/50"}`}><div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-[radial-gradient(circle_at_center,rgba(251,191,36,.16),transparent_55%)] p-2"><span className="text-[8px] text-amber-200">TAROT</span><span className="text-[10px] font-bold text-slate-200">Kart</span><span className="text-[8px] text-slate-500">Seç</span></div></button>)}</div><div className="mt-5 grid gap-2">{selected.map((card, index) => <div key={card.id} className="flex items-center justify-between rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-3"><div><span className="text-[9px] uppercase tracking-wider text-amber-200">{index + 1}. {spread.positions[index]}</span><strong className="mt-1 block font-serif">{card.name}</strong><span className="text-[10px] text-slate-500">{card.keywords.slice(0, 3).join(" • ")}</span></div><button type="button" onClick={() => setSelected((items) => items.filter((item) => item.id !== card.id))} className="text-xs text-slate-500">çıkar</button></div>)}</div></section></div></div></main>;
}
