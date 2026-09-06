"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Crown,
  Heart,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
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

type SpreadId = "single" | "three" | "love" | "career" | "money";

type Spread = {
  id: SpreadId;
  label: string;
  short: string;
  description: string;
  cards: number;
  icon: typeof Sparkles;
};

const spreads: Spread[] = [
  {
    id: "single",
    label: "Tek Kart",
    short: "Bugünün mesajı",
    description: "Aklındaki konu için tek ve net bir sembolik mesaj.",
    cards: 1,
    icon: Sparkles,
  },
  {
    id: "three",
    label: "3 Kart",
    short: "Geçmiş • Şimdi • Gelecek",
    description: "Bir konunun akışını üç farklı açıdan gör.",
    cards: 3,
    icon: Wand2,
  },
  {
    id: "love",
    label: "Aşk Açılımı",
    short: "Kalbinin haritası",
    description: "Sen, karşı taraf ve aranızdaki bağın enerjisi.",
    cards: 3,
    icon: Heart,
  },
  {
    id: "career",
    label: "Kariyer",
    short: "Yol • Engel • Fırsat",
    description: "İş, hedef ve ilerleme konusunda sembolik rehberlik.",
    cards: 3,
    icon: BriefcaseBusiness,
  },
  {
    id: "money",
    label: "Para & Kısmet",
    short: "Enerji • Engel • Akış",
    description: "Maddi konularda dikkat edilmesi gereken temaları keşfet.",
    cards: 3,
    icon: CircleDollarSign,
  },
];

function shuffleCards(cards: TarotCard[]) {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function getTarotImage(card: TarotCard) {
  const file = imageByCardId[String(card.id)];

  return file
    ? `/fortune/tarot/${file}.jpg`
    : "/fortune/tarot-spread.jpg";
}

function CardBack() {
  return (
    <img
      src={TAROT_BACK}
      alt="Tarot kartının arka yüzü"
      className="h-full w-full object-cover"
      draggable={false}
    />
  );
}

function CardFront({ card }: { card: TarotCard }) {
  const file = imageByCardId[String(card.id)] ?? "00-fool";
  const number = file.slice(0, 2);
  const summary = card.meaning.split(".")[0].trim();

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#efe8d8] text-[#33291f] shadow-inner"
      draggable={false}
    >
      <div className="absolute inset-[6px] rounded-[14px] border border-[#6d563d]/45" />

      <div className="relative z-10 flex h-full flex-col p-2.5 sm:p-3">
        <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-[.18em] text-[#80684c]">
          <span>#{number}</span>
          <span>BÜYÜK ARKANA</span>
        </div>

        <div className="mx-auto mt-2 h-[53%] w-[78%] overflow-hidden rounded-full border-[3px] border-[#c5a86a]/80 bg-[#d8c8a9] shadow-[0_7px_18px_rgba(60,42,20,.22)]">
          <img
            src={getTarotImage(card)}
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        </div>

        <div className="mt-2 text-center">
          <h3 className="font-serif text-[14px] font-black leading-tight text-[#2d241c] sm:text-[16px]">
            {card.name}
          </h3>

          <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[.12em] text-[#9a7650]">
            {card.keywords.slice(0, 3).join(" • ")}
          </p>
        </div>

        <div className="mt-2 flex min-h-0 flex-1 gap-2 rounded-xl border border-[#8d765a]/20 bg-white/35 p-2">
          <img
            src="/fortune/tarot-spread.jpg"
            alt=""
            className="h-10 w-8 shrink-0 rounded-md object-cover"
            draggable={false}
          />

          <p className="line-clamp-5 text-[8px] font-medium leading-[1.45] text-[#5b4937] sm:text-[9px]">
            {summary}
          </p>
        </div>

        <div className="mt-1.5 text-center text-[6px] font-bold uppercase tracking-[.18em] text-[#9a7650]">
          Fal Köşesi • sembolik yorum
        </div>
      </div>
    </div>
  );
}

function FlipCard({
  card,
  revealed,
  small = false,
}: {
  card: TarotCard;
  revealed: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`${
        small ? "w-[105px] sm:w-[125px]" : "w-[205px] sm:w-[245px]"
      } [perspective:1200px]`}
    >
      <div
        className="relative aspect-[2/3] w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${revealed ? 180 : 0}deg)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-amber-200/50 bg-black shadow-[0_22px_60px_rgba(0,0,0,.55),0_0_30px_rgba(245,158,11,.15)] [backface-visibility:hidden]">
          <CardBack />
        </div>

        <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-amber-200/70 bg-[#efe8d8] shadow-[0_22px_60px_rgba(0,0,0,.55),0_0_30px_rgba(245,158,11,.18)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardFront card={card} />
        </div>
      </div>
    </div>
  );
}

function getPositionLabels(spread: SpreadId) {
  if (spread === "love") {
    return ["Senin enerjin", "Karşı taraf", "Aranızdaki bağ"];
  }

  if (spread === "career") {
    return ["Mevcut yol", "Önündeki engel", "Fırsat / yön"];
  }

  if (spread === "money") {
    return ["Maddi enerji", "Dikkat edilmesi gereken", "Kısmetin akışı"];
  }

  return ["Geçmiş", "Şimdi", "Gelecek"];
}

function getContextText(
  card: TarotCard,
  spread: SpreadId,
  position: number,
) {
  if (spread === "love") {
    return card.love;
  }

  if (spread === "career") {
    return card.career;
  }

  if (spread === "money") {
    return `${card.meaning} Para ve kısmet tarafında özellikle ${card.keywords[0]} teması öne çıkıyor.`;
  }

  if (spread === "three") {
    const labels = getPositionLabels(spread);

    return `${labels[position] || "Bu kart"} konumunda ${card.meaning.toLowerCase()} Bu kartın ${card.keywords.join(", ")} temaları burada özellikle önem kazanıyor.`;
  }

  return card.meaning;
}

export default function TarotClient() {
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("Dostum");
  const [spreadId, setSpreadId] = useState<SpreadId>("three");

  const [deck, setDeck] = useState<TarotCard[]>(() =>
    shuffleCards(tarotCards.slice(0, 22)),
  );

  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [activeCard, setActiveCard] = useState<TarotCard | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [liftedCardId, setLiftedCardId] = useState<string | null>(null);
  const [creditStatus, setCreditStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [creditStatus, setCreditStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [creditStatus, setCreditStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");

  const [creditStatus, setCreditStatus] = useState<
    "idle" | "checking" | "ok" | "error"
  >("idle");

  const spread = useMemo(
    () => spreads.find((item) => item.id === spreadId) ?? spreads[1],
    [spreadId],
  );

  const positions = useMemo(
    () => getPositionLabels(spreadId),
    [spreadId],
  );

  const completed =
    selectedCards.length >= spread.cards &&
    !revealing &&
    creditStatus === "ok";

  useEffect(() => {
    const raw = window.localStorage.getItem("fal-kosesi-profile");

    if (!raw) return;

    try {
      const profile = JSON.parse(raw) as { name?: string };

      if (profile.name?.trim()) {
        setName(profile.name.trim().split(" ")[0]);
      }
    } catch {
      // Keep fallback greeting.
    }
  }, []);

  useEffect(() => {
    if (
      selectedCards.length !== spread.cards ||
      revealing ||
      creditStatus !== "idle"
    ) {
      return;
    }

    setCreditStatus("checking");

    fetch("/api/credits/spend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: `tarot_${spreadId}`,
      }),
    })
      .then(async (response) => {
        setCreditStatus(response.ok ? "ok" : "error");
      })
      .catch(() => {
        setCreditStatus("error");
      });
  }, [
    selectedCards.length,
    spread.cards,
    spreadId,
    revealing,
    creditStatus,
  ]);

  useEffect(() => {
    if (selectedCards.length !== spread.cards || revealing || creditStatus !== "idle") return;
    setCreditStatus("checking");
    fetch("/api/credits/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: `tarot_${spreadId}` }),
    })
      .then(async (response) => {
        setCreditStatus(response.ok ? "ok" : "error");
      })
      .catch(() => setCreditStatus("error"));
  }, [selectedCards.length, spread.cards, spreadId, revealing, creditStatus]);

  useEffect(() => {
    if (selectedCards.length !== spread.cards || revealing || creditStatus !== "idle") return;
    setCreditStatus("checking");
    fetch("/api/credits/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: `tarot_${spreadId}` }),
    })
      .then(async (response) => {
        setCreditStatus(response.ok ? "ok" : "error");
      })
      .catch(() => setCreditStatus("error"));
  }, [selectedCards.length, spread.cards, spreadId, revealing, creditStatus]);

  useEffect(() => {
    if (selectedCards.length !== spread.cards || revealing || creditStatus !== "idle") return;
    setCreditStatus("checking");
    fetch("/api/credits/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: `tarot_${spreadId}` }),
    })
      .then(async (response) => {
        setCreditStatus(response.ok ? "ok" : "error");
      })
      .catch(() => setCreditStatus("error"));
  }, [selectedCards.length, spread.cards, spreadId, revealing, creditStatus]);

  const resetReading = (nextSpread: SpreadId = spreadId) => {
    setSpreadId(nextSpread);
    setSelectedCards([]);
    setActiveCard(null);
    setRevealing(false);
    setRevealed(false);
    setLiftedCardId(null);
    setCreditStatus("idle");
    setDeck(shuffleCards(tarotCards.slice(0, 22)));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const chooseCard = (card: TarotCard) => {
    if (
      revealing ||
      selectedCards.length >= spread.cards ||
      selectedCards.some((item) => item.id === card.id)
    ) {
      return;
    }

    setLiftedCardId(String(card.id));
    setActiveCard(card);
    setRevealed(false);
    setRevealing(true);

    window.setTimeout(() => {
      setSelectedCards((current) => [...current, card]);
      setRevealed(true);

      window.setTimeout(() => {
        setRevealing(false);
        setActiveCard(null);
        setRevealed(false);
        setLiftedCardId(null);
      }, 750);
    }, 650);
  };

  const availableCards = deck.filter(
    (card) =>
      !selectedCards.some((selected) => selected.id === card.id),
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(124,58,237,.24),transparent_32%),radial-gradient(circle_at_80%_25%,rgba(245,158,11,.08),transparent_28%),linear-gradient(180deg,#080817,#05050d)] px-3 pb-10 pt-4 text-white sm:px-5 sm:pt-7">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-slate-300 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana sayfa
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-amber-200">
            <Crown className="h-3 w-3" />
            Premium Tarot
          </div>
        </header>

        {creditStatus === "checking" ? (
          <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-center text-sm text-amber-100">
            Açılımın kredisi kontrol ediliyor…
          </div>
        ) : null}

        {creditStatus === "error" ? (
          <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center text-sm text-rose-100">
            Bu açılım için yeterli kredin yok.{" "}
            <Link href="/kredi" className="font-black underline">
              Kredi Al
            </Link>
          </div>
        ) : null}

        {creditStatus === "checking" ? <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-center text-sm text-amber-100">Açılımın kredisi kontrol ediliyor…</div> : null}
        {creditStatus === "error" ? <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center text-sm text-rose-100">Bu açılım için yeterli kredin yok. <Link href="/kredi" className="font-black underline">Kredi Al</Link></div> : null}

        {creditStatus === "checking" ? <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-center text-sm text-amber-100">Açılımın kredisi kontrol ediliyor…</div> : null}
        {creditStatus === "error" ? <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center text-sm text-rose-100">Bu açılım için yeterli kredin yok. <Link href="/kredi" className="font-black underline">Kredi Al</Link></div> : null}

        {creditStatus === "checking" ? <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-center text-sm text-amber-100">Açılımın kredisi kontrol ediliyor…</div> : null}
        {creditStatus === "error" ? <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center text-sm text-rose-100">Bu açılım için yeterli kredin yok. <Link href="/kredi" className="font-black underline">Kredi Al</Link></div> : null}

        <section className="overflow-hidden rounded-[30px] border border-amber-200/15 bg-[radial-gradient(circle_at_80%_0%,rgba(245,158,11,.16),transparent_35%),rgba(17,12,29,.95)] shadow-2xl">
          <div className="relative h-[190px] sm:h-[270px]">
            <img
              src="/fortune/tarot-spread.jpg"
              alt="Gerçek tarot kartları"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080817] via-[#080817]/50 to-[#080817]/10" />

            <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8">
              <p className="text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">
                22 Büyük Arkana • Kişisel açılım
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold sm:text-5xl">
                Tarot Falı
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm">
                Sorunu belirle, açılımını seç ve kartları kendi sezginle çek.
                Her seçim ayrı bir aşamada açılır; sonrasında kartların
                birlikte anlattığı hikâyeyi oku.
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 p-4 sm:p-6">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[.28em] text-amber-200">
              Önce açılımını seç
            </p>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {spreads.map((item) => {
                const Icon = item.icon;
                const active = item.id === spreadId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => resetReading(item.id)}
                    className={`min-w-[142px] rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-amber-300/60 bg-amber-300/10 shadow-[0_0_25px_rgba(245,158,11,.1)]"
                        : "border-white/10 bg-white/[.025] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-amber-200" : "text-slate-400"
                        }`}
                      />

                      <span className="text-[8px] text-slate-500">
                        {item.cards} kart
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-bold">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-500">
                      {item.short}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-violet-300/10 bg-violet-400/[.045] p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-300/10 p-2">
                  <Wand2 className="h-4 w-4 text-violet-200" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {spread.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {spread.description}
                  </p>
                </div>
              </div>

              <label className="mt-4 block text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">
                Niyetin veya sorun (isteğe bağlı)
              </label>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                placeholder="Örn: Bu ilişkinin geleceğinde beni ne bekliyor?"
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-300/40"
              />
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">
                  Adım{" "}
                  {Math.min(
                    selectedCards.length + 1,
                    spread.cards,
                  )}{" "}
                  / {spread.cards}
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold">
                  {completed
                    ? "Açılımın tamamlandı ✦"
                    : positions[selectedCards.length] || "Kartını seç"}
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[.04] px-2.5 py-1 text-[9px] text-slate-400">
                22 kart • yeni deste
              </span>
            </div>

            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: spread.cards }).map(
                (_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index < selectedCards.length
                        ? "bg-amber-300"
                        : index === selectedCards.length
                          ? "bg-amber-300/35"
                          : "bg-white/10"
                    }`}
                  />
                ),
              )}
            </div>

            <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6">
              <div className="flex w-max items-end gap-3 pt-8">
                {availableCards.map((card, index) => {
                  const lifted =
                    liftedCardId === String(card.id);

                  return (
                    <button
                      key={String(card.id)}
                      type="button"
                      onClick={() => chooseCard(card)}
                      disabled={revealing || completed}
                      aria-label={`${card.name} kartını seç`}
                      className={`group relative w-[105px] shrink-0 overflow-hidden rounded-[17px] border bg-[#0c0916] shadow-[0_14px_30px_rgba(0,0,0,.5)] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60 sm:w-[128px] ${
                        lifted
                          ? "z-20 -translate-y-8 scale-[1.06] border-amber-300 shadow-[0_0_38px_rgba(245,158,11,.4)]"
                          : "border-white/10 hover:-translate-y-1 hover:border-amber-300/60"
                      }`}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <CardBack />

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,.28)_100%)]" />

                        <span className="absolute left-2 top-2 rounded-full border border-amber-100/20 bg-black/45 px-1.5 py-0.5 text-[8px] font-bold text-amber-100 backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="absolute bottom-2 left-2 right-2 text-center text-[8px] font-bold uppercase tracking-[.12em] text-amber-100 opacity-0 transition group-hover:opacity-100">
                          Seç ✦
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-500">
              ← Kaydır • Kartların yüzü kapalı • İçinden gelen karta dokun →
            </p>

            {selectedCards.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200/10 bg-black/15 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">
                    Seçtiklerin
                  </p>

                  <span className="text-[9px] text-amber-200">
                    {selectedCards.length}/{spread.cards}
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  {selectedCards.map((card, index) => (
                    <div key={card.id} className="relative">
                      <div className="w-[64px] overflow-hidden rounded-xl border border-amber-200/25 shadow-lg">
                        <CardFront card={card} />
                      </div>

                      <span className="mt-1 block max-w-[70px] truncate text-center text-[8px] text-slate-400">
                        {positions[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {activeCard && (
          <section className="mt-4 rounded-[28px] border border-amber-200/20 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.15),transparent_38%),rgba(18,13,31,.97)] p-5 text-center shadow-2xl sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">
              {name},{" "}
              {positions[selectedCards.length] || "seçtiğin kart"} açılıyor
            </p>

            <div className="mx-auto mt-4 flex justify-center">
              <FlipCard
                card={activeCard}
                revealed={revealed}
              />
            </div>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-slate-400">
              Kartın arka yüzü dönüyor. Sezgisel seçiminin sembolik mesajı
              birazdan açılacak.
            </p>
          </section>
        )}

        {completed && (
          <section className="mt-4 rounded-[28px] border border-amber-200/20 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.12),transparent_38%),rgba(18,13,31,.97)] p-5 shadow-2xl sm:p-7">
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-[.3em] text-amber-200">
                {name}, açılımın
              </p>

              <h2 className="mt-1 font-serif text-3xl font-bold text-amber-100">
                Kartların sana ne söylüyor?
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-slate-400">
                Kartları tek tek değil, birbirleriyle kurdukları hikâye
                üzerinden değerlendir. Aynı tema tekrar ediyorsa özellikle
                dikkat çekiyor olabilir.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {selectedCards.map((card, index) => (
                <article
                  key={card.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 p-3">
                    <div className="w-[54px] overflow-hidden rounded-lg border border-amber-200/20">
                      <CardFront card={card} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[.18em] text-amber-200">
                        {positions[index]}
                      </p>

                      <h3 className="mt-0.5 font-serif text-xl font-bold">
                        {card.name}
                      </h3>

                      <p className="text-[9px] text-slate-500">
                        {card.keywords.join(" • ")}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm leading-7 text-slate-200">
                      {getContextText(card, spreadId, index)}
                    </p>

                    {question.trim() && (
                      <p className="mt-3 rounded-xl border border-violet-300/10 bg-violet-400/[.05] p-3 text-xs leading-6 text-slate-300">
                        <strong className="text-violet-200">
                          Soruna göre:
                        </strong>{" "}
                        “{question.trim()}” konusunda bu kartın{" "}
                        {card.keywords[0]} teması öne çıkıyor. Bunu kesin bir
                        gelecek vaadi olarak değil, kararlarını düşünürken
                        kullanabileceğin sembolik bir ayna olarak değerlendir.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-rose-300/10 bg-rose-400/[.045] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                  <Heart className="h-4 w-4" />
                  Aşk
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-300">
                  {selectedCards[0]?.love}
                </p>
              </article>

              <article className="rounded-2xl border border-sky-300/10 bg-sky-400/[.045] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-200">
                  <BriefcaseBusiness className="h-4 w-4" />
                  İş & Kariyer
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-300">
                  {selectedCards[1]?.career ||
                    selectedCards[0]?.career}
                </p>
              </article>

              <article className="rounded-2xl border border-amber-300/10 bg-amber-400/[.045] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
                  <CircleDollarSign className="h-4 w-4" />
                  Para & Kısmet
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-300">
                  {selectedCards[selectedCards.length - 1]?.meaning}
                </p>
              </article>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => resetReading()}
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Yeni Açılım
              </button>

              <Link
                href="/fal/premium"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 px-5 py-3 text-sm font-black text-slate-950"
              >
                <Sparkles className="h-4 w-4" />
                Derinlemesine Premium Yorum
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {!completed && !activeCard && (
          <section className="mt-4 rounded-2xl border border-violet-300/10 bg-white/[.025] p-4 text-center text-xs leading-6 text-slate-400">
            <Wand2 className="mx-auto mb-2 h-5 w-5 text-violet-300" />
            Kartları acele etmeden kaydır. İlk dikkatini çeken kartı seç;{" "}
            {spread.cards > 1
              ? `açılım tamamlanana kadar ${spread.cards} kartı sırayla seç.`
              : "tek kartın mesajını aç."}
          </section>
        )}
      </div>
    </main>
  );
}