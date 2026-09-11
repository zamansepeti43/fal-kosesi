"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, ChevronLeft, ChevronRight, Coffee, ImagePlus, Sparkles, Upload as UploadIcon, X } from "lucide-react";
import CommentatorPicker from "@/app/fal/components/commentator-picker";
import { DIGITAL_COMMENTATORS, type DigitalCommentator } from "@/lib/fortune/catalog";

const MAX_FILES = 3;
const MAX_BYTES = 8 * 1024 * 1024;

const coffeeQuestions = [
  "Sana nasıl hitap edelim?",
  "Şu an hayatında en çok hangi konu gündeminde?",
  "Bu konuda seni en çok düşündüren veya meraklandıran şey ne?",
  "Fincanındaki yorumun özellikle cevaplamasını istediğin bir soru var mı?",
];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Lütfen JPG, PNG veya WEBP bir fotoğraf seç."));
    if (file.size > MAX_BYTES) return reject(new Error("Fotoğraf 8 MB'dan küçük olmalı."));

    const image = new Image();
    const url = URL.createObjectURL(file);
    let settled = false;

    const fail = (message = "Görüntü işlenemedi. Lütfen fotoğrafı yeniden seç.") => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      reject(new Error(message));
    };

    const finish = () => {
      if (settled) return;
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) return fail("Geçersiz görüntü. Lütfen JPG, PNG veya WEBP bir fotoğraf seç.");
        const scale = Math.min(1, 1600 / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return fail("Görüntü işlenemedi. Lütfen tekrar dene.");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        settled = true;
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch {
        fail("Görüntü işlenemedi. Lütfen fotoğrafı yeniden seç.");
      }
    };

    image.onload = finish;
    image.onerror = () => {
      const reader = new FileReader();
      reader.onload = () => {
        const fallbackImage = new Image();
        fallbackImage.onload = () => {
          if (settled) return;
          try {
            const width = fallbackImage.naturalWidth;
            const height = fallbackImage.naturalHeight;
            if (!width || !height) return fail("Geçersiz görüntü. Lütfen fotoğrafı yeniden seç.");
            const scale = Math.min(1, 1600 / Math.max(width, height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(width * scale));
            canvas.height = Math.max(1, Math.round(height * scale));
            const ctx = canvas.getContext("2d");
            if (!ctx) return fail("Görüntü işlenemedi. Lütfen tekrar dene.");
            ctx.drawImage(fallbackImage, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            settled = true;
            URL.revokeObjectURL(url);
            resolve(dataUrl);
          } catch {
            fail("Görüntü işlenemedi. Lütfen fotoğrafı yeniden seç.");
          }
        };
        fallbackImage.onerror = () => fail("Geçersiz görüntü. Lütfen JPG, PNG veya WEBP bir fotoğraf seç.");
        fallbackImage.src = String(reader.result || "");
      };
      reader.onerror = () => fail("Fotoğraf okunamadı. Lütfen tekrar seç.");
      reader.readAsDataURL(file);
    };
    image.src = url;
  });
}

type Step = 0 | 1 | 2 | 3;
type Commentator = DigitalCommentator & { favorite?: boolean; type?: string };

export default function UploadClient() {
  const [step, setStep] = useState<Step>(0);
  const [commentator, setCommentator] = useState<Commentator | null>(null);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [focus, setFocus] = useState("genel");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const fallback = useMemo(() => DIGITAL_COMMENTATORS.find((item) => item.specialties.includes("coffee")), []);
  const activeCommentator = commentator ?? null;
  const price = activeCommentator?.priceCredits ?? fallback?.priceCredits ?? 10;

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}");
      if (profile.name) setAnswers((current) => [String(profile.name).split(" ")[0], current[1], current[2], current[3]]);
    } catch {}

    const param = new URLSearchParams(window.location.search).get("commentator");
    if (param) {
      const match = DIGITAL_COMMENTATORS.find((item) => item.id === param && item.specialties.includes("coffee"));
      if (match) setCommentator(match);
    }
  }, []);

  const setAnswer = (index: number, value: string) => setAnswers((current) => current.map((item, i) => i === index ? value : item));

  const next = () => {
    setError("");
    if (step === 0 && !commentator) return setError("Önce sana yorum yapacak sanal karakteri seç.");
    if (step === 1 && answers.some((item) => !item.trim())) return setError("Lütfen 4 sorunun tamamını cevapla.");
    if (step === 2 && files.length === 0) return setError("Fal için en az 1 fincan fotoğrafı yükle.");
    setStep((value) => Math.min(3, value + 1) as Step);
  };

  const back = () => { setError(""); setStep((value) => Math.max(0, value - 1) as Step); };

  const addFiles = (selected: File[]) => {
    setError("");
    const images = selected.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return setError("Lütfen JPG, PNG veya WEBP bir fotoğraf seç.");
    if (images.some((file) => file.size > MAX_BYTES)) return setError("Her fotoğraf en fazla 8 MB olabilir.");
    setFiles(images.slice(0, MAX_FILES));
    if (images.length > MAX_FILES) setError("En fazla 3 fotoğraf kullanılabilir; ilk 3 fotoğraf seçildi.");
  };

  const startReading = async () => {
    if (!commentator || files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const images = await Promise.all(files.map(compressImage));
      const question = coffeeQuestions.map((label, index) => `${label}: ${answers[index]}`).join("\n");
      sessionStorage.setItem("falImages", JSON.stringify(images));
      sessionStorage.setItem("falFocus", JSON.stringify({ focus, question }));
      sessionStorage.setItem("falCommentatorId", commentator.id);
      window.location.href = "/fal/analyze";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraflar hazırlanamadı.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,63,94,.20),transparent_34%),linear-gradient(180deg,#080817,#05050d)] px-4 pb-12 pt-4 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-5 flex items-center justify-between">
          <button type="button" onClick={step === 0 ? () => { window.location.href = "/"; } : back} className="flex items-center gap-1 text-xs text-slate-300"><ArrowLeft className="h-4 w-4"/>{step === 0 ? "Ana sayfa" : "Geri"}</button>
          <span className="rounded-full border border-violet-300/15 bg-violet-300/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[.2em] text-violet-200">Kahve Falı</span>
        </header>
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0b18]/95 shadow-2xl">
          <div className="relative overflow-hidden px-5 pb-6 pt-8 text-center sm:px-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle,rgba(244,63,94,.20),transparent_65%)]"/>
            <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-rose-300/25 bg-gradient-to-br from-rose-500/25 to-violet-500/20 shadow-[0_0_50px_rgba(244,63,94,.18)]"><Coffee className="h-10 w-10 text-amber-200"/></div>
            <p className="relative mt-5 text-[9px] font-black uppercase tracking-[.3em] text-amber-200">{commentator?.name ? `${commentator.name} seni dinliyor` : "Önce falcını seç"}</p>
            <h1 className="relative mt-1 font-serif text-3xl font-black">Kahve Falı</h1>
            <p className="relative mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-400">Önce falcını seç. Sonra seçtiğin sanal karakter sana birkaç soru soracak; fotoğraflarını aldıktan sonra falın krediyle başlatılacak.</p>
          </div>
          <div className="border-t border-white/5 px-5 py-5 sm:px-8">
            <div className="mb-6 flex items-center justify-center gap-2">{[0,1,2,3].map((item) => <span key={item} className={`h-2 w-10 rounded-full transition ${item <= step ? "bg-rose-400" : "bg-white/10"}`}/>)}</div>
            {step === 0 && <div className="space-y-4">
              <div className="rounded-2xl border border-rose-300/15 bg-rose-300/[.04] p-4"><p className="font-serif text-xl font-bold">İlk olarak falcını seç ✨</p><p className="mt-1 text-xs leading-5 text-slate-400">Bunlar gerçek kişiler değildir. Her biri farklı yorum tonu ve uzmanlıkla hazırlanmış sanal karakterdir.</p></div>
              <CommentatorPicker kind="coffee" selectedId={commentator?.id ?? null} onSelect={(value) => setCommentator(value as Commentator | null)} />
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}
              <button type="button" onClick={next} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black">Bu falcıyla devam et <ChevronRight className="h-4 w-4"/></button>
            </div>}
            {step === 1 && <div className="space-y-4">
              <div className="mb-3 rounded-2xl border border-rose-300/15 bg-rose-300/[.04] p-4"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-rose-200">{commentator?.name} soruyor</p><h2 className="mt-1 font-serif text-2xl font-bold">Önce seni biraz tanıyalım</h2><p className="mt-1 text-xs leading-5 text-slate-500">Cevapların yorumun kişiselleştirilmesi için kullanılacak.</p></div>
              {coffeeQuestions.map((label, index) => <label key={label} className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-200">{index + 1}. {label}</span>{index === 0 ? <input value={answers[index]} onChange={(e) => setAnswer(index, e.target.value)} placeholder="İsmin veya hitap şeklin" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-rose-400"/> : <textarea value={answers[index]} onChange={(e) => setAnswer(index, e.target.value)} rows={index === 3 ? 3 : 2} placeholder="Kısaca anlatabilirsin..." className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-rose-400"/>}</label>)}
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}
              <button type="button" onClick={next} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black">Sorularımı gönderdim <ChevronRight className="h-4 w-4"/></button>
            </div>}
            {step === 2 && <div className="space-y-4">
              <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-4"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">{commentator?.name} senden fincanı istiyor</p><h2 className="mt-1 font-serif text-2xl font-bold">Fincan fotoğraflarını yükle</h2><p className="mt-1 text-xs leading-5 text-slate-500">En iyi yorum için fincan içini, mümkünse tabağı ve farklı açılardan net görüntüleri gönder.</p></div>
              <label htmlFor="file-input" className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-rose-300/25 bg-rose-300/[.025] p-8"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[.04]"><ImagePlus className="h-6 w-6 text-rose-200"/></span><span className="mt-3 text-sm font-bold">Fotoğraf seç veya sürükle</span><p className="mt-1 text-[10px] text-slate-500">1-3 fotoğraf • JPG, PNG veya WEBP • 8 MB</p><input id="file-input" ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => addFiles(Array.from(e.target.files ?? []))}/></label>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => addFiles(Array.from(e.target.files ?? []))}/>
              <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => cameraRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-xs font-bold"><Camera className="h-4 w-4"/> Kameradan çek</button><button type="button" onClick={() => inputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-xs font-bold"><UploadIcon className="h-4 w-4"/> Galeriden seç</button></div>
              {files.length > 0 && <div className="grid grid-cols-3 gap-2">{files.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="relative overflow-hidden rounded-2xl border border-white/10"><img src={URL.createObjectURL(file)} alt={`Fincan fotoğrafı ${index + 1}`} className="aspect-[4/5] w-full object-cover"/><button type="button" aria-label={`Fotoğraf ${index + 1} kaldır`} onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70"><X className="h-3.5 w-3.5"/></button></div>)}</div>}
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}
              <button type="button" onClick={next} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black">Fincanı gönderdim <ChevronRight className="h-4 w-4"/></button>
            </div>}
            {step === 3 && <div className="space-y-4">
              <div className="text-center"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">Son kontrol</p><h2 className="mt-1 font-serif text-2xl font-bold">Falını başlatalım mı?</h2><p className="mt-1 text-xs text-slate-500">Kredi yalnızca aşağıdaki butona bastığında kullanılır.</p></div>
              <div className="rounded-[24px] border border-rose-300/15 bg-rose-300/[.04] p-4"><div className="flex items-center gap-3"><img src={`/api/fal/avatar?id=${encodeURIComponent(commentator?.id ?? fallback?.id ?? "coffee-esmeralya")}`} alt="Seçilen sanal karakter" className="h-16 w-16 rounded-2xl bg-[#21152d] object-cover"/><div><p className="font-serif text-lg font-bold">{commentator?.name}</p><p className="text-xs text-violet-200">{commentator?.title}</p><p className="mt-1 text-[10px] text-slate-500">AI karakter • gerçek kişi değildir</p></div><strong className="ml-auto text-lg text-amber-200">{price} kredi</strong></div><div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-xs text-slate-400"><p>✓ {answers.length} kişisel soru yanıtlandı</p><p>✓ {files.length} fincan fotoğrafı hazır</p><p>✓ {commentator?.name} yorum tarzı seçildi</p><p>✓ Fal hazırlandığında bildirim oluşturulacak</p></div></div>
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</p>}
              <button type="button" disabled={loading} onClick={startReading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-4 text-sm font-black shadow-[0_14px_35px_rgba(244,63,94,.20)] disabled:opacity-60">{loading ? <><Sparkles className="h-4 w-4 animate-spin"/> Fal hazırlanıyor...</> : <><Sparkles className="h-4 w-4"/>{price} Krediyle Falımı Başlat <ChevronRight className="h-4 w-4"/></>}</button>
              <p className="text-center text-[9px] text-slate-600">Eğlence ve kişisel farkındalık amaçlı sembolik yorumdur.</p>
            </div>}
          </div>
        </section>
      </div>
    </main>
  );
}
