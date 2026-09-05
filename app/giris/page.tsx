"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Mail, ShieldCheck, Smartphone, Sparkles, User } from "lucide-react";
import { createMember, getStoredMember, MEMBER_STORAGE_KEY, saveMember } from "@/lib/membership";

export default function GirisPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof createMember> | null>(null);

  useEffect(() => {
    const member = getStoredMember();
    setCurrentUser(member);
    setIsHydrated(true);
  }, []);

  const canOpenProfile = useMemo(() => Boolean(currentUser?.email), [currentUser]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = form.email.trim().toLowerCase();
    if (!cleanEmail) return;

    const member = createMember(form.name, cleanEmail, form.phone);
    saveMember(member);
    setCurrentUser(member);
    window.location.href = "/profil";
  };

  if (!isHydrated) {
    return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  return (
    <main className="min-h-screen px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300">← Ana sayfa</Link>
          {canOpenProfile ? (
            <Link href="/profil" className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              Profilim
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.7)] md:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Üye girişi
            </div>

            <h1 className="text-3xl font-black text-white md:text-5xl">Fal Köşesi’ne giriş yap.</h1>
            <p className="mt-3 max-w-xl text-base text-slate-300">
              Normal üye kaydı oluştur, 1 ücretsiz fal hakkı kazan ve sonrasında haftalık/aylık üyelik seçeneği ile devam et.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Mail, label: "Gmail ile üye ol" },
                { icon: Smartphone, label: "1 ücretsiz fal hakkı" },
                { icon: ShieldCheck, label: "Haftalık ve aylık üyelik seçenekleri" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-950 to-violet-950/40 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-violet-200">Hesap oluştur</p>
                <h2 className="text-xl font-bold">Kayıt ol</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Adınız ve soyadınız</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ayşe Demir"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none ring-0 transition focus:border-violet-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">E-posta adresi</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="ayse@gmail.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Telefon</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+90 555 123 45 67"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 px-5 py-3.5 text-base font-bold text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.35)] transition hover:brightness-110"
              >
                Kaydı tamamla
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-medium">
                <Check className="h-4 w-4" />
                1 ücretsiz fal hakkı verilir. Sonraki okumalar üyelik gerektirir.
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
