"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Check, ChevronRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";

type Commentator = { name?: string; title?: string; avatarUrl?: string };

type Step = { title: string; detail: string };

const STEPS: Step[] = [
  { title: "Fincanın okunuyor", detail: "Telve izleri ve belirgin şekiller tek tek inceleniyor." },
  { title: "Sorularınla eşleştiriliyor", detail: "Seçtiğin konu ve verdiğin bilgiler yorumun içine işleniyor." },
  { title: "Sana özel yorumun hazırlanıyor", detail: "Yorumcun bütün işaretleri bir araya getiriyor." },
];

export default function AnalyzeClient() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(180);
  const [statusText, setStatusText] = useState("Fincanın için ilk işaretler okunuyor...");
  const [commentator, setCommentator] = useState<Commentator>({ name: "Serafina", title: "Aşk Telvesi Uzmanı", avatarUrl: "/api/fal/avatar?id=coffee-serafina" });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");

  const currentStep = Math.min(step, STEPS.length - 1);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const etaText = remaining >= 60 ? `Yaklaşık ${Math.max(1, Math.ceil(remaining / 60))} dk` : `Yaklaşık ${remaining} sn`;

  const statusLabel = useMemo(() => {
    if (step >= 2) return "Son dokunuşlar yapılıyor";
    if (step === 1) return "İşaretlerin anlamı senin sorularınla birleşiyor";
    return "Fincanın dikkatle okunuyor";
  }, [step]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) setNotificationPermission("unsupported");
    else setNotificationPermission(Notification.permission);
  }, []);

  const enableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      new Notification("Fal Köşesi ✦", { body: "Falın hazır olduğunda sana haber vereceğiz." });
    }
  };

  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | null = null;
    let countdown: ReturnType<typeof setInterval> | null = null;

    const start = async () => {
      try {
        const images = JSON.parse(sessionStorage.getItem("falImages") || "[]");
        const storedFocus = JSON.parse(sessionStorage.getItem("falFocus") || "{\"focus\":\"genel\",\"question\":\"\"}");
        const commentatorId = sessionStorage.getItem("falCommentatorId");
        const focusData = { ...storedFocus, commentatorId: commentatorId ?? storedFocus.commentatorId ?? null };
        const profile = JSON.parse(localStorage.getItem("fal-kosesi-profile") || "{}");

        if (!Array.isArray(images) || !images.length) throw new Error("Henüz fotoğraf yüklenmedi. Lütfen önce fotoğraf yüklemelisin.");
        if (!commentatorId) throw new Error("Önce bir sanal falcı seçmelisin.");

        const response = await fetch("/api/fal/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "coffee",
            focus: focusData.focus ?? "genel",
            question: focusData.question ?? "",
            images,
            profile,
            commentatorId: focusData.commentatorId,
            deliveryMode: "queued",
            delaySeconds: 180,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Fal sıraya alınamadı.");

        sessionStorage.removeItem("falCommentatorId");
        if (cancelled) return;

        setReadingId(String(data.readingId));
        setRemaining(Number(data.etaSeconds ?? 180));
        if (data.commentator) setCommentator(data.commentator);
        setProgress(18);
        setStatusText("Fincanın sıraya alındı. İstersen şimdi çıkabilirsin; hazır olduğunda haberin olacak.");
        setStep(0);

        poll = setInterval(async () => {
          if (!data.readingId || cancelled) return;
          try {
            const r = await fetch(`/api/readings/${encodeURIComponent(data.readingId)}`, { cache: "no-store" });
            const detail = await r.json();
            const reading = detail.reading;
            if (!reading) return;
            const status = String(reading.status ?? "queued");

            if (status === "processing") {
              setStatusText("İşaretlerin anlamı senin sorularınla birleştiriliyor...");
              setStep(1);
              setProgress(58);
            } else if (status === "ready") {
              setStatusText("Falın hazır. Sonuç ekranına geçiyoruz...");
              setStep(2);
              setProgress(100);
              sessionStorage.setItem("falResult", JSON.stringify(reading.result));
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                new Notification("Falın hazır ✦", { body: `${commentator.name ?? "Yorumcunun"} hazırladığı falını şimdi okuyabilirsin.` });
              }
              if (poll) clearInterval(poll);
              window.location.href = `/fal/sonuc?id=${encodeURIComponent(data.readingId)}`;
            } else if (status === "failed") {
              if (poll) clearInterval(poll);
              setError(reading.error_message || "Fal hazırlanamadı.");
            } else {
              setStatusText("Fincanın sırada; yorumcun birazdan okumaya başlıyor...");
              setStep(0);
              setProgress(18);
            }
          } catch {
            // Temporary polling failures should not interrupt the queued reading.
          }
        }, 5000);

        countdown = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Fal verileri okunamadı.");
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (countdown) clearInterval(countdown);
    };
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#08050c] px-5 py-10 text-white">
        <div className="mx-auto max-w-xl">
          <Link href="/fal/upload" className="text-sm text-slate-300">← Yeniden dene</Link>
          <section className="mt-10 rounded-[32px] border border-red-300/15 bg-white/[.045] p-8 text-center shadow-2xl">
            <span className="text-3xl">⚠️</span>
            <p className="mt-4 text-slate-200">{error}</p>
            <Link href="/fal/upload" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950"><Sparkles size={17} /> Yeniden dene</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(190,83,142,.20),transparent_28%),radial-gradient(circle_at_15%_45%,rgba(130,71,44,.18),transparent_30%),#08050c] px-4 py-6 text-white sm:py-8">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,rgba(255,192,116,.05),transparent_35%,rgba(207,75,160,.06))]" />
      <div className="relative mx-auto max-w-2xl">
        <header className="flex items-center justify-between px-1">
          <Link href="/fal/upload" aria-label="Geri" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/20 text-2xl text-white">‹</Link>
          <div className="text-center">
            <p className="font-serif text-2xl font-bold tracking-tight text-amber-100">Fal Köşesi</p>
            <p className="text-[9px] uppercase tracking-[.32em] text-amber-200/60">Her fal bir yolculuktur</p>
          </div>
          <div className="h-10 w-10" />
        </header>

        <section className="mt-5 rounded-[34px] border border-amber-200/10 bg-black/25 px-4 py-7 shadow-[0_25px_90px_rgba(0,0,0,.45)] backdrop-blur-sm sm:px-8 sm:py-9">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-1 top-3 hidden w-20 text-center sm:block">
              <span className="text-2xl text-amber-200">✦</span>
              <p className="mt-1 font-serif text-[11px] leading-5 text-amber-100/80">İyi şeyler<br />seni bekliyor</p>
            </div>

            <div className="relative mx-auto h-60 w-60 sm:h-72 sm:w-72">
              <div className="absolute inset-0 rounded-full border-[7px] border-white/10" />
              <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-fuchsia-400 border-r-pink-300 shadow-[0_0_28px_rgba(244,114,182,.25)]" style={{ transform: `rotate(${progress * 3.2}deg)` }} />
              <div className="absolute inset-[12px] overflow-hidden rounded-full border border-amber-200/20 bg-[#1b0e18] shadow-[inset_0_0_50px_rgba(0,0,0,.6)]">
                <img src={commentator.avatarUrl || "/api/fal/avatar?id=coffee-serafina"} alt={commentator.name || "Yorumcu"} className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-1/2 grid h-12 w-12 -translate-x-1/2 translate-y-2 place-items-center rounded-full border border-amber-200/30 bg-[#1a0d16] text-amber-200 shadow-lg">
                <span className="text-xl">☕</span>
              </div>
            </div>
          </div>

          <div className="mt-9 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-pink-200/70">{statusLabel}</p>
            <h1 className="mt-2 font-serif text-3xl font-black leading-tight text-white sm:text-4xl">{commentator.name} fincanını inceliyor…</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">{statusText}</p>
          </div>

          <div className="mx-auto mt-7 flex max-w-xl items-start justify-between gap-2">
            {STEPS.map((item, index) => {
              const active = index <= currentStep;
              return (
                <div key={item.title} className="flex w-1/3 flex-col items-center text-center">
                  <div className={`grid h-12 w-12 place-items-center rounded-full border-2 transition ${active ? "border-pink-300 bg-pink-300/10 text-pink-200 shadow-[0_0_22px_rgba(244,114,182,.18)]" : "border-white/15 bg-white/[.03] text-slate-600"}`}>
                    {index < currentStep ? <Check size={20} /> : index === currentStep ? <Sparkles size={18} className="animate-pulse" /> : <span className="text-sm">{index + 1}</span>}
                  </div>
                  {index < STEPS.length - 1 && <div className={`mt-[-25px] ml-[100%] h-px w-full ${index < currentStep ? "bg-pink-300/60" : "bg-white/10"}`} />}
                  <p className={`mt-3 text-[11px] leading-4 ${active ? "text-pink-100" : "text-slate-500"}`}>{item.title}</p>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-7 max-w-sm overflow-hidden rounded-2xl border border-amber-200/20 bg-amber-100/[.035]">
            <div className="flex items-center justify-center gap-2 px-4 py-3 text-amber-100">
              <Clock3 size={17} />
              <strong className="font-serif text-lg">{etaText}</strong>
            </div>
            <div className="h-1 bg-white/5"><div className="h-full bg-gradient-to-r from-pink-300 via-fuchsia-400 to-violet-400 transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="px-4 py-3 text-center text-[11px] leading-5 text-slate-400">Bu ekranda beklemek zorunda değilsin. Falın hesabına kaydedildi; hazır olduğunda sana haber vereceğiz.</p>
          </div>

          {notificationPermission !== "granted" && notificationPermission !== "unsupported" && (
            <button type="button" onClick={enableNotifications} className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-pink-300/25 bg-pink-300/[.06] px-5 py-3 text-xs font-bold text-pink-100 transition hover:bg-pink-300/10">
              <Bell size={15} /> Falım hazır olduğunda bildirim gönder
            </button>
          )}
          {notificationPermission === "granted" && <p className="mt-5 text-center text-[11px] text-emerald-200/80">✓ Bildirimler açık — falın hazır olduğunda sana haber vereceğiz.</p>}

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/fal/gecmis" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[.05]">Fal geçmişine git <ChevronRight size={16} /></Link>
            <span className="text-[10px] text-slate-600">{readingId ? `Kayıt: ${readingId.slice(0, 8)}…` : "Kayıt oluşturuluyor…"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
