"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";
import { createMember, getStoredMember, saveMember } from "@/lib/membership";

export default function GirisPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const member = getStoredMember();
    if (member?.email) {
      setForm((current) => ({ ...current, name: member.name, email: member.email, phone: member.phone }));
    }
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password;

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Geçerli bir e-posta adresi gir.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    if (mode === "register") {
      if (!form.name.trim()) {
        setError("Ad soyad alanını doldur.");
        return;
      }

      const member = createMember(form.name, cleanEmail, form.phone);
      const sessionResponse = await fetch("/api/member/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: member.name,
          phone: member.phone,
        }),
      });

      if (!sessionResponse.ok) {
        const payload = (await sessionResponse.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Hesap oluşturulamadı. Lütfen tekrar dene.");
        return;
      }

      saveMember(member);
      setMessage("Hesabın oluşturuldu. Profiline yönlendiriliyorsun…");
      window.setTimeout(() => {
        window.location.href = "/profil";
      }, 350);
      return;
    }

    const stored = getStoredMember();
    if (!stored || stored.email !== cleanEmail) {
      setError("Bu e-posta ile kayıtlı bir hesap bulunamadı. Önce kayıt ol.");
      return;
    }

    const sessionResponse = await fetch("/api/member/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: stored.email,
        name: stored.name,
        phone: stored.phone,
      }),
    });

    if (!sessionResponse.ok) {
      const payload = (await sessionResponse.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || "Oturum açılamadı. Lütfen tekrar dene.");
      return;
    }

    setMessage("Giriş başarılı. Profiline yönlendiriliyorsun…");
    window.setTimeout(() => {
      window.location.href = "/profil";
    }, 350);
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070714] text-white">
        Yükleniyor...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,58,237,.18),transparent_38%),linear-gradient(180deg,#080817,#05050d)] px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 transition hover:text-white">
            ← Ana sayfa
          </Link>

          <Link
            href="/profil"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-semibold text-slate-200"
          >
            Profilim
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="border-b border-white/10 p-6 md:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Fal Köşesi
            </div>

            <h1 className="text-3xl font-black md:text-4xl">
              {mode === "login" ? "Tekrar hoş geldin." : "Hesabını oluştur."}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {mode === "login"
                ? "Hesabına giriş yap, kredilerini ve fal geçmişini kaldığın yerden kullan."
                : "Kayıt ol, 50 kredi hoş geldin hediyeni al ve fal köşeni kişiselleştir."}
            </p>
          </div>

          <div className="grid grid-cols-2 border-b border-white/10 bg-white/[.025] p-1.5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                mode === "login"
                  ? "bg-amber-300 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Giriş Yap
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setMessage("");
              }}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                mode === "register"
                  ? "bg-amber-300 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <div className="p-6 md:p-8">
            {mode === "login" ? (
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Mail, text: "E-posta hesabın" },
                  { icon: LockKeyhole, text: "Güvenli oturum" },
                  { icon: ShieldCheck, text: "Hesap verilerin" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2.5 text-xs text-slate-300"
                  >
                    <Icon className="h-4 w-4 text-violet-200" />
                    {text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Mail, text: "E-posta ile kayıt" },
                  { icon: Smartphone, text: "50 kredi hediye" },
                  { icon: ShieldCheck, text: "Hesabını güvenle kullan" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2.5 text-xs text-slate-300"
                  >
                    <Icon className="h-4 w-4 text-violet-200" />
                    {text}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Adınız ve soyadınız</span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      required
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Ayşe Demir"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">E-posta adresi</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="ornek@gmail.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                  />
                </div>
              </label>

              {mode === "register" ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Telefon</span>
                  <div className="relative">
                    <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={form.phone}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                      placeholder="+90 555 123 45 67"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Şifre</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="En az 6 karakter"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-white"
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {mode === "login" ? (
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Şifreni hatırlıyor musun?</span>
                  <span className="text-violet-300">Yakında: şifre sıfırlama</span>
                </div>
              ) : null}

              {error ? (
                <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}

              {message ? (
                <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 px-5 py-3.5 text-base font-bold text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.25)] transition hover:brightness-110"
              >
                {mode === "login" ? "Giriş Yap" : "Kaydı Tamamla"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {mode === "register" ? (
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4" />
                  Hesabına 50 kredi tanımlanır. Kredilerin bittiğinde yeni paket alabilirsin.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
