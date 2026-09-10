"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Crown, Filter, Heart, RotateCcw, Search, Sparkles, Star, Wand2 } from "lucide-react";
import CommentatorPicker from "@/app/fal/components/commentator-picker";
import { DIGITAL_COMMENTATORS, type DigitalCommentator } from "@/lib/fortune/catalog";
import { tarotFullDeck, TAROT_DECK_COUNT, type TarotDeckCard } from "@/lib/tarot/full-deck";

type Commentator = DigitalCommentator & { favorite?: boolean; type?: string };
type SpreadId = "single" | "three" | "love" | "career" | "money";
type Spread = { id: SpreadId; label: string; subtitle: string; description: string; cards: number; credits: number; positions: string[] };
type Drawn = TarotDeckCard & { reversed: boolean };
type Question = { text: string; placeholder: string; multiline?: boolean };

const spreads: Spread[] = [
  { id: "single", label: "Tek Kart", subtitle: "Ana mesaj", description: "Aklındaki konu için tek bir sembolik mesaj.", cards: 1, credits: 5, positions: ["Ana mesaj"] },
  { id: "three", label: "3 Kart", subtitle: "Geçmiş · Şimdi · Yakın gelecek", description: "Sorunun akışını üç ayrı pencereden gör.", cards: 3, credits: 12, positions: ["Geçmiş", "Şimdi", "Yakın gelecek"] },
  { id: "love", label: "Aşk Açılımı", subtitle: "Sen · Karşı taraf · Bağ", description: "İlişkinin enerjisini ve aradaki bağı aç.", cards: 3, credits: 15, positions: ["Sen", "Karşı taraf", "Aranızdaki bağ"] },
  { id: "career", label: "Kariyer", subtitle: "Yol · Engel · Fırsat", description: "İş ve hedeflerin için sembolik yol haritası.", cards: 3, credits: 15, positions: ["Mevcut yol", "Engel", "Fırsat / yön"] },
  { id: "money", label: "Para & Kısmet", subtitle: "Akış · Dikkat · Yön", description: "Maddi alandaki tema ve seçenekleri aç.", cards: 3, credits: 15, positions: ["Maddi akış", "Dikkat", "Kısmetin yönü"] },
];

const filters = [
  ["all", "Tümü"],
  ["major", "Büyük Arkana"],
  ["wands", "Asalar"],
  ["cups", "Kupalar"],
  ["swords", "Kılıçlar"],
  ["pentacles", "Pentakıllar"],
] as const;
type FilterId = typeof filters[number][0];

const questions: Question[] = [
  { text: "Şu sıralar aklını en çok ne meşgul ediyor?", placeholder: "İstersen bana biraz anlat…", multiline: true },
  { text: "Bu konuda içinde en ağır basan duygu ne?", placeholder: "Mesela merak, umut, korku, özlem…", multiline: true },
  { text: "Bu hikâyede şu an en çok neyi bilmeye ihtiyacın var?", placeholder: "İçinden geldiği gibi yaz…", multiline: true },
  { text: "Kartlardan özellikle duymak istediğin bir şey var mı?", placeholder: "Bir soru, bir dilek ya da sadece bir cümle…", multiline: true },
];

function shuffle<T>(arr: T[]) {
  const x = [...arr];
  for (let i = x.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function tap() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(20);
}

function suitCode(filter: FilterId) {
  return filter === "wands" ? "wa" : filter === "cups" ? "cu" : filter === "swords" ? "sw" : filter === "pentacles" ? "pe" : "";
}

function Avatar({ c, large = false }: { c: Commentator | null; large?: boolean }) {
  return c ? (
    <div className={`${large ? "h-24 w-24" : "h-14 w-14"} overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#17111e] shadow-xl`}>
      <img src={c.avatarUrl || `/api/fal/avatar?id=${c.id}`} alt={`${c.name} sanal karakter`} className="h-full w-full object-cover" />
    </div>
  ) : (
    <div className={`${large ? "h-24 w-24" : "h-14 w-14"} grid place-items-center rounded-[24px] bg-violet-400/10`}>
      <Sparkles className="h-6 w-6 text-violet-200" />
    </div>
  );
}

function Card({ card, back = false, small = false }: { card?: TarotDeckCard; back?: boolean; small?: boolean }) {
  return (
    <div className={`${small ? "h-20 w-14" : "aspect-[2/3] w-full"} overflow-hidden rounded-xl border border-amber-200/15 bg-black shadow-lg`}>
      {back ? <img src="/fortune/tarot-back.svg" alt="Tarot kartı" className="h-full w-full object-cover" /> : card ? <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" loading="lazy" /> : null}
    </div>
  );
}

export default function TarotRoomClient() {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [commentator, setCommentator] = useState<Commentator | null>(null);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [spreadId, setSpreadId] = useState<SpreadId>("three");
  const [deck, setDeck] = useState(() => shuffle(tarotFullDeck));
  const [selected, setSelected] = useState<Drawn[]>([]);
  const [revealing, setRevealing] = useState<Drawn | null>(null);
  const [reveal, setReveal] = useState(false);
  const [reversed, setReversed] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [purchased, setPurchased] = useState(false);
  const [readingId, setReadingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const spread = useMemo(() => spreads.find((x) => x.id === spreadId) || spreads[1], [spreadId]);
  const tarotCommentators = useMemo(() => DIGITAL_COMMENTATORS.filter((x) => x.specialties.includes("tarot")), []);
  const price = Math.max(commentator?.priceCredits ?? tarotCommentators[0]?.priceCredits ?? spread.credits, spread.credits);
  const visible = useMemo(() => deck.filter((c) => {
    const q = search.trim().toLocaleLowerCase("tr-TR");
    const tab = filter === "all" || (filter === "major" ? c.arcana === "major" : c.code.startsWith(suitCode(filter)));
    return tab && (!q || c.name.toLocaleLowerCase("tr-TR").includes(q) || c.keywords.some((k) => k.toLocaleLowerCase("tr-TR").includes(q)));
  }), [deck, filter, search]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("commentator");
    if (id) {
      const x = DIGITAL_COMMENTATORS.find((c) => c.id === id && c.specialties.includes("tarot"));
      if (x) setCommentator(x);
    }
  }, []);

  const setAnswer = (value: string) => setAnswers((a) => a.map((x, n) => n === questionIndex ? value : x));

  const back = () => {
    setError("");
    if (stage === 1 && questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      return;
    }
    setStage((s) => Math.max(0, s - 1) as 0 | 1 | 2 | 3);
  };

  const chooseCharacter = () => {
    setError("");
    if (!commentator) return setError("Önce sana yorum yapacak sanal tarot karakterini seç.");
    setQuestionIndex(0);
    setStage(1);
  };

  const nextQuestion = () => {
    setError("");
    if (questionIndex < questions.length - 1) setQuestionIndex((i) => i + 1);
    else setStage(2);
  };

  const purchase = async () => {
    if (!commentator) return;
    setBusy(true);
    setError("");
    try {
      const personalQuestion = answers[3].trim() || answers.find((answer) => answer.trim())?.trim() || "";
      const r = await fetch("/api/fal/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "tarot", commentatorId: commentator.id, spreadId, question: personalQuestion }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Tarot açılımı başlatılamadı.");
      setReadingId(String(d.readingId));
      setPurchased(true);
      setStage(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tarot açılımı başlatılamadı.");
    } finally {
      setBusy(false);
    }
  };

  const pick = (card: TarotDeckCard) => {
    if (!purchased || busy || revealing || selected.length >= spread.cards || selected.some((x) => x.id === card.id)) return;
    tap();
    const d: Drawn = { ...card, reversed: reversed && Math.random() < 0.22 };
    setRevealing(d);
    setReveal(false);
    setTimeout(() => setReveal(true), 420);
    setTimeout(() => {
      setSelected((a) => [...a, d]);
      setRevealing(null);
      setReveal(false);
    }, 950);
  };

  const finish = async () => {
    if (!readingId || selected.length !== spread.cards || !commentator) return;
    setBusy(true);
    setError("");
    try {
      const cards = selected.map((c, i) => `${i + 1}. ${spread.positions[i]} — ${c.name} — ${c.reversed ? "TERS" : "DÜZ"} — ${c.suit} — ${c.reversed ? c.reversedMeaning : c.meaning}`).join("\n");
      const profile = (() => {
        try { return JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}"); } catch { return {}; }
      })();
      const personalQuestion = answers[3].trim() || answers.find((answer) => answer.trim())?.trim() || "";
      const r = await fetch("/api/fal/tarot/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, commentatorId: commentator.id, spreadId, spreadLabel: spread.label, question: personalQuestion, answers, cards, profile }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Tarot yorumu hazırlanamadı.");
      setResult(d);
      sessionStorage.setItem("falResult", JSON.stringify(d));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tarot yorumu hazırlanamadı.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDeck(shuffle(tarotFullDeck));
    setSelected([]);
    setResult(null);
    setReadingId("");
    setPurchased(false);
    setStage(0);
    setQuestionIndex(0);
    setAnswers(["", "", "", ""]);
    setCommentator(null);
    setError("");
  };

  if (result) {
    const sections = Array.isArray(result.sections) ? result.sections.filter((x): x is { title?: string; body?: string } => Boolean(x && typeof x === "object")) : [];
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,58,237,.28),transparent_35%),#060611] px-3 py-7 text-white">
        <div className="mx-auto max-w-4xl">
          <section className="overflow-hidden rounded-[32px] border border-amber-200/15 bg-[#100c1b] shadow-2xl">
            <div className="border-b border-white/5 px-6 py-9 text-center">
              <div className="flex justify-center"><Avatar c={commentator} large /></div>
              <p className="mt-4 text-[9px] font-black uppercase tracking-[.3em] text-amber-200">{commentator?.name} anlatıyor · {spread.label}</p>
              <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Sana baktığımda…</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">Bu yorum, seçtiğin karakterin diliyle; sohbetindeki cevaplar, seçtiğin kartlar ve açılımın birlikte okunarak hazırlandı.</p>
            </div>
            <div className="p-5 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {selected.map((c, i) => <article key={c.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-3"><Card card={c} /><p className="mt-3 text-[8px] font-black uppercase tracking-[.2em] text-amber-200">{spread.positions[i]} · {c.reversed ? "Ters" : "Düz"}</p><h3 className="mt-1 font-serif text-lg font-bold">{c.name}</h3></article>)}
              </div>
              {typeof result.summary === "string" && <div className="relative mt-6 rounded-[26px] border border-amber-200/15 bg-gradient-to-br from-amber-300/[.07] to-violet-400/[.05] p-5 sm:p-7"><div className="absolute -top-3 left-5 rounded-full border border-amber-200/20 bg-[#100c1b] px-3 py-1 text-[8px] font-black uppercase tracking-[.25em] text-amber-200">{commentator?.name}</div><p className="pt-2 font-serif text-xl leading-8 text-white sm:text-2xl">“{result.summary}”</p></div>}
              {sections.length > 0 && <div className="mt-5 space-y-3">{sections.map((section, i) => <article key={`${section.title ?? "bölüm"}-${i}`} className="rounded-2xl border border-white/8 bg-white/[.02] p-5"><p className="text-[9px] font-black uppercase tracking-[.22em] text-violet-200">{section.title || `Sözlerim · ${i + 1}`}</p><p className="mt-2 text-sm leading-7 text-slate-200">{section.body || ""}</p></article>)}</div>}
              {typeof result.followUpQuestion === "string" && <div className="mt-4 rounded-2xl border border-amber-300/10 bg-amber-300/[.035] p-4 text-xs leading-6 text-amber-100">✨ {result.followUpQuestion}</div>}
              <div className="mt-6 grid gap-2 sm:grid-cols-2"><Link href="/fal/sonuc" className="flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3.5 text-sm font-black text-slate-950">Detaylı sonucu gör <ChevronRight className="h-4 w-4" /></Link><button type="button" onClick={reset} className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3.5 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Yeni açılım</button></div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (stage < 3) {
    const currentQuestion = questions[questionIndex];
    const currentAnswer = answers[questionIndex];
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,63,94,.18),transparent_30%),linear-gradient(180deg,#080817,#05050d)] px-3 pb-12 pt-4 text-white sm:px-5 sm:pt-7">
        <div className="mx-auto max-w-3xl">
          <header className="mb-5 flex items-center justify-between"><button type="button" onClick={stage === 0 ? () => { location.href = "/"; } : back} className="flex items-center gap-1 text-xs text-slate-300"><ArrowLeft className="h-4 w-4" />{stage === 0 ? "Ana sayfa" : "Geri"}</button><span className="rounded-full border border-amber-200/15 bg-amber-200/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[.2em] text-amber-200">78 Kart · Tarot</span></header>
          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0b18] shadow-2xl">
            {stage === 0 && <div className="border-b border-white/5 px-5 pb-7 pt-8 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] border border-amber-200/20 bg-violet-400/10"><Crown className="h-9 w-9 text-amber-200" /></div><p className="mt-5 text-[9px] font-black uppercase tracking-[.3em] text-amber-200">Önce karakterini seç</p><h1 className="mt-1 font-serif text-3xl font-black sm:text-4xl">Tarot Falı</h1><p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-slate-400">Önce seni dinleyecek karakteri seç. Sonra karakterin seninle sohbet ederek birkaç şey soracak; cevaplamak tamamen sana kalmış.</p></div>}

            {stage === 1 && <div className="border-b border-white/5 px-5 pb-6 pt-7 sm:px-8"><div className="flex items-start gap-3 sm:gap-4"><Avatar c={commentator} large /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-serif text-xl font-bold">{commentator?.name}</p><span className="rounded-full bg-violet-400/10 px-2 py-1 text-[7px] font-black uppercase tracking-wider text-violet-200">Sanal AI karakter</span></div><p className="mt-0.5 text-[10px] text-violet-200">{commentator?.title}</p><div className="mt-3 rounded-[24px] rounded-tl-md border border-rose-300/15 bg-rose-300/[.045] px-4 py-4 shadow-lg"><p className="text-[8px] font-black uppercase tracking-[.24em] text-rose-200">{commentator?.name} soruyor</p><p className="mt-2 font-serif text-xl font-bold leading-8 text-white sm:text-2xl">{currentQuestion.text}</p></div></div></div><div className="mt-5 flex items-center justify-center gap-1.5">{questions.map((_, i) => <span key={i} className={`h-1.5 w-12 rounded-full transition ${i <= questionIndex ? "bg-amber-300" : "bg-white/10"}`} />)}</div><p className="mt-2 text-center text-[9px] text-slate-600">{questionIndex + 1} / {questions.length} · İstersen bu soruyu boş bırakabilirsin.</p></div>}

            <div className="p-5 sm:p-8">
              {stage === 0 && <div className="space-y-4"><CommentatorPicker kind="tarot" selectedId={commentator?.id ?? null} onSelect={setCommentator} />{error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}<button type="button" onClick={chooseCharacter} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black">{commentator ? `${commentator.name} ile konuşmaya başla` : "Tarot karakterini seç"}<ChevronRight className="h-4 w-4" /></button></div>}

              {stage === 1 && <div className="space-y-4">{currentQuestion.multiline ? <textarea autoFocus value={currentAnswer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder={currentQuestion.placeholder} className="w-full resize-none rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 text-sm leading-6 outline-none transition focus:border-rose-400/50 focus:bg-black/35" /> : <input autoFocus value={currentAnswer} onChange={(e) => setAnswer(e.target.value)} placeholder={currentQuestion.placeholder} className="w-full rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 text-sm outline-none transition focus:border-rose-400/50 focus:bg-black/35" />}<div className="grid gap-2 sm:grid-cols-[1fr_auto]"><button type="button" onClick={nextQuestion} className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-5 py-3.5 text-sm font-black">{questionIndex === questions.length - 1 ? "Tamam, kartlara geçelim" : "Devam et"}<ArrowRight className="h-4 w-4" /></button><button type="button" onClick={() => { setAnswer(""); nextQuestion(); }} className="rounded-full border border-white/10 px-5 py-3.5 text-xs font-bold text-slate-400 hover:text-white">Atla</button></div><p className="text-center text-[9px] leading-5 text-slate-600">Cevap vermek istemediğin soruyu atlayabilirsin. Boş cevaplar yorumdan çıkarılır.</p>{error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}</div>}

              {stage === 2 && <div className="space-y-4"><div className="flex items-center gap-3 rounded-2xl border border-amber-300/10 bg-amber-300/[.035] p-4"><Avatar c={commentator} /><div><p className="font-serif text-xl font-bold">{commentator?.name} için açılımını seç</p><p className="text-xs text-slate-500">Sohbet bitti. Şimdi tek ödeme ile kartlarını açıyoruz.</p></div></div><div className="grid gap-2">{spreads.map((s) => <button key={s.id} type="button" onClick={() => setSpreadId(s.id)} className={`rounded-2xl border p-4 text-left ${spreadId === s.id ? "border-amber-300/50 bg-amber-300/[.07]" : "border-white/10 bg-white/[.025]"}`}><div className="flex justify-between gap-3"><div><p className="text-sm font-black">{s.label}</p><p className="mt-1 text-[10px] text-slate-500">{s.subtitle}</p></div><span className="text-[10px] font-bold text-amber-200">{Math.max(price, s.credits)} kredi</span></div><p className="mt-2 text-xs leading-5 text-slate-400">{s.description}</p></button>)}</div>{error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}<button type="button" disabled={busy} onClick={purchase} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 px-6 py-4 text-sm font-black text-slate-950 disabled:opacity-50">{busy ? "Başlatılıyor…" : `${commentator?.name} ile açılımı başlat · ${price} kredi`}<Sparkles className="h-4 w-4" /></button></div>}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(124,58,237,.27),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(245,158,11,.08),transparent_24%),linear-gradient(180deg,#070714,#04040b)] px-2 pb-12 pt-3 text-white sm:px-4 sm:pt-5">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Link href="/" className="rounded-full border border-white/10 bg-white/[.03] p-2"><ArrowLeft className="h-4 w-4" /></Link><div><p className="text-[9px] font-black uppercase tracking-[.28em] text-amber-200">{commentator?.name} · Tarot Odası</p><h1 className="font-serif text-xl font-black sm:text-2xl">Kartlarını çek ✦</h1></div></div><span className="rounded-full border border-amber-200/10 bg-amber-200/5 px-3 py-1.5 text-[9px] font-bold text-amber-100">{selected.length}/{spread.cards} · 78 kart</span></header>
        <section className="rounded-[30px] border border-amber-200/10 bg-[#0f0a1b]/95 shadow-2xl"><div className="border-b border-white/5 px-4 py-4 sm:px-6"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.25em] text-amber-200">{spread.label} · {spread.subtitle}</p><p className="mt-1 text-xs text-slate-500">{answers.filter(Boolean).length ? "Karakterin seni dinledi; şimdi kartlar konuşuyor." : "Sorularını atladın; şimdi kartlar konuşuyor."}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setReversed((v) => !v)} className={`rounded-full border px-3 py-1.5 text-[9px] font-black ${reversed ? "border-violet-300/30 bg-violet-300/10 text-violet-100" : "border-white/10 text-slate-500"}`}>↕ Ters kartlar {reversed ? "Açık" : "Kapalı"}</button><button type="button" onClick={reset} className="rounded-full border border-white/10 p-2 text-slate-400"><RotateCcw className="h-4 w-4" /></button></div></div></div>
          <div className="p-4 sm:p-6"><div className="mb-5 grid gap-2 sm:grid-cols-3">{Array.from({ length: spread.cards }).map((_, i) => <div key={i} className={`rounded-2xl border px-3 py-3 text-center ${selected[i] ? "border-amber-300/30 bg-amber-300/[.05]" : "border-white/5 bg-white/[.02]"}`}><p className="text-[8px] font-black uppercase tracking-[.2em] text-slate-500">{i + 1}. {spread.positions[i]}</p><p className="mt-1 text-[10px] font-bold">{selected[i]?.name || "Kartını seç"}</p></div>)}</div>
            {revealing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-5 backdrop-blur-sm"><div className="w-[240px] [perspective:1200px]"><div className="relative aspect-[2/3] w-full transition-transform duration-500 [transform-style:preserve-3d]" style={{ transform: `rotateY(${reveal ? 180 : 0}deg)` }}><div className="absolute inset-0 [backface-visibility:hidden]"><Card back /></div><div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"><Card card={revealing} /></div></div><p className="mt-5 text-center text-xs text-slate-300">{reveal ? `${revealing.name} · ${revealing.reversed ? "Ters" : "Düz"}` : "Kart dönüyor…"}</p></div></div>}
            <div className="rounded-[26px] border border-violet-300/10 bg-[radial-gradient(circle_at_50%_25%,rgba(124,58,237,.15),transparent_60%),rgba(8,6,16,.85)] p-3 sm:p-6"><div className="flex min-h-[240px] items-end justify-center overflow-hidden py-5 sm:min-h-[300px]">{visible.slice(0, 28).map((c, i) => { const angle = (i - 13) * 2.5; const chosen = selected.some((x) => x.id === c.id); return <button type="button" key={c.id} disabled={chosen || selected.length >= spread.cards || busy} onClick={() => pick(c)} className={`group relative -ml-1 w-[55px] shrink-0 overflow-hidden rounded-[10px] border shadow-[0_14px_30px_rgba(0,0,0,.5)] transition-all duration-300 first:ml-0 sm:w-[74px] ${chosen ? "opacity-20" : "border-white/10 hover:-translate-y-5 hover:border-amber-300/50"}`} style={{ transform: `rotate(${angle}deg) translateY(${Math.abs(angle) * .22}px)`, transformOrigin: "50% 100%" }}><div className="aspect-[2/3]"><Card back /></div><span className="absolute bottom-1 left-0 right-0 text-center text-[6px] font-black uppercase text-amber-100 opacity-0 group-hover:opacity-100">Seç ✦</span></button>; })}</div><p className="text-center text-[10px] text-slate-500">İlk dikkatini çeken karta dokun · 78 kartlık deste</p></div>
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-600" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kart ara…" className="w-40 rounded-full border border-white/10 bg-white/[.03] py-2 pl-8 pr-3 text-[10px] outline-none" /></div>{filters.map(([id, label]) => <button type="button" key={id} onClick={() => setFilter(id)} className={`rounded-full border px-3 py-2 text-[9px] font-bold ${filter === id ? "border-violet-300/30 bg-violet-300/10 text-violet-100" : "border-white/5 text-slate-500"}`}>{label}</button>)}</div><div className="text-[9px] text-slate-500"><Filter className="mr-1 inline h-3 w-3" />{visible.length} kart</div></div>
            {selected.length > 0 && <div className="mt-4 rounded-2xl border border-amber-200/10 bg-amber-300/[.025] p-3"><div className="mb-3 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-200">Çektiğin kartlar</p><span className="text-[9px] text-slate-500">{selected.length}/{spread.cards}</span></div><div className="grid gap-2 sm:grid-cols-3">{selected.map((c, i) => <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[.02] p-2"><Card card={c} small /><div className="min-w-0"><p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-200">{spread.positions[i]} · {c.reversed ? "Ters" : "Düz"}</p><p className="mt-1 truncate font-serif text-sm font-bold">{c.name}</p><p className="mt-1 text-[8px] text-slate-500">{c.keywords.slice(0, 2).join(" · ")}</p></div><Check className="ml-auto h-4 w-4 text-emerald-300" /></div>)}</div></div>}
            {selected.length === spread.cards && <div className="mt-5 rounded-[24px] border border-amber-200/15 bg-gradient-to-r from-amber-300/[.07] to-violet-400/[.06] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.25em] text-amber-200">Destenin mesajı hazır</p><h2 className="mt-1 font-serif text-2xl font-black">{commentator?.name} şimdi anlatacak.</h2><p className="mt-1 text-xs text-slate-500">Kart + pozisyon + sohbet cevapları + düz/ters yön birlikte yorumlanacak.</p></div><button type="button" disabled={busy} onClick={finish} className="flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-black text-slate-950 disabled:opacity-50">{busy ? "Yorum hazırlanıyor…" : "Falımı anlat"}<Sparkles className="h-4 w-4" /></button></div></div>}
            {error && <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}
          </div>
        </section>
        <section className="mt-4 grid gap-3 sm:grid-cols-3"><article className="rounded-2xl border border-white/5 bg-white/[.025] p-4"><Star className="h-4 w-4 text-amber-200" /><p className="mt-2 text-xs font-bold">{TAROT_DECK_COUNT} kartlık tam deste</p><p className="mt-1 text-[10px] text-slate-500">22 Büyük + 56 Küçük Arkana.</p></article><article className="rounded-2xl border border-white/5 bg-white/[.025] p-4"><Wand2 className="h-4 w-4 text-violet-200" /><p className="mt-2 text-xs font-bold">Düz / ters + kombinasyon</p><p className="mt-1 text-[10px] text-slate-500">Kartların konumu ve birlikte oluşturduğu hikâye merkezdedir.</p></article><article className="rounded-2xl border border-white/5 bg-white/[.025] p-4"><Heart className="h-4 w-4 text-rose-200" /><p className="mt-2 text-xs font-bold">Karakterin sesi</p><p className="mt-1 text-[10px] text-slate-500">Seçtiğin sanal karakter, sohbetini ve kartlarını kendi anlatım tonuyla birleştirir.</p></article></section>
      </div>
    </main>
  );
}
