"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Star,
  Shuffle,
  Wand2
} from "lucide-react";
import { TAROT_SPREADS, TarotCard } from "@/types/tarot";
import { tarotCards } from "@/lib/tarot/cards";

const getRandomCard = (): TarotCard => {
  const deck = tarotCards.length > 0 ? tarotCards : [
    {
      id: "fallback",
      name: "Deli",
      meaning: "Yeni başlangıçlar ve cesur adımlar.",
      love: "Duygusal hayatın yeniden şekillenmesi.",
      career: "Yeni fırsatların kapısı aralanıyor.",
      keywords: ["başlangıç", "cesaret", "özgürlük"]
    }
  ];

  const selected = deck[Math.floor(Math.random() * deck.length)];

  return {
    id: Number.isNaN(Number(selected.id)) ? Math.floor(Math.random() * 1000) : Number(selected.id),
    name: selected.name,
    arcana: "Major Arcana",
    suit: null,
    meaning: selected.meaning,
    meaning_reverse: selected.meaning
  };
};

const buildReading = (cards: TarotCard[], spreadId: string): string => {
  const spread = TAROT_SPREADS.find((item) => item.id === spreadId) || TAROT_SPREADS[0];

  const cardLines = cards
    .map((card, index) => {
      const position = spread.positions[index]?.name || `Kart ${index + 1}`;
      return `${position}: ${card.name} — ${card.meaning}`;
    })
    .join(" ");

  const focus = cards[0]?.meaning || "güçlü bir yön değişimi";
  const mood =
    spreadId === "single"
      ? "Bu tek kart, şu anki enerjinin merkezini açığa çıkarıyor."
      : spreadId === "three-card"
        ? "Bu üç kart birlikte geçmişten geleceğe bir yol çiziyor."
        : "Bu aşk düzeni, ilişki akışını ve duygusal dengeyi ortaya koyuyor.";

  return `${mood} ${cardLines} Genel olarak bu enerji, ${focus.toLowerCase()} yönünde ilerlemeyi ve dikkatli, bilinçli adımlar atmayı öneriyor. Kalbin, zihnin ve kararların bu dönemde uyum içinde olması önemli; en doğru hamle, iç sesine güvenmek ve mevcut fırsatı doğru yorumlamaktır.`;
};

const CARD_TINTS = [
  "from-amber-200/30 via-violet-500/15 to-fuchsia-500/35",
  "from-indigo-200/30 via-sky-500/15 to-violet-500/30",
  "from-rose-200/30 via-pink-500/15 to-fuchsia-500/30",
  "from-emerald-200/30 via-teal-500/15 to-cyan-500/30"
];

const renderTarotCard = (cardName: string, index: number, faceDown = false) => {
  const tint = CARD_TINTS[index % CARD_TINTS.length];

  return (
    <div
      className="relative shrink-0"
      style={{ transform: "perspective(1000px) rotateX(8deg) rotateY(-10deg)" }}
    >
      <div className="relative h-[108px] w-[72px] rounded-[18px] border border-amber-200/60 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 shadow-[0_10px_18px_rgba(15,23,42,0.68),0_0_14px_rgba(168,85,247,0.24)]">
        <div className="absolute inset-[7px] rounded-[12px] border border-amber-200/35 bg-gradient-to-br from-amber-100/10 to-violet-400/5" />
        <div className={`absolute inset-[10px] rounded-[10px] bg-gradient-to-br ${tint}`} />
        <div className="absolute inset-[12px] rounded-[8px] border border-amber-100/40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_40%),linear-gradient(135deg,_rgba(15,23,42,0.25),_rgba(88,28,135,0.15))]" />

        {!faceDown ? (
          <>
            <div className="absolute left-3 top-3 text-[10px] font-black tracking-[0.25em] text-amber-100">✦</div>
            <div className="absolute right-3 bottom-3 text-[10px] font-black tracking-[0.25em] text-amber-100">✦</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-100/50 bg-slate-950/20 text-3xl font-bold text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                {cardName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center text-[9px] font-semibold uppercase tracking-[0.28em] text-amber-100/90">
              {cardName.slice(0, 3)}
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-3 rounded-[14px] border border-amber-200/30 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.16),_rgba(15,23,42,0.82)),linear-gradient(135deg,_rgba(109,40,217,0.7),_rgba(15,23,42,0.9))]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-12 items-center justify-center rounded-xl border border-amber-200/40 bg-gradient-to-br from-amber-200/10 to-violet-400/10 shadow-[inset_0_0_18px_rgba(255,255,255,0.1)]">
                <div className="h-10 w-7 rounded-md border border-amber-100/35 bg-[linear-gradient(135deg,_rgba(251,191,36,0.1),_rgba(167,139,250,0.15))]" />
              </div>
            </div>
            <div className="absolute inset-x-2 bottom-4 text-center text-[8px] font-bold uppercase tracking-[0.35em] text-amber-100/80">
              Tarot
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function TarotClient() {
  const [selectedSpread, setSelectedSpread] = useState<string>("single");
  const [showReading, setShowReading] = useState(false);
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [readingText, setReadingText] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawCards = () => {
    setIsDrawing(true);

    setTimeout(() => {
      const cards: TarotCard[] = [];
      const spread = TAROT_SPREADS.find((item) => item.id === selectedSpread) || TAROT_SPREADS[0];

      for (let i = 0; i < spread.cardCount; i++) {
        cards.push(getRandomCard());
      }

      setDrawnCards(cards);
      setReadingText(buildReading(cards, selectedSpread));
      setShowReading(true);
      setIsDrawing(false);
    }, 900);
  };

  const handleReset = () => {
    setShowReading(false);
    setDrawnCards([]);
    setReadingText("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_35%),linear-gradient(180deg,_#09090f_0%,_#111827_100%)] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-500 to-fuchsia-500 shadow-[0_0_30px_rgba(168,85,247,0.45)]">
            <MessageSquare className="h-9 w-9 text-white" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-amber-300">Tarot Falı</h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-slate-300 md:text-lg">
          Desteni seç, kartları çevir ve fal yorumunu premium bir şekilde oku.
        </p>

        {!showReading && (
          <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-md">
            <h2 className="mb-5 text-2xl font-semibold text-white">Tarot Seçiminizi Yapın</h2>

            <div className="space-y-5 text-left">
              <div className="space-y-3">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-violet-200">Açılım Seçin</p>

                <div className="grid gap-4 md:grid-cols-3">
                  {TAROT_SPREADS.map((spread) => (
                    <label
                      key={spread.id}
                      className={`group cursor-pointer rounded-[24px] border p-4 transition-all ${
                        selectedSpread === spread.id
                          ? "border-violet-400 bg-violet-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                          : "border-white/10 bg-slate-900/30 hover:border-violet-300/40"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-center gap-[-6px] overflow-hidden px-1">
                        {Array.from({ length: spread.cardCount }).map((_, index) => (
                          <div
                            key={`${spread.id}-card-${index}`}
                            className="shrink-0 translate-x-0 scale-[0.7]"
                            style={{ marginLeft: index > 0 ? -8 : 0 }}
                          >
                            {renderTarotCard("Tarot", index, true)}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="spread"
                          value={spread.id}
                          checked={selectedSpread === spread.id}
                          onChange={(e) => setSelectedSpread(e.target.value)}
                          className="mt-1 h-4 w-4 accent-violet-400"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{spread.name}</h3>
                          <p className="mt-1 text-sm text-slate-300">{spread.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDrawCards}
                disabled={isDrawing}
                className="mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-200 to-violet-400 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_10px_25px_rgba(251,191,36,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isDrawing ? (
                  <>
                    <Shuffle className="mr-2 h-5 w-5 animate-spin" />
                    Kartlar çekiliyor...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Kartları Çek
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showReading && (
          <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-violet-200">Premium Okuma</p>
                <h2 className="mt-2 text-2xl font-semibold text-amber-300">Tarot Okumanız</h2>
              </div>
              <button
                onClick={handleReset}
                className="rounded-full border border-violet-400/50 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
              >
                Yeni Okuma
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {drawnCards.map((card, index) => (
                <div
                  key={`${card.name}-${index}`}
                  className="rounded-[24px] border border-amber-200/20 bg-gradient-to-br from-slate-900/95 via-violet-950/60 to-slate-900/90 p-5 text-left shadow-lg shadow-indigo-950/40"
                >
                  <div className="mb-4 flex items-center justify-center">
                    {renderTarotCard(card.name, index, false)}
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-amber-200">{card.name}</h3>
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-slate-400">{card.arcana}</p>
                  <p className="text-sm leading-6 text-slate-200">{card.meaning}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-violet-400/25 bg-gradient-to-r from-violet-500/10 via-slate-900/70 to-indigo-500/10 p-6 text-left">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-200">Fal Yorumu</p>
              <p className="text-base leading-8 text-slate-100">{readingText}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-300">
              <Link href="/" className="inline-flex items-center gap-2 text-amber-300 transition hover:text-amber-200">
                <Star className="h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}