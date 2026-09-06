"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, UserRound } from "lucide-react";

const steps = [
  { id: "name", eyebrow: "Önce tanışalım", title: "Sana nasıl hitap edelim?", description: "Fal Köşesi'ni sana özel hale getirmek için adınla başlayalım." },
  { id: "birthDate", eyebrow: "Gökyüzün", title: "Ne zaman doğdun?", description: "Doğum tarihin burcunu otomatik olarak belirlememize ve yorumları kişiselleştirmemize yardımcı olur." },
  { id: "relationship", eyebrow: "Kalbin", title: "Kalbinin durumu nasıl?", description: "Aşk yorumlarını sana daha uygun hale getirmek için seçimini yap." },
  { id: "work", eyebrow: "Hayatın", title: "İş hayatında neredesin?", description: "Kariyer ve para yorumlarında doğru bağlamı kullanabilmemiz için." },
  { id: "focus", eyebrow: "Merakların", title: "Şu sıralar en çok neyi merak ediyorsun?", description: "Birden fazla alan seçebilirsin. Fal Köşesi deneyimini buna göre şekillendireceğiz." },
];

const relationshipOptions = [["single", "Bekârım", "❤️"], ["relationship", "Bir ilişkim var", "💞"], ["married", "Evliyim", "💍"], ["separated", "Ayrılık sürecindeyim", "💔"], ["complicated", "Karmaşık", "🤍"], ["prefer_not", "Belirtmek istemiyorum", "🙈"]];
const workOptions = [["employed", "Çalışıyorum", "💼"], ["student", "Öğrenciyim", "🎓"], ["business", "Kendi işimi yapıyorum", "🚀"], ["job_search", "İş arıyorum", "🔎"], ["not_working", "Çalışmıyorum", "🏠"], ["retired", "Emekliyim", "🌿"], ["prefer_not", "Belirtmek istemiyorum", "🤍"]];
const focusOptions = [["love", "Aşk", "❤️"], ["money", "Para", "💰"], ["career", "Kariyer", "💼"], ["family", "Aile", "🏡"], ["future", "Gelecek", "✨"], ["self", "Kendim", "🪞"], ["general", "Genel", "🔮"]];

function getZodiac(date: string) {
  if (!date) return "";
  const [, monthText, dayText] = date.split("-");
  const month = Number(monthText), day = Number(dayText);
  if (!month || !day) return "";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Koç ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Boğa ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "İkizler ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Yengeç ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Aslan ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Başak ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Terazi ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Akrep ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Yay ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Oğlak ♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Kova ♒";
  return "Balık ♓";
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relationship, setRelationship] = useState("");
  const [work, setWork] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const current = steps[step];
  const zodiac = useMemo(() => getZodiac(birthDate), [birthDate]);
  const canContinue = step === 0 ? name.trim().length >= 2 : step === 1 ? Boolean(birthDate && zodiac) : step === 2 ? Boolean(relationship) : step === 3 ? Boolean(work) : focus.length > 0;

  function next() {
    if (!canContinue) return;
    setStep((value) => Math.min(value + 1, steps.length));
  }

  function finish() {
    if (!canContinue) return;
    const profile = { name: name.trim(), birthDate, zodiac, relationshipStatus: relationship, workStatus: work, interests: focus, onboardingCompleted: true, completedAt: new Date().toISOString() };
    localStorage.setItem("fal-kosesi-profile", JSON.stringify(profile));
    document.cookie = "fal-kosesi-onboarding=completed; path=/; max-age=31536000; samesite=lax";
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0810] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(117,79,145,0.24),_transparent_34%),radial-gradient(circle_at_20%_80%,_rgba(189,139,61,0.10),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 md:px-8">
        <header className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b56d]/20 bg-[#f3d58a]/10 text-[#f4d58a]"><Sparkles className="h-5 w-5" /></div><span className="text-sm font-black tracking-[0.18em] text-[#f4d58a]">FAL <span className="text-white">KÖŞESİ</span></span></div><span className="text-xs text-[#bcb1c3]">{step + 1} / {steps.length + 1}</span></header>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-[#f7d98b] to-[#c88d3d] transition-all duration-500" style={{ width: `${((step + 1) / (steps.length + 1)) * 100}%` }} /></div>
        <section className="flex flex-1 flex-col justify-center py-10 md:py-14">
          {step < steps.length ? <>
            <div className="mb-8"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#f4d58a]">{current.eyebrow}</p><h1 className="text-4xl font-black leading-tight tracking-[-0.045em] md:text-5xl">{current.title}</h1><p className="mt-4 max-w-xl text-base leading-7 text-[#c9c0cf]">{current.description}</p></div>
            {step === 0 && <form onSubmit={(event) => { event.preventDefault(); next(); }} className="relative"><UserRound className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#f4d58a]" /><input autoFocus required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Adın" className="w-full rounded-2xl border border-[#d7b56d]/20 bg-white/5 px-14 py-5 text-lg text-white outline-none transition placeholder:text-[#807687] focus:border-[#f4d58a]/60 focus:bg-white/8" /></form>}
            {step === 1 && <div className="space-y-5"><input autoFocus type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-2xl border border-[#d7b56d]/20 bg-white/5 px-5 py-5 text-lg text-white outline-none focus:border-[#f4d58a]/60 [color-scheme:dark]" />{zodiac && <div className="rounded-2xl border border-[#d7b56d]/15 bg-[#f4d58a]/6 p-5"><p className="text-xs uppercase tracking-[0.2em] text-[#f4d58a]">Burcun</p><p className="mt-2 text-2xl font-bold">{zodiac}</p></div>}</div>}
            {step === 2 && <OptionGrid options={relationshipOptions} value={relationship} onChange={setRelationship} />}
            {step === 3 && <OptionGrid options={workOptions} value={work} onChange={setWork} />}
            {step === 4 && <OptionGrid options={focusOptions} value={focus} onChange={(value) => setFocus((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])} multi />}
            <div className="mt-10 flex items-center gap-3">{step > 0 && <button type="button" onClick={() => setStep((value) => value - 1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#ded5e2] transition hover:bg-white/10" aria-label="Geri"><ArrowLeft className="h-5 w-5" /></button>}{step < steps.length - 1 ? <button type="button" disabled={!canContinue} onClick={next} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-6 font-black tracking-wide text-[#140d17] shadow-[0_15px_35px_rgba(239,198,101,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35">Devam <ArrowRight className="h-5 w-5" /></button> : <button type="submit" form={step === 0 ? undefined : undefined} onClick={step === steps.length - 1 ? finish : undefined} disabled={!canContinue} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-6 font-black tracking-wide text-[#140d17] shadow-[0_15px_35px_rgba(239,198,101,0.18)] disabled:opacity-35">Tamamla <Check className="h-5 w-5" /></button>}</div>
          </> : <div className="text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d7b56d]/25 bg-[#f4d58a]/10 text-[#f4d58a]"><Check className="h-9 w-9" /></div><p className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#f4d58a]">Hazırsın</p><h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-5xl">Harika, {name.trim()} ✨</h1><p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#c9c0cf]">Seni biraz tanıdık. Bundan sonra Fal Köşesi'ndeki yorumları profilindeki bilgiler ve seçtiğin ilgi alanlarıyla daha kişisel hale getireceğiz.</p><button type="button" onClick={finish} className="mt-9 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-7 font-black tracking-wide text-[#140d17] shadow-[0_15px_35px_rgba(239,198,101,0.22)]">Fal Köşesi'ne Gir <Sparkles className="h-5 w-5" /></button></div>}
        </section>
        <footer className="pb-2 text-center text-[11px] leading-5 text-[#756b7b]">Bilgilerin yalnızca deneyimini kişiselleştirmek için kullanılır. Hassas gördüğün alanlarda “Belirtmek istemiyorum” seçeneğini kullanabilirsin.</footer>
      </div>
    </main>
  );
}

function OptionGrid({ options, value, onChange, multi = false }: { options: string[][]; value: string | string[]; onChange: (value: string) => void; multi?: boolean }) {
  return <div className="grid gap-3 sm:grid-cols-2">{options.map(([id, label, emoji]) => { const selected = multi ? (value as string[]).includes(id) : value === id; return <button key={id} type="button" onClick={() => onChange(id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${selected ? "border-[#f4d58a]/65 bg-[#f4d58a]/10 shadow-[0_10px_30px_rgba(244,213,138,0.08)]" : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/7"}`}><span className="text-2xl">{emoji}</span><span className="flex-1 text-sm font-semibold md:text-base">{label}</span>{selected && <Check className="h-5 w-5 text-[#f4d58a]" />}</button>; })}</div>;
}
