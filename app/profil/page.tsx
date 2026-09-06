"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Coins, Crown, Mail, Pencil, Sparkles, Star, UserRound } from "lucide-react";

type Profile = {
  email: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  plan: string;
  status: string;
  member_since: string | null;
  renewal_date: string | null;
  readings: number;
  favorites: number;
  streak: number;
  last_reading: string;
  credits: number;
};

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const data = (await response.json()) as { profile?: Profile; error?: string };
      if (!response.ok || !data.profile) throw new Error(data.error || "Profil alınamadı.");
      setProfile(data.profile);
      setForm({ name: data.profile.full_name || "", phone: data.profile.phone || "", location: data.profile.location || "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadProfile(); }, []);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { profile?: Profile; error?: string };
      if (!response.ok || !data.profile) throw new Error(data.error || "Profil güncellenemedi.");
      setProfile(data.profile);
      setForm({ name: data.profile.full_name || "", phone: data.profile.phone || "", location: data.profile.location || "" });
      setEditing(false);
      setMessage("Profil bilgilerin kaydedildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center bg-[#070714] text-white">Profil yükleniyor...</main>;

  if (error && !profile) {
    return <main className="min-h-screen bg-[#070714] px-4 py-10 text-white"><div className="mx-auto max-w-xl rounded-3xl border border-rose-400/20 bg-rose-400/5 p-6 text-center"><p className="text-rose-100">{error}</p><Link href="/giris" className="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950">Giriş yap</Link></div></main>;
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.18),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 py-7 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300"><ArrowLeft className="h-4 w-4" /> Ana sayfa</Link>
          <Link href="/fal/premium" className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-100"><Crown className="h-3.5 w-3.5" /> Üyelik planı</Link>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-[0_0_28px_rgba(168,85,247,0.35)]"><UserRound className="h-9 w-9 text-white" /></div>
              <div><p className="text-sm uppercase tracking-[0.22em] text-violet-200">Profil</p><h1 className="mt-2 text-3xl font-black text-white">{profile.full_name || "Üye"}</h1><p className="text-sm text-slate-300">{profile.email}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/favoriler" className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-semibold text-slate-200">♡ {profile.favorites} Favori</Link>
              <Link href="/fal/gecmis" className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-semibold text-slate-200">Geçmişimi Gör</Link>
              <button type="button" onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100"><Pencil className="h-3.5 w-3.5" /> {editing ? "Vazgeç" : "Düzenle"}</button>
            </div>
          </div>

          {message && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
          {error && <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</p>}

          {editing ? (
            <form onSubmit={saveProfile} className="mt-7 grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/[.035] p-5 md:grid-cols-3">
              {[["name", "Ad soyad", "text"], ["phone", "Telefon", "tel"], ["location", "Konum", "text"]].map(([key, label, type]) => <label key={key} className="block"><span className="mb-2 block text-xs text-slate-400">{label}</span><input type={type} value={form[key as keyof typeof form]} onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-violet-400" /></label>)}
              <div className="md:col-span-3"><button disabled={saving} className="rounded-full bg-amber-300 px-6 py-3 text-sm font-black text-slate-950 disabled:opacity-60">{saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button></div>
            </form>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[["Toplam fal", profile.readings], ["Favori", profile.favorites], ["Seri", `${profile.streak} gün`], ["Kredi", profile.credits]].map(([label, value]) => <div key={String(label)} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">{String(label)}</p><p className="mt-3 flex items-center gap-2 text-2xl font-bold text-white">{label === "Kredi" && <Coins className="h-5 w-5 text-amber-300" />}{String(value)}</p></div>)}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-2 text-amber-200"><UserRound className="h-4 w-4" /><h2 className="text-lg font-semibold text-white">Kişisel bilgiler</h2></div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">E-posta</span><span className="flex items-center gap-2 font-medium text-white"><Mail className="h-4 w-4 text-violet-200" />{profile.email}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">Telefon</span><span className="font-medium text-white">{profile.phone || "Belirtilmedi"}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">Konum</span><span className="font-medium text-white">{profile.location || "Belirtilmedi"}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">Üyelik başlangıcı</span><span className="font-medium text-white">{profile.member_since || "-"}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">Plan</span><span className="font-medium text-white">{profile.plan} · {profile.status}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"><span className="text-slate-400">Son okuma</span><span className="font-medium text-white">{profile.last_reading}</span></div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900 to-amber-400/10 p-5">
              <div className="mb-4 flex items-center gap-2 text-amber-200"><Sparkles className="h-4 w-4" /><h2 className="text-lg font-semibold text-white">Hızlı erişim</h2></div>
              <div className="space-y-3">
                <Link href="/bildirimler" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">Bildirimler <span>→</span></Link>
                <Link href="/favoriler" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">Favorilerim <span>→</span></Link>
                <Link href="/kredi" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">Kredi mağazası <span>→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
