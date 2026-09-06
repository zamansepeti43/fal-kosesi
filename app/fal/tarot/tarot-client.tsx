"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Crown, Sparkles, Shuffle, Wand2, Heart, BriefcaseBusiness, WalletCards } from "lucide-react";
import { TAROT_SPREADS, TarotCard } from "@/types/tarot";
import { tarotCards } from "@/lib/tarot/cards";

const getCard = (exclude: Set<string>): TarotCard => {
  const available = tarotCards.filter((card) => !exclude.has(card.id));
  return available[Math.floor(Math.random() * available.length)] ?? tarotCards[0];
};

const spreadCopy: Record<string, string> = {
  single: "Tek kart, şu anda hayatında en çok dikkat etmen gereken temayı gösterir.",
  "three-card": "Üç kart birlikte geçmişteki izi, bugünkü enerjiyi ve önündeki olası yönü anlatır.",
  love: "Aşk açılımı; senin enerjini, bağın dinamiğini ve ilişkinin önündeki temayı birlikte ele alır.",
};

function TarotCardVisual({ card, index, faceDown = false }: { card: TarotCard; index: number; faceDown?: boolean }) {
  return (
    <div className="relative h-[190px] w-[122px] overflow-hidden rounded-[18px] border border-amber-200/60 bg-[radial-gradient(circle_at_50%_25%,rgba(245,158,11,.22),transparent_35%),linear-gradient(145deg,#100c25,#241044,#0b1025)] shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_24px_rgba(168,85,247,.22)] sm:h-[220px] sm:w-[142px]">
      <div className="absolute inset-[7px] rounded-[13px] border border-amber-200/30" />
      <div className="absolute inset-[12px] rounded-[10px] border border-violet-300/20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,.20),transparent_55%)]" />
      {faceDown ? (
        <div className="absolute inset-5 rounded-xl border border-amber-200/25 bg-[repeating-linear-gradient(45deg,rgba(245,158,11,.08)_0,rgba(245,158,11,.08)_2px,transparent_2px,transparent_8px)]"><div className="absolute inset-5 rounded-lg border border-amber-200/25"/><div className="absolute inset-0 grid place-items-center text-3xl text-amber-200">✦</div></div>
      ) : (
        <>
          <div className="absolute left-4 top-4 text-[9px] font-bold tracking-[.25em] text-amber-200">{String(index + 1).padStart(2, "0")}</div>
          <div className="absolute inset-x-3 top-12 text-center font-serif text-xl font-bold text-amber-100 sm:text-2xl">{card.name}</div>
          <div className="absolute inset-x-4 top-[82px] grid h-16 place-items-center rounded-full border border-amber-200/30 bg-violet-500/10 text-3xl text-amber-200 shadow-[0_0_30px_rgba(245,158,11,.15)]">✦</div>
          <div className="absolute inset-x-3 bottom-8 text-center text-[8px] uppercase tracking-[.22em] text-violet-200">{card.keywords.slice(0, 2).join(" • ")}</div>
          <div className="absolute bottom-3 left-0 right-0 text-center text-[7px] uppercase tracking-[.3em] text-amber-200/70">Fal Köşesi</div>
        </>
      )}
    </div>
  );
}

export default function TarotClient() {
  const [selectedSpread, setSelectedSpread] = useState("single");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Dostum");

  const draw = () => {
    setLoading(true);
    setTimeout(() => {
      const spread = TAROT_SPREADS.find((item) => item.id === selectedSpread) ?? TAROT_SPREADS[0];
      const used = new Set<string>();
      const cards: TarotCard[] = [];
      for (let i = 0; i < spread.cardCount; i++) {
        const card = getCard(used);
        used.add(card.id);
        cards.push(card);
      }
      setDrawnCards(cards);
      setLoading(false);
    }, 800);
  };

  const personalizedText = () => {
    const focus = question.trim() ? `“${question.trim()}” sorunun` : "bu dönemde zihnini meşgul eden konuların";
    const names = drawnCards.map((card) => card.name).join(", ");
    return `${name}, ${focus} için açılan ${names} kartları birlikte okunduğunda tek bir karttan daha güçlü bir hikâye ortaya çıkıyor. Buradaki ana tema, geçmişten gelen bir etkinin bugün vereceğin kararı nasıl şekillendirdiği ve önündeki seçeneği hangi duyguyla karşılayacağın. Kartların mesajını kesin bir gelecek vaadi olarak değil, kendi kararlarını düşünürken kullanabileceğin sembolik bir ayna olarak değerlendir.`;
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(124,58,237,.25),transparent_34%),linear-gradient(180deg,#080817,#05050d)] px-4 py-5 text-white sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex items-center justify-between"><Link href="/" className="text-xs text-slate-300 sm:text-sm">← Ana sayfa</Link><div className="flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-amber-200"><Crown className="h-3 w-3"/> Premium Tarot</div></header>

        {drawnCards.length === 0 ? (
          <section className="rounded-[28px] border border-violet-300/15 bg-white/[.035] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_35px_rgba(168,85,247,.35)]"><Sparkles className="h-7 w-7"/></div><p className="mt-5 text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">Kartlarınla konuş</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Tarot Falı</h1><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-300">Desteni seç. Sorunu yaz. Kartlarını aç ve yorumunu hayatındaki bağlamla birlikte oku.</p></div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">{TAROT_SPREADS.map((spread) => <button key={spread.id} type="button" onClick={() => setSelectedSpread(spread.id)} className={`rounded-[22px] border p-4 text-left transition ${selectedSpread === spread.id ? "border-amber-300/50 bg-amber-300/[.08] shadow-[0_0_30px_rgba(245,158,11,.10)]" : "border-white/10 bg-white/[.025]"}`}><div className="mb-3 flex justify-center gap-[-8px]">{Array.from({ length: spread.cardCount }).map((_, i) => <div key={i} className="-mx-1 scale-75 first:ml-0"><TarotCardVisual card={tarotCards[i] ?? tarotCards[0]} index={i} faceDown/></div>)}</div><h2 className="font-serif text-lg font-bold">{spread.name}</h2><p className="mt-1 text-xs leading-5 text-slate-400">{spreadCopy[spread.id] ?? spread.description}</p></button>)}</div>
            <div className="mt-5"><label className="mb-2 block text-sm font-semibold">Sorunu veya niyetini yaz</label><textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="Örn: Hayatımda yeni bir ilişkiye yer açmalı mıyım?" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"/><p className="mt-2 text-[10px] text-slate-500">Sorun ne kadar kişisel olursa yorum da o kadar kişisel bir bağlam kazanır.</p></div>
            <button type="button" onClick={draw} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-violet-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,.22)] disabled:opacity-60">{loading ? <><Shuffle className="h-4 w-4 animate-spin"/> Kartların karılıyor...</> : <><Wand2 className="h-4 w-4"/> Kartlarımı Aç</>}</button>
          </section>
        ) : (
          <>
            <section className="rounded-[28px] border border-amber-200/20 bg-[radial-gradient(circle_at_85%_10%,rgba(245,158,11,.14),transparent_35%),rgba(20,14,35,.90)] p-5 shadow-2xl sm:p-8"><p className="text-[9px] font-bold uppercase tracking-[.28em] text-amber-200">{name} için açılım</p><h1 className="mt-2 font-serif text-3xl font-bold">Kartların bugün sana ne söylüyor? ✦</h1>{question && <p className="mt-2 text-sm text-slate-300">“{question}”</p>}<div className="mt-6 flex flex-wrap items-end justify-center gap-3 sm:gap-5">{drawnCards.map((card, index) => <div key={`${card.id}-${index}`} className="text-center"><TarotCardVisual card={card} index={index}/><p className="mt-2 text-[10px] uppercase tracking-[.18em] text-amber-200">{index + 1}. Kart</p></div>)}</div></section>
            <section className="mt-4 rounded-[24px] border border-violet-300/15 bg-white/[.035] p-5 sm:p-7"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-300"/><h2 className="font-serif text-xl font-bold">Kişisel Tarot Yorumu</h2></div><p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">{personalizedText()}</p></section>
            <section className="mt-4 grid gap-3 sm:grid-cols-2">{drawnCards.map((card, index) => <article key={`detail-${card.id}-${index}`} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold text-amber-100">{card.name}</h2><span className="text-[9px] uppercase tracking-[.2em] text-slate-500">{card.keywords.join(" • ")}</span></div><p className="mt-3 text-sm leading-7 text-slate-300">{card.meaning}</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl bg-rose-400/[.05] p-3"><div className="flex items-center gap-1 text-xs font-semibold text-rose-200"><Heart className="h-3.5 w-3.5"/> Aşk</div><p className="mt-1 text-xs leading-5 text-slate-400">{card.love}</p></div><div className="rounded-xl bg-sky-400/[.05] p-3"><div className="flex items-center gap-1 text-xs font-semibold text-sky-200"><BriefcaseBusiness className="h-3.5 w-3.5"/> Kariyer</div><p className="mt-1 text-xs leading-5 text-slate-400">{card.career}</p></div></div></article>)}</section>
            <div className="mt-5 flex gap-2"><button type="button" onClick={() => setDrawnCards([])} className="flex-1 rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-semibold">Yeni Açılım</button><Link href="/" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950">Ana Sayfa <ChevronRight className="h-4 w-4"/></Link></div>
          </>
        )}
      </div>
    </main>
  );
}
