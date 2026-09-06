"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, CheckCheck, Coins, Heart, Sparkles } from "lucide-react";

type Notification = { id: string; title: string; body: string; type: string; read_at: string | null; created_at: string };

const icons: Record<string, typeof Bell> = { reading: Sparkles, purchase: Coins, favorite: Heart, system: Bell };

export default function BildirimlerPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      const data = (await response.json()) as { notifications?: Notification[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Bildirimler alınamadı.");
      setItems(data.notifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bildirimler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const markRead = async (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationId: id }) });
  };

  const markAll = async () => {
    setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
  };

  const unread = items.filter((item) => !item.read_at).length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(109,40,217,.18),transparent_35%),linear-gradient(180deg,#080817,#05050d)] px-4 py-7 text-white md:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between gap-3"><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300"><ArrowLeft className="h-4 w-4"/> Ana sayfa</Link>{unread > 0 && <button type="button" onClick={() => void markAll()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs font-semibold text-slate-200"><CheckCheck className="h-3.5 w-3.5"/> Tümünü okundu işaretle</button>}</header>
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.25em] text-amber-200">Hesap hareketleri</p><h1 className="mt-2 font-serif text-3xl font-black">Bildirimler</h1><p className="mt-2 text-sm text-slate-400">Fal, kredi ve favori işlemlerinin güncellemeleri burada.</p></div>{unread > 0 && <span className="rounded-full bg-amber-300 px-3 py-1.5 text-xs font-black text-slate-950">{unread} yeni</span>}</div>
          {loading ? <div className="py-16 text-center text-sm text-slate-400">Bildirimler yükleniyor...</div> : error ? <div className="py-12 text-center"><p className="text-rose-200">{error}</p><Link href="/giris" className="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950">Giriş yap</Link></div> : items.length === 0 ? <div className="py-16 text-center"><Bell className="mx-auto h-10 w-10 text-slate-600"/><h2 className="mt-4 text-lg font-bold">Henüz bildirimin yok</h2><p className="mt-2 text-sm text-slate-400">Yeni fal, favori veya kredi hareketlerinde burada göreceksin.</p></div> : <div className="mt-7 space-y-2">{items.map((item) => { const Icon = icons[item.type] || Bell; return <button key={item.id} type="button" onClick={() => !item.read_at && void markRead(item.id)} className={`w-full rounded-[20px] border p-4 text-left transition ${item.read_at ? "border-white/[.07] bg-white/[.025]" : "border-amber-300/20 bg-amber-300/[.06]"}`}><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-200"><Icon className="h-5 w-5"/></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{item.title}</strong><small className="shrink-0 text-[10px] text-slate-500">{new Date(item.created_at).toLocaleString("tr-TR")}</small></span><span className="mt-1 block text-xs leading-5 text-slate-300">{item.body}</span></span></div></button>; })}</div>}
        </section>
      </div>
    </main>
  );
}
