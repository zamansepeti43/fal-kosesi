"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Crown, Heart, BriefcaseBusiness, Sparkles, Wand2 } from "lucide-react";
import { TarotCard } from "@/types/tarot";
import { tarotCards } from "@/lib/tarot/cards";

const imageByCardId: Record<string, string> = {
  "the-fool": "00-fool",
  "the-magician": "01-magician",
  "the-high-priestess": "02-high-priestess",
  "the-empress": "03-empress",
  "the-emperor": "04-emperor",
  "the-hierophant": "05-hierophant",
  "the-lovers": "06-lovers",
  "the-chariot": "07-chariot",
  strength: "08-strength",
  "the-hermit": "09-hermit",
  "wheel-of-fortune": "10-wheel-of-fortune",
  justice: "11-justice",
  "the-hanged-man": "12-hanged-man",
  death: "13-death",
  temperance: "14-temperance",
  "the-devil": "15-devil",
  "the-tower": "16-tower",
  "the-star": "17-star",
  "the-moon": "18-moon",
  "the-sun": "19-sun",
  judgement: "20-judgement",
  "the-world": "21-world",
};

const TAROT_BACK = "/fortune/tarot-back.svg";

function shuffleCards(cards: TarotCard[]) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTarotImage(card: TarotCard) {
  const file = imageByCardId[card.id];
  return file ? `/fortune/tarot/${file}.jpg` : "/fortune/tarot-spread.jpg";
}

function CardBack({ className = "" }: { className?: string }) {
  return (
    <img
      src={TAROT_BACK}
      alt="Tarot kartının arka yüzü"
      className={`h-full w-full object-cover ${className}`}
      draggable={false}
    />
  );
}

function CardFront({ card, className = "" }: { card: TarotCard; className?: string }) {
  return (
    <img
      src={getTarotImage(card)}
      alt={`${card.name} tarot kartı`}
      className={`h-full w-full object-cover ${className}`}
      draggable={false}
    />
  );
}

function RevealCard({ card, revealed }: { card: TarotCard; revealed: boolean }) {
  return (
    <div className="mx-auto mt-5 w-[210px] [perspective:1200px] sm:w-[250px]">
      <div
        className="relative aspect-[2/3] w-full rounded-[20px] transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${revealed ? 180 : 0}deg)` }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[20px] border-2 border-amber-200/60 bg-black shadow-[0_25px_70px_rgba(0,0,0,.6),0_0_35px_rgba(245,158,11,.16)] [backface-visibility:hidden]">
          <CardBack />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-[20px] border-2 border-amber-200/60 bg-black shadow-[0_25px_70px_rgba(0,0,0,.6),0_0_35px_rgba(245,158,11,.16)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardFront card={card} />
        </div>
      </div>
    </div>
  );
}

export default function TarotClient() {
  const [question, setQuestion] = useState("");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [revealCard, setRevealCard] = useState<TarotCard | null>(null);
  const [name, setName] = useState("Dostum");
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [liftedCardId, setLiftedCardId] = useState<string | null>(null);
  const [deck, setDeck] = useState<TarotCard[]>(() => shuffleCards(tarotCards.slice(0, 22)));

  useEffect(() => {
    const raw = window.localStorage.getItem("fal-kosesi-profile");
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { name?: string };
      if (profile.name?.trim()) setName(profile.name.trim().split(" ")[0]);
    } catch {
      // Keep fallback greeting.
    }
  }, []);

  const chooseCard = (card: TarotCard) => {
    if (revealing) return;

    setLiftedCardId(card.id);
    setSelectedCard(null);
    setRevealCard(card);
    setRevealed(false);
    setRevealing(true);

    window.setTimeout(() => {
      setSelectedCard(card);
      setRevealed(true);
      setRevealing(false);
    }, 700);
  };

  const chooseAnotherCard = () => {
    if (revealing) return;
    setSelectedCard(null);
    setRevealCard(null);
    setRevealed(false);
    setLiftedCardId(null);
    // Every new reading gets a fresh order so the card positions are never predictable.
    setDeck(shuffleCards(tarotCards.slice(0, 22)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(124,58,237,.24),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-3 pb-8 pt-4 text-white sm:px-5 sm:pt-7">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-xs text-slate-300 sm:text-sm">← Ana sayfa</Link>
          <div className="flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-amber-200">
            <Crown className="h-3 w-3" /> Premium Tarot
          </div>
        </header>

        <section className="overflow-hidden rounded-[28px] border border-amber-200/15 bg-[radial-gradient(circle_at_80%_0%,rgba(245,158,11,.15),transparent_35%),rgba(17,12,29,.94)] shadow-2xl">
          <div className="relative h-[175px] sm:h-[250px]">
            <img src="/fortune/tarot-spread.jpg" alt="Gerçek tarot kartları" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080817] via-[#080817]/45 to-[#080817]/10" />
            <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8">
              <p className="text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">22 Büyük Arkana • Gerçek Kartlar</p>
              <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Tarot Falı</h1>
              <p className="mt-1 max-w-2xl text-xs text-slate-300 sm:text-sm">Kartları yatay kaydır. İçinden gelen karta dokun. Seçtiğin kart yukarı kalksın, ardından kartın arka yüzü dönerek sana özel mesajını açsın.</p>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <label className="mb-2 block text-sm font-semibold">Niyetin veya sorun</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Örn: Aşk hayatımda önümde nasıl bir dönem var?"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-300/45"
            />

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">Kartını seç</p>
                <h2 className="mt-1 font-serif text-xl font-bold">İçinden gelen karta dokun ✦</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[.04] px-2.5 py-1 text-[9px] text-slate-400">22 kart • karıştırıldı</span>
            </div>

            <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/15 sm:-mx-6 sm:px-6">
              <div className="flex w-max items-end gap-3 pt-7">
                {deck.map((card, index) => {
                  const lifted = liftedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => chooseCard(card)}
                      aria-label={`${card.name} kartını seç`}
                      disabled={revealing}
                      className={`group relative w-[104px] shrink-0 overflow-hidden rounded-[16px] border bg-[#0c0916] text-left shadow-[0_12px_28px_rgba(0,0,0,.45)] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60 sm:w-[126px] ${lifted ? "z-20 -translate-y-7 scale-[1.045] border-amber-300 shadow-[0_0_34px_rgba(245,158,11,.38)]" : "border-white/10 hover:-translate-y-1 hover:border-amber-300/70"}`}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <CardBack />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.22)_100%)]" />
                        <div className="absolute left-2 top-2 rounded-full border border-amber-100/20 bg-black/45 px-1.5 py-0.5 text-[8px] font-bold text-amber-100 backdrop-blur">{String(index + 1).padStart(2, "0")}</div>
                        <div className="absolute bottom-2 left-2 right-2 text-center font-serif text-[9px] font-bold tracking-wide text-amber-50/90 opacity-0 transition-opacity group-hover:opacity-100">Kartını seç ✦</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-500">← Kaydır • Tüm kartlar aynı arka yüzle kapalı • Bir karta dokun →</p>
          </div>
        </section>

        {(revealing || selectedCard) && revealCard && (
          <section className="mt-4 rounded-[28px] border border-amber-200/20 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.14),transparent_38%),rgba(18,13,31,.95)] p-5 shadow-2xl sm:p-7">
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">{revealing ? "Seçtiğin kart açılıyor…" : `${name}, seçtiğin kart`}</p>
              <RevealCard card={revealCard} revealed={revealed} />

              {revealing ? (
                <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-slate-400">Kartın arka yüzü dönüyor. İçinden gelen seçimin mesajı birazdan açılacak.</p>
              ) : selectedCard ? (
                <div className="mx-auto mt-4 max-w-2xl">
                  <h2 className="font-serif text-3xl font-bold text-amber-100">{selectedCard.name}</h2>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[.22em] text-slate-500">{selectedCard.keywords.join(" • ")}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">{selectedCard.meaning}</p>
                  {question.trim() && <p className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-400/[.06] p-4 text-left text-sm leading-6 text-slate-300"><span className="font-semibold text-violet-200">Senin sorununa göre:</span> {name}, “{question.trim()}” sorunda bu kartın ana mesajı; aceleyle kesin bir sonuç aramak yerine kartın gösterdiği {selectedCard.keywords[0]} temasını kendi hayatındaki olaylarla karşılaştırman. Kartın sembolizmini bir kararın yerine değil, kararını düşünmek için bir ayna olarak kullan.</p>}
                </div>
              ) : null}
            </div>

            {selectedCard && !revealing && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-rose-300/10 bg-rose-400/[.05] p-4"><div className="flex items-center gap-2 text-sm font-bold text-rose-200"><Heart className="h-4 w-4"/> Aşk</div><p className="mt-2 text-xs leading-6 text-slate-300">{selectedCard.love}</p></article>
                <article className="rounded-2xl border border-sky-300/10 bg-sky-400/[.05] p-4"><div className="flex items-center gap-2 text-sm font-bold text-sky-200"><BriefcaseBusiness className="h-4 w-4"/> İş & Kariyer</div><p className="mt-2 text-xs leading-6 text-slate-300">{selectedCard.career}</p></article>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={chooseAnotherCard} className="flex-1 rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-semibold">Başka Kart Seç</button>
              <Link href="/fal/premium" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 px-5 py-3 text-sm font-black text-slate-950"><Sparkles className="h-4 w-4"/> Premium Yorumu Gör</Link>
            </div>
          </section>
        )}

        {!selectedCard && !revealing && (
          <section className="mt-4 rounded-2xl border border-violet-300/10 bg-white/[.025] p-4 text-center text-xs leading-6 text-slate-400">
            <Wand2 className="mx-auto mb-2 h-5 w-5 text-violet-300" />
            Acele etme. Kartların sadece arka yüzünü gör. 22 kartı kaydır, sana en çok “göz kırpan” karta dokun; seçtiğin kart yukarı kalkacak ve sonrasında ön yüzü açılacak.
          </section>
        )}

        <div className="mt-5 flex justify-center"><Link href="/" className="flex items-center gap-1 text-xs text-slate-400">Ana sayfaya dön <ChevronRight className="h-3.5 w-3.5" /></Link></div>
      </div>
    </main>
  );
}
