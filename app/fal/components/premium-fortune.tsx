"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, BriefcaseBusiness, ChevronRight, Heart, Moon, Sparkles, WalletCards, Wand2 } from "lucide-react";
import type { FalKind, ReadingResult } from "@/lib/ai/provider";
import type { DigitalCommentator } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";
import CommentatorPicker from "./commentator-picker";

type Props = { kind: FalKind; title: string; eyebrow: string; description: string; placeholder: string; accent?: "rose" | "emerald" | "violet" | "amber" | "blue" };
const accents = { rose: "from-rose-500 to-fuchsia-500", emerald: "from-emerald-500 to-lime-400", violet: "from-violet-500 to-fuchsia-500", amber: "from-amber-400 to-orange-400", blue: "from-sky-500 to-indigo-500" };
const fields = [["love", "Aşk", Heart], ["career", "İş & Kariyer", BriefcaseBusiness], ["money", "Para & Kısmet", WalletCards], ["future", "Yakın Gelecek", Moon]] as const;
const focusByKind: Partial<Record<FalKind, string>> = { love: "aşk", money: "para", career: "kariyer", future: "gelecek", daily: "günlük", dream: "rüya", astrology: "astroloji", numerology: "numeroloji", general: "genel" };
const questionSets: Partial<Record<FalKind, [string, string]>> = {
  love: ["Şu an aşk hayatındaki durumu kısaca anlatır mısın?", "Aşk konusunda özellikle hangi sorunun cevabını istiyorsun?"],
  money: ["Para ve kısmet tarafında şu an en önemli durum ne?", "Maddi konuda özellikle neyi öğrenmek istiyorsun?"],
  career: ["İş veya kariyerinde şu an hangi noktadasın?", "Kariyer konusunda özellikle hangi cevabı arıyorsun?"],
  future: ["Hayatında şu an değişmesini veya netleşmesini beklediğin şey ne?", "Yakın gelecek için özellikle neyi merak ediyorsun?"],
  daily: ["Bugün seni en çok meşgul eden konu ne?", "Bugün için özellikle hangi konuda mesaj istiyorsun?"],
  dream: ["Rüyanda ne gördün ve en güçlü duygu neydi?", "Bu rüyanın özellikle hangi yönünü anlamak istiyorsun?"],
  astrology: ["Doğum tarihin, doğum yerin ve biliyorsan doğum saatin nedir?", "Haritanda özellikle hangi konuyu merak ediyorsun?"],
  numerology: ["Doğum tarihin ve kullanmak istediğin isim nedir?", "Sayılarının özellikle hangi konuda yol göstermesini istiyorsun?"],
  general: ["Şu an hayatında hangi konu öne çıkıyor?", "Falcıya soracağın asıl soru nedir?"]
};
const NON_TAROT_AVATAR_SPRITE = "/fortune/avatars/non-tarot-characters.svg?v=1";

function spriteStyle(slot: number): CSSProperties {
  return { backgroundImage: `url(${NON_TAROT_AVATAR_SPRITE})`, backgroundSize: "500% 100%", backgroundPosition: `${slot * 25}% center` };
}

export default function PremiumFortune({ kind, title, eyebrow, description, placeholder, accent = "violet" }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [answers, setAnswers] = useState(["", ""]);
  const [focus] = useState(focusByKind[kind] ?? "genel");
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentator, setCommentator] = useState<DigitalCommentator | null>(null);
  const prompts = questionSets[kind] ?? questionSets.general!;
  const gradient = accents[accent];
  const fallback = useMemo(() => DIGITAL_COMMENTATORS.find((x) => x.specialties.includes(kind as never)), [kind]);
  const price = commentator?.priceCredits ?? fallback?.priceCredits ?? 8;
  const commentatorSlot = useMemo(() => {
    if (!commentator) return 0;
    const index = DIGITAL_COMMENTATORS.filter((x) => x.specialties.includes(kind as never)).findIndex((x) => x.id === commentator.id);
    return index >= 0 ? index : 0;
  }, [commentator, kind]);
  const visibleFields = useMemo(() => {
    const map: Partial<Record<FalKind, string[]>> = {
      love: ["love", "future"], money: ["money", "future"], career: ["career", "future"], future: ["future"], daily: ["future"],
      dream: ["love", "future"], astrology: ["love", "career", "future"], numerology: ["career", "future"], general: ["love", "career", "money", "future"],
    };
    return new Set(map[kind] ?? ["future"]);
  }, [kind]);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}");
      if (profile.relationshipStatus && kind === "love") setAnswers((a) => [String(profile.relationshipStatus), a[1]]);
    } catch {}
  }, [kind]);

  const setAnswer = (i: number, value: string) => setAnswers((a) => a.map((x, n) => n === i ? value : x));
  const next = () => { setError(""); setStep((s) => Math.min(2, s + 1) as 0 | 1 | 2); };
  const runReading = async () => {
    if (!commentator) { setError("Önce yorum yapacak sanal karakteri seç."); return; }
    setLoading(true); setError("");
    try {
      let profile: Record<string, unknown> = {};
      try { profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}"); } catch {}
      const question = [`Durum: ${answers[0].trim() || "Belirtilmedi"}`, `Özel soru: ${answers[1].trim() || "Belirtilmedi"}`].join("\n");
      const r = await fetch("/api/fal/reading", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, focus, question, profile, commentatorId: commentator.id, deliveryMode: "instant" }) });
      const data = await r.json();
      if (!r.ok) throw Object.assign(new Error(data.error || "Yorum hazırlanamadı."), { status: r.status });
      setReading(data);
    } catch (e) {
      const status = e && typeof e === "object" && "status" in e ? Number((e as { status?: number }).status) : 0;
      setError(status === 402 ? "Yeterli kredin yok. Devam etmek için kredi yükleyebilir veya Premium hizmete geçebilirsin." : e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally { setLoading(false); }
  };

  if (reading) return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.22),transparent_32%),linear-gradient(180deg,#080817,#05050d)] px-4 py-5 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex justify-between"><button onClick={() => setReading(null)} className="text-xs text-slate-300">← Yeni yorum</button><Link href="/" className="text-xs text-slate-400">Ana Sayfa</Link></header>
        <section className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${gradient} p-6 shadow-2xl sm:p-8`}><p className="text-[9px] font-bold uppercase tracking-[.25em]">{eyebrow} • Kişisel Okuma</p><h1 className="mt-2 font-serif text-3xl font-bold">{title}</h1></section>
        <section className="mt-4 rounded-[24px] border border-white/10 bg-white/[.035] p-5"><div className="flex gap-2 text-amber-200"><Sparkles /><h2 className="font-serif text-xl font-bold">Sana özel yorum</h2></div><p className="mt-4 text-sm leading-7 text-slate-200">{reading.summary}</p></section>
        <section className="mt-5 grid gap-3 sm:grid-cols-2">{fields.filter(([key]) => visibleFields.has(key)).map(([key, label, Icon]) => <article key={key} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5"><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-violet-200" /><h3 className="font-serif text-lg font-bold">{label}</h3></div><p className="mt-4 text-sm leading-7 text-slate-200">{reading.sections[key]}</p></article>)}</section>
        {reading.symbols?.length > 0 && <section className="mt-6"><h2 className="font-serif text-2xl font-bold">Öne çıkan işaretler</h2><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{reading.symbols.map((s, i) => <article key={`${s.name}-${i}`} className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="font-bold">✦ {s.name}</p><p className="mt-1 text-xs text-slate-400">{s.meaning}</p></article>)}</div></section>}
        <div className="mt-5 flex flex-wrap gap-2"><Link href="/kredi" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950">Kredi yükle</Link><Link href="/fal/premium" className="rounded-full border border-amber-200/20 px-5 py-3 text-sm font-bold text-amber-100">Premium hizmet</Link></div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,63,94,.18),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 pb-12 pt-4 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-5 flex items-center justify-between"><button onClick={() => step === 0 ? window.history.back() : setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2)} className="flex items-center gap-1 text-xs text-slate-300"><ArrowLeft className="h-4 w-4" />Geri</button><span className="rounded-full border border-violet-300/15 bg-violet-300/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[.2em] text-violet-200">Fal Köşesi</span></header>
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0b18]/95 shadow-2xl">
          <div className="relative px-5 pb-6 pt-8 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-rose-300/25 bg-gradient-to-br from-rose-500/20 to-violet-500/20"><Wand2 className="h-10 w-10 text-rose-200" /></div><p className="mt-5 text-[9px] font-black uppercase tracking-[.3em] text-amber-200">{eyebrow}</p><h1 className="mt-1 font-serif text-3xl font-black">{title}</h1><p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-400">{description}</p></div>
          <div className="border-t border-white/5 px-5 py-5 sm:px-8"><div className="mb-6 flex justify-center gap-2">{[0,1,2].map((i) => <span key={i} className={`h-2 w-10 rounded-full ${i <= step ? "bg-rose-400" : "bg-white/10"}`} />)}</div>
            {step === 0 && <div className="space-y-4"><div><p className="text-[9px] font-bold uppercase tracking-[.25em] text-rose-200">1 · Yorumcunu seç</p><h2 className="mt-1 font-serif text-2xl font-bold">Bu falı kim yorumlasın?</h2><p className="mt-1 text-xs leading-5 text-slate-500">Önce karakterini seçiyoruz; gereksiz uzun soru zinciri yok.</p></div><CommentatorPicker kind={kind} selectedId={commentator?.id ?? null} onSelect={setCommentator} />{error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}<button onClick={next} disabled={!commentator} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black disabled:opacity-50">Devam Et <ChevronRight className="h-4 w-4" /></button></div>}
            {step === 1 && <div className="space-y-4"><div><p className="text-[9px] font-bold uppercase tracking-[.25em] text-rose-200">2 · Kısa kişisel bağlam</p><h2 className="mt-1 font-serif text-2xl font-bold">Bana konuyu anlat</h2><p className="mt-1 text-xs leading-5 text-slate-500">İki kısa cevap yeterli. İstersen boş bırakıp devam edebilirsin.</p></div>{prompts.map((label, i) => <label key={label} className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-200">{i + 1}. {label}</span><textarea value={answers[i]} onChange={(e) => setAnswer(i, e.target.value)} rows={i === 1 ? 4 : 3} placeholder={i === 1 ? placeholder : "Kısaca anlatabilirsin…"} className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-rose-400" /></label>)}<button onClick={next} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black">Devam Et <ChevronRight /></button></div>}
            {step === 2 && <div className="space-y-4"><div className="text-center"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">3 · Son adım</p><h2 className="mt-1 font-serif text-2xl font-bold">Falını başlat</h2><p className="mt-1 text-xs text-slate-500">Sadece seçtiğin fal türüne özel yorum hazırlanacak.</p></div><div className="flex items-center gap-3 rounded-[24px] border border-rose-300/15 bg-rose-300/[.04] p-4"><div role="img" aria-label="Seçilen sanal karakter" className="h-16 w-16 shrink-0 rounded-2xl bg-center bg-no-repeat" style={spriteStyle(commentatorSlot)} /><div className="min-w-0"><p className="font-serif text-lg font-bold">{commentator?.name ?? fallback?.name ?? "Sanal Yorumcu"}</p><p className="text-xs text-violet-200">{commentator?.title ?? fallback?.title ?? "Sanal Yorumcu"}</p><p className="mt-1 text-[10px] text-slate-500">AI karakter • gerçek kişi değildir</p></div><strong className="ml-auto text-lg text-amber-200">{price} kredi</strong></div><div className="rounded-2xl border border-white/5 bg-white/[.02] p-4 text-xs text-slate-400"><p>✓ Fal türüne özel yöntem</p><p>✓ Seçtiğin karakterin yorum tarzı</p><p>✓ Soruna göre kişiselleştirilmiş sonuç</p></div>{error && <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.05] p-3 text-xs text-amber-100"><p>{error}</p><div className="mt-2 flex gap-2"><Link href="/kredi" className="rounded-full bg-amber-300 px-3 py-2 font-black text-slate-950">Kredi yükle</Link><Link href="/fal/premium" className="rounded-full border border-amber-200/20 px-3 py-2 font-bold">Premium hizmet</Link></div></div>}<button disabled={loading} onClick={runReading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black disabled:opacity-60">{loading ? <><Sparkles className="animate-spin" /> Falın hazırlanıyor…</> : <><Sparkles /> {price} krediyle falımı başlat</>}</button><p className="text-center text-[9px] text-slate-600">Eğlence ve kişisel farkındalık amaçlı sembolik yorum.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
