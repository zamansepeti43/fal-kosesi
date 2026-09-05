"use client";

import Link from "next/link";
import { Sparkles, SunMedium, Heart, Briefcase, Wallet, type LucideIcon } from "lucide-react";

const reading = {
  headline: "Enerjiniz bugün canlı ve olumlu bir akışta.",
  love: "Aşk alanında samimi ve açık iletişim size güzel bir artı kazandırır.",
  career: "İş hayatında küçük ama doğru adımlar, kısa sürede görünürlük sağlar.",
  money: "Maddi akışta denge ve ana plan önem kazanır; beklenmedik bir fırsat fırsat olarak doğabilir.",
  advice: "Bugün sabırlı olmak, küçük adımlarla ilerlemek ve iç sesinizi dinlemek en güçlü hamle olacak.",
};

const entries: Array<{ title: string; value: string; icon: LucideIcon }> = [
  { title: "❤️ Aşk", value: reading.love, icon: Heart },
  { title: "💼 Kariyer", value: reading.career, icon: Briefcase },
  { title: "💰 Para", value: reading.money, icon: Wallet },
  { title: "✨ Tavsiye", value: reading.advice, icon: Sparkles },
];

export default function GunlukClient() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300">
            ← Ana sayfa
          </Link>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-amber-500 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.3)]">
              <SunMedium className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Günlük fal</p>
              <h1 className="mt-1 text-2xl font-bold text-white">Bugünün enerjisi</h1>
            </div>
          </div>

          <div className="mb-6 rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/5 to-orange-300/10 p-5">
            <p className="text-lg font-medium leading-8 text-slate-100">{reading.headline}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {entries.map(({ title, value, icon: Icon }) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-amber-200">
                  <Icon className="h-4 w-4" />
                  <h2 className="text-base font-semibold text-white">{title}</h2>
                </div>
                <p className="text-sm leading-7 text-slate-300">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
