import Link from "next/link";
import { ArrowLeft, Check, Crown, Mail, Sparkles, Star, UserRound } from "lucide-react";

const profile = {
  name: "Ayşe Demir",
  username: "@aysefal",
  email: "ayse.demir@gmail.com",
  location: "İstanbul, Türkiye",
  memberSince: "14 Mart 2026",
  plan: "Premium Plus",
  status: "Aktif",
  renewalDate: "30 Temmuz 2026",
  readings: 42,
  favorites: 18,
  streak: 12,
  lastReading: "Tarot Falı",
};

const perks = [
  "Sınırsız özel yorumlar",
  "Öncelikli fal analizi",
  "Favori yorumların kaydı",
  "Özel premium içerik erişimi",
];

export default function Profil() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300">
            <ArrowLeft className="h-4 w-4" /> Ana sayfa
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200">
            <Crown className="h-3.5 w-3.5" /> Premium Üye
          </div>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-[0_0_28px_rgba(168,85,247,0.35)]">
                <UserRound className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Profil</p>
                <h1 className="mt-2 text-3xl font-black text-white">{profile.name}</h1>
                <p className="text-sm text-slate-300">{profile.username}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-violet-500/10 to-slate-900/40 p-4 text-left">
              <div className="flex items-center gap-2 text-amber-200">
                <Star className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.2em]">Üyelik durumu</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{profile.plan}</p>
              <p className="text-sm text-slate-300">Durum: {profile.status}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Toplam fal", profile.readings],
              ["Favoriler", profile.favorites],
              ["İçerik serisi", `${profile.streak} gün`],
              ["Son okuma", profile.lastReading],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{value}</p>
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
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Konum</span>
                  <span className="font-medium text-white">{profile.location}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Üyelik başlangıcı</span>
                  <span className="font-medium text-white">{profile.memberSince}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <span className="text-slate-400">Yenileme tarihi</span>
                  <span className="font-medium text-white">{profile.renewalDate}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900 to-amber-400/10 p-5">
              <div className="mb-4 flex items-center gap-2 text-amber-200">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-lg font-semibold text-white">Premium avantajlar</h2>
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