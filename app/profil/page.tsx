"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Crown, Mail, Sparkles, Star, UserRound } from "lucide-react";
import { getStoredMember, MemberRecord } from "@/lib/membership";

const emptyMember: MemberRecord = {
  id: "guest",
  name: "Misafir Üye",
  email: "misafir@fal-kosesi.com",
  phone: "+90 5xx xxx xx xx",
  location: "Türkiye",
  plan: "Normal Üye",
  status: "Üye",
  memberSince: "Bugün",
  renewalDate: "1 ücretsiz fal hakkı",
  readings: 0,
  favorites: 0,
  streak: 0,
  lastReading: "Henüz fal bakılmadı",
  premium: false,
  membership: "member",
  freeReadingsLeft: 1,
};

const perks = [
  "1 ücretsiz fal hakkı",
  "Haftalık ve aylık üyelik seçenekleri",
  "Öncelikli fal analizi",
  "Özel premium içerik erişimi",
];

export default function ProfilPage() {
  const [member, setMember] = useState<MemberRecord>(emptyMember);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredMember();
    setMember(stored || emptyMember);
    setReady(true);
  }, []);

  if (!ready) {
    return <main className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</main>;
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300">
            <ArrowLeft className="h-4 w-4" /> Ana sayfa
          </Link>
          <Link href="/fal/premium" className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-100">
            <Crown className="h-3.5 w-3.5" /> Üyelik planı
          </Link>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-[0_0_28px_rgba(168,85,247,0.35)]">
                <UserRound className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Profil</p>
                <h1 className="mt-2 text-3xl font-black text-white">{member.name}</h1>
                <p className="text-sm text-slate-300">{member.email}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-violet-500/10 to-slate-900/40 p-4 text-left">
              <div className="flex items-center gap-2 text-amber-200">
                <Star className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.2em]">Üyelik durumu</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{member.plan}</p>
              <p className="text-sm text-slate-300">Durum: {member.status}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Toplam fal", member.readings],
              ["Kalan ücretsiz fal", member.freeReadingsLeft],
              ["İçerik serisi", `${member.streak} gün`],
              ["Son okuma", member.lastReading],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{String(label)}</p>
                <p className="mt-3 text-2xl font-bold text-white">{String(value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-2 text-amber-200">
                <UserRound className="h-4 w-4" />
                <h2 className="text-lg font-semibold text-white">Kişisel bilgiler</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">E-posta</span>
                  <span className="flex items-center gap-2 font-medium text-white">
                    <Mail className="h-4 w-4 text-violet-200" />
                    {member.email}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Telefon</span>
                  <span className="font-medium text-white">{member.phone}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Konum</span>
                  <span className="font-medium text-white">{member.location}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Üyelik başlangıcı</span>
                  <span className="font-medium text-white">{member.memberSince}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Yenileme / plan</span>
                  <span className="font-medium text-white">{member.renewalDate}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900 to-amber-400/10 p-5">
              <div className="mb-4 flex items-center gap-2 text-amber-200">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-lg font-semibold text-white">Üyelik avantajları</h2>
              </div>

              <div className="space-y-3">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-200">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
