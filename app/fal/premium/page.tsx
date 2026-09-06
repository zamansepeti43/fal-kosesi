import Link from "next/link";
import { ArrowRight, Check, Coins, CreditCard, ShieldCheck, Sparkles, Star } from "lucide-react";

const planOptions = [
  { label: "Plus", price: "₺79", note: "Haftalık erişim", highlight: true },
  { label: "Plus", price: "₺199", note: "Aylık erişim", highlight: false },
  { label: "Pro", price: "₺149", note: "Haftalık erişim", highlight: false },
  { label: "Pro", price: "₺349", note: "Aylık erişim", highlight: true },
  { label: "Premium", price: "₺699", note: "Sınırsız üyelik", highlight: true },
] as const;

export default function Premium() {
  return (
    <main className="min-h-screen bg-[#0d0811] px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-[430px]">
        <div className="mb-4 flex items-center justify-between px-1">
          <Link href="/" className="text-sm text-slate-300">← Ana sayfa</Link>
          <Link href="/profil" className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-100">Profilim <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>

        <section className="rounded-[1.6rem] border border-[#d7b56d]/10 bg-[#130d1b]/90 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="mx-auto max-w-[290px] text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.3rem] bg-gradient-to-br from-[#f7d98b] via-[#efc76d] to-[#cb8f41] text-[#180e1d] shadow-[0_12px_30px_rgba(239,198,101,0.25)]"><Sparkles className="h-7 w-7" /></div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#f3d48c]">PREMİUM</p>
            <h1 className="mt-2 text-2xl font-black text-white">Fal deneyimini genişlet</h1>
            <p className="mt-2 text-xs leading-5 text-slate-300">Premium plan seçeneklerini görebilirsin. Gerçek ödeme ve üyelik aktivasyonu hazır olmadan hiçbir planı ücretsizmiş gibi aktif etmiyoruz.</p>
          </div>

          <div className="mt-5 space-y-3">
            {planOptions.map((plan) => (
              <div key={`${plan.label}-${plan.note}`} className={`rounded-[1.4rem] border p-3 ${plan.highlight ? "border-[#f3d48c]/35 bg-[#f3d48c]/10" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-[#f3d48c]">{plan.label}</p><p className="mt-1 text-base font-bold text-white">{plan.note}</p></div><div className="text-right"><div className="text-xl font-black text-white">{plan.price}</div><div className="text-[10px] text-slate-300">plan fiyatı</div></div></div>
                <Link href="/kredi" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-4 py-2.5 text-[11px] font-bold text-[#120d17]">Gerçek ödeme seçeneklerine git <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.3rem] border border-amber-300/20 bg-amber-300/[.06] p-3"><div className="mb-2 flex items-center gap-2 text-[#f3d48c]"><Coins className="h-4 w-4" /><h2 className="text-sm font-semibold text-white">Şu an kullanılabilir sistem</h2></div><p className="text-[11px] leading-5 text-slate-200">Fal okumaları kredi sistemiyle çalışıyor. Kredi mağazasından paket seçtiğinde bakiyen hesabına eklenir ve okumalar otomatik olarak bakiyenden düşer.</p><Link href="/kredi" className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[11px] font-bold text-amber-100">Kredi mağazasını aç <ArrowRight className="h-3.5 w-3.5" /></Link></div>

          <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-[#f3d48c]"><ShieldCheck className="h-4 w-4" /><h2 className="text-sm font-semibold text-white">Güvenli ödeme akışı</h2></div>
            <div className="space-y-2 text-[11px] text-slate-200">{["Hesabın ve kredi bakiyen Neon PostgreSQL'de tutulur", "Ödeme onayı geldiğinde kredi otomatik tanımlanır", "Başarısız okuma için kredi iadesi uygulanır", "Üyelik planları ödeme entegrasyonu tamamlanınca aktive edilecek"].map((step, index) => <div key={step} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/50 px-2.5 py-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15 text-[10px] text-violet-100">{index + 1}</span>{step}</div>)}</div>
          </div>

          <div className="mt-5 rounded-[1.3rem] border border-[#f3d48c]/20 bg-gradient-to-br from-[#f3d48c]/10 via-[#130d1b] to-violet-500/10 p-3"><div className="mb-2 flex items-center gap-2 text-[#f3d48c]"><CreditCard className="h-4 w-4" /><h2 className="text-sm font-semibold text-white">Premium ile hedef</h2></div><div className="space-y-2 text-[11px] text-slate-200">{["Daha geniş fal seçenekleri", "Kişisel profil ve geçmiş takibi", "Favori yorumlarını saklama", "Bildirim ve hesap merkezi"].map((feature) => <div key={feature} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/45 px-2.5 py-2"><Check className="h-3.5 w-3.5 text-emerald-300" />{feature}</div>)}</div></div>

          <div className="mt-5 text-center"><Link href="/kredi" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-6 py-2.5 text-[11px] font-bold text-white shadow-[0_12px_32px_rgba(168,85,247,0.28)]">Krediyle başla <Star className="h-3.5 w-3.5" /></Link></div>
        </section>
      </div>
    </main>
  );
}
