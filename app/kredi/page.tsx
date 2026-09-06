"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Coins, Crown, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { CREDIT_PACKAGES, formatTry, type CreditPackage } from "@/lib/credits";
import { getStoredMember } from "@/lib/membership";

export default function KrediPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [memberReady, setMemberReady] = useState(false);
  const [payment, setPayment] = useState<"success" | "failed" | null>(null);

  useEffect(() => {
    setMemberReady(Boolean(getStoredMember()?.email));
    const params = new URLSearchParams(window.location.search);
    const paymentResult = params.get("payment");
    setPayment(paymentResult === "success" || paymentResult === "failed" ? paymentResult : null);

    fetch("/api/credits", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as { credits?: number };
          setCredits(Number(data.credits ?? 0));
        }
      })
      .catch(() => undefined);
  }, []);

  const buy = async (pack: CreditPackage) => {
    setError("");
    setLoadingPackage(pack.id);

    try {
      const response = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pack.id }),
      });
      const data = (await response.json()) as { paymentUrl?: string; error?: string };
      if (!response.ok || !data.paymentUrl) throw new Error(data.error || "Ödeme başlatılamadı.");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ödeme başlatılamadı.");
      setLoadingPackage(null);
    }
  };

  if (!memberReady) {
    return (
      <main className="min-h-screen px-4 py-8 text-white">
        <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl">
          <Coins className="mx-auto h-10 w-10 text-amber-300" />
          <h1 className="mt-5 text-2xl font-black">Kredi almak için giriş yap</h1>
          <p className="mt-2 text-sm text-slate-400">Kredilerin hesabına tanımlanabilmesi için önce Fal Köşesi üyeliğini oluştur.</p>
          <Link href="/giris" className="mt-6 inline-flex rounded-2xl bg-amber-300 px-5 py-3 font-bold text-slate-950">Giriş / Kayıt</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Ana sayfa</Link>
          <Link href="/fal/premium" className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100"><Crown className="h-3.5 w-3.5" /> Premium</Link>
        </div>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-violet-300/15 bg-gradient-to-br from-violet-950 via-slate-950 to-slate-950 p-6 shadow-[0_30px_90px_rgba(76,29,149,.28)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.22em] text-amber-200"><Sparkles className="h-3.5 w-3.5" /> Fal Köşesi</div>
              <h1 className="mt-4 text-3xl font-black sm:text-5xl">Kredi Mağazası</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Fallara, açılımlara ve özel yorumlara kredilerinle devam et. Kredilerin hesabında saklanır.</p>
            </div>
            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-center sm:min-w-[170px]">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-200">Bakiyen</p>
              <p className="mt-1 text-3xl font-black text-white">{credits === null ? "—" : credits}</p>
              <p className="text-xs text-amber-100/70">Kredi</p>
            </div>
          </div>
        </section>

        {payment === "success" ? <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100"><Check className="h-5 w-5" /> Ödemen tamamlandı. Kredilerin hesabına eklendi.</div> : null}
        {payment === "failed" ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">Ödeme tamamlanamadı veya doğrulanamadı. Bakiyen değiştirilmedi.</div> : null}
        {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div> : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREDIT_PACKAGES.map((pack) => (
            <article key={pack.id} className={`relative overflow-hidden rounded-[1.7rem] border p-5 ${pack.popular ? "border-amber-300/50 bg-gradient-to-br from-amber-400/15 via-violet-950/50 to-slate-950" : "border-white/10 bg-white/[.035]"}`}>
              {pack.popular ? <div className="absolute right-4 top-4 rounded-full bg-amber-300 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.12em] text-slate-950">En çok tercih edilen</div> : null}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200"><Coins className="h-6 w-6" /></div>
              <p className="mt-5 text-3xl font-black">{pack.credits}</p>
              <p className="text-sm font-semibold text-amber-200">Kredi</p>
              <p className="mt-4 text-2xl font-black">{formatTry(pack.priceTry)}</p>
              {pack.bonus ? <p className="mt-1 text-xs font-bold text-emerald-300">+{pack.bonus} kredi hediye</p> : <p className="mt-1 text-xs text-slate-500">1 kredi = 1 TL</p>}
              <button disabled={loadingPackage !== null} onClick={() => buy(pack)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 px-4 py-3.5 font-black text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
                {loadingPackage === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loadingPackage === pack.id ? "Ödeme hazırlanıyor" : `${formatTry(pack.priceTry)} ile al`}
              </button>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><ShieldCheck className="h-5 w-5 text-emerald-300" /><p className="mt-3 text-sm font-bold">Güvenli ödeme</p><p className="mt-1 text-xs text-slate-500">Kart bilgileri Fal Köşesi sunucusunda tutulmaz.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><Coins className="h-5 w-5 text-amber-300" /><p className="mt-3 text-sm font-bold">Kredi hesabında</p><p className="mt-1 text-xs text-slate-500">Satın aldığın kredi bakiyene eklenir.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><Crown className="h-5 w-5 text-violet-300" /><p className="mt-3 text-sm font-bold">Premium alternatifi</p><p className="mt-1 text-xs text-slate-500">İstersen Premium üyelikle özel avantajlardan yararlan.</p></div>
        </section>
      </div>
    </main>
  );
}
