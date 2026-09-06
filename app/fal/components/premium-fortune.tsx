"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Heart, Sparkles, WalletCards, BriefcaseBusiness, Moon, Star, Wand2 } from "lucide-react";
import type { FalKind, ReadingResult } from "@/lib/ai/provider";

type Props = { kind: FalKind; title: string; eyebrow: string; description: string; placeholder: string; accent?: "rose" | "emerald" | "violet" | "amber" | "blue" };

const accents = {
  rose: "from-rose-500 to-fuchsia-500 border-rose-300/20 text-rose-100",
  emerald: "from-emerald-500 to-lime-400 border-emerald-300/20 text-emerald-100",
  violet: "from-violet-500 to-fuchsia-500 border-violet-300/20 text-violet-100",
  amber: "from-amber-400 to-orange-400 border-amber-300/20 text-amber-100",
  blue: "from-sky-500 to-indigo-500 border-sky-300/20 text-sky-100",
};

const fields = [
  ["love", "Aşk", Heart, "Kalbinin gündemi"],
  ["money", "Para & Kısmet", WalletCards, "Maddi akışın"],
  ["career", "İş & Kariyer", BriefcaseBusiness, "Hedeflerin"],
  ["future", "Yakın Gelecek", Moon, "Önündeki dönem"],
] as const;

export default function PremiumFortune({ kind, title, eyebrow, description, placeholder, accent = "violet" }: Props) {
  const [question, setQuestion] = useState("");
  const [focus, setFocus] = useState("genel");
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const gradient = accents[accent];

  const runReading = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) { setError("Sana özel yorum için bir soru veya merakını yaz."); return; }
    setLoading(true); setError("");
    try {
      let profile: Record<string, unknown> = {};
      try { profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}"); } catch {}
      const response = await fetch("/api/fal/reading", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, focus, question: question.trim(), profile }) });
      if (!response.ok) throw new Error("Yorum hazırlanamadı.");
      setReading(await response.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Bir hata oluştu."); }
    finally { setLoading(false); }
  };

  if (reading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.22),transparent_32%),linear-gradient(180deg,#080817,#05050d)] px-4 py-5 text-white sm:py-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-5 flex items-center justify-between"><button type="button" onClick={() => setReading(null)} className="text-xs text-slate-300">← Yeni yorum</button><Link href="/" className="text-xs text-slate-400">Ana Sayfa</Link></header>
          <section className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${gradient} bg-opacity-10 p-6 shadow-2xl sm:p-8`}>
            <p className="text-[9px] font-bold uppercase tracking-[.25em] opacity-80">{eyebrow} • Premium Okuma</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">Sorun ve profilindeki bilgiler birlikte değerlendirilerek hazırlanan kişisel yorum.</p>
          </section>
          <section className="mt-4 rounded-[24px] border border-white/10 bg-white/[.035] p-5 shadow-xl sm:p-7"><div className="flex items-center gap-2 text-amber-200"><Sparkles className="h-5 w-5"/><h2 className="font-serif text-xl font-bold">Sana özel genel yorum</h2></div><p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">{reading.summary}</p></section>
          <section className="mt-5"><div className="mb-3 flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.25em] text-violet-200">Kişisel analiz</p><h2 className="mt-1 font-serif text-2xl font-bold">Hayatının dört alanı</h2></div><span className="text-xs text-slate-500">Derin okuma</span></div><div className="grid gap-3 sm:grid-cols-2">{fields.map(([key, label, Icon, subtitle]) => <article key={key} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5 shadow-xl"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-400/10 text-violet-200"><Icon className="h-5 w-5"/></span><div><h3 className="font-serif text-lg font-bold">{label}</h3><p className="text-[10px] text-slate-500">{subtitle}</p></div></div><p className="mt-4 text-sm leading-7 text-slate-200">{reading.sections[key]}</p></article>)}</div></section>
          {reading.symbols?.length > 0 && <section className="mt-6"><h2 className="mb-3 font-serif text-2xl font-bold">Öne çıkan işaretler</h2><div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{reading.symbols.map((symbol, index) => <article key={`${symbol.name}-${index}`} className="rounded-[20px] border border-white/[.08] bg-white/[.03] p-4"><div className="flex justify-between"><span className="text-lg text-amber-200">✦</span><span className="text-[8px] uppercase tracking-widest text-slate-500">{symbol.zone}</span></div><h3 className="mt-2 font-serif font-bold">{symbol.name}</h3><p className="mt-1 text-xs leading-5 text-slate-300">{symbol.meaning}</p></article>)}</div></section>}
          <section className="mt-5 rounded-[22px] border border-amber-300/20 bg-amber-300/[.05] p-5"><p className="text-[9px] uppercase tracking-[.25em] text-amber-200">Falcının sana sorusu</p><p className="mt-2 font-serif text-lg font-semibold">{reading.followUpQuestion}</p></section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.20),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 py-5 text-white sm:py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-3"><Link href="/" className="text-xs text-slate-300 sm:text-sm"><ArrowLeft className="mr-1 inline h-4 w-4"/> Geri</Link><span className="text-slate-600">/</span><span className="text-xs text-slate-400">{eyebrow}</span></header>
        <section className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-2xl backdrop-blur-xl sm:p-9"><div className="flex items-start gap-4"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}><Wand2 className="h-7 w-7 text-white"/></div><div><p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">{eyebrow}</p><h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-300">{description}</p></div></div>
          <form onSubmit={runReading} className="mt-7 space-y-5"><div><label className="mb-2 block text-sm font-semibold text-slate-200">Bugün hangi alanı derinleştirelim?</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{["genel","aşk","para","kariyer","gelecek"].map((item) => <button type="button" key={item} onClick={() => setFocus(item)} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold capitalize transition ${focus === item ? "border-amber-300/60 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[.03] text-slate-400"}`}>{item}</button>)}</div></div><div><label htmlFor="premium-question" className="mb-2 block text-sm font-semibold text-slate-200">Sana özel sorunu yaz</label><textarea id="premium-question" value={question} onChange={(e) => setQuestion(e.target.value)} rows={6} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"/><p className="mt-2 text-[10px] text-slate-500">Profilindeki isim, doğum bilgisi, ilişki/iş durumu ve seçtiğin odak yorumun kişiselleştirilmesi için kullanılır.</p></div>{error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-violet-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,.25)] disabled:opacity-60">{loading ? <><Sparkles className="h-4 w-4 animate-spin"/> Senin için yorumlanıyor...</> : <><Sparkles className="h-4 w-4"/> Premium Yorumumu Hazırla <ChevronRight className="h-4 w-4"/></>}</button></form>
        </section>
      </div>
    </main>
  );
}
