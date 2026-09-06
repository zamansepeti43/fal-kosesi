"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Coffee,
  Coins,
  Crown,
  Coins,
  Heart,
  History,
  Home as HomeIcon,
  Menu,
  MessageCircle,
  Moon,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

const discoveries = [
  { title: "Tarot", subtitle: "Kartların bugün ne söylüyor?", href: "/fal/tarot", image: "/fortune/tarot-spread.jpg" },
  { title: "Aşk Falı", subtitle: "Kalbindeki sorulara ışık tut.", href: "/fal/ask", image: "/fortune/love-reading.jpg" },
  { title: "Para & Bolluk", subtitle: "Maddi enerjini keşfet.", href: "/fal/para", image: "/fortune/money-abundance.jpg" },
  { title: "Kariyer", subtitle: "İş ve hedeflerin için açılım.", href: "/fal/kariyer", image: "/fortune/career-success.jpg" },
  { title: "Günlük Fal", subtitle: "Bugünün enerjisini keşfet.", href: "/fal/gunluk", image: "/fortune/daily-sunrise.jpg" },
  { title: "Doğum Haritam", subtitle: "Kendini gökyüzünde tanı.", href: "/fal/burc", image: "/fortune/birth-chart.jpg" },
  { title: "Rüya Yorumu", subtitle: "Rüyalarının sembollerini çöz.", href: "/fal/ruya", image: "/fortune/dream-sleep.jpg" },
  { title: "Numeroloji", subtitle: "Sayıların sana ne söylüyor?", href: "/fal/focus", image: "/fortune/numerology-number.jpg" },
];

const drawerItems = [
  ["Kahve Falı", "/fal/upload", Coffee],
  ["Tarot", "/fal/tarot", Sparkles],
  ["Aşk Falı", "/fal/ask", Heart],
  ["Para & Bolluk", "/fal/para", WalletCards],
  ["Kariyer", "/fal/kariyer", BriefcaseBusiness],
  ["Günlük Fal", "/fal/gunluk", Moon],
  ["Doğum Haritam", "/fal/burc", Star],
  ["Kredi Mağazası", "/kredi", Coins],
  ["Giriş Yap / Kayıt Ol", "/giris", UserRound],
] as const;

const bottomItems = [
  ["Ana Sayfa", "/", HomeIcon],
  ["Fal Geçmişim", "/fal/gecmis", History],
  ["Favorilerim", "/favoriler", Heart],
  ["Falcıya Sor", "/fal/ask", MessageCircle],
  ["Premium", "/fal/premium", Crown],
] as const;

export default function Home() {
  const [name, setName] = useState("Dostum");
  const [menuOpen, setMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("fal-kosesi-profile");
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { name?: string };
      if (profile.name?.trim()) setName(profile.name.trim());
    } catch {
      // Keep the neutral fallback greeting if the saved profile is malformed.
    }
  }, []);

  useEffect(() => {
    fetch("/api/credits", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { credits?: number };
        setCredits(Number(data.credits ?? 0));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/credits", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { credits?: number };
        setCredits(Number(data.credits ?? 0));
      })
      .catch(() => undefined);
  }, []);

  const firstName = name.split(" ")[0] || "Dostum";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070714] pb-[78px] text-white selection:bg-[#e7bd68] selection:text-[#160f1b]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(107,61,151,.20),transparent_28%),radial-gradient(circle_at_100%_20%,rgba(201,118,72,.10),transparent_24%),linear-gradient(180deg,#0b0a1b_0%,#070714_55%,#05050d_100%)]" />
      <header className="sticky top-0 z-40 border-b border-white/[.06] bg-[#080817]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[56px] max-w-[1024px] items-center justify-between px-3 sm:h-[64px] sm:px-5">
          <button type="button" onClick={() => setMenuOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[.035] text-[#f5d78e] sm:h-10 sm:w-10" aria-label="Menüyü aç"><Menu className="h-[18px] w-[18px]" /></button>
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full border border-[#f0cf80]/30 bg-[#f0cf80]/10 sm:h-9 sm:w-9"><Moon className="h-4 w-4 fill-[#f6d98f] text-[#f6d98f] sm:h-[18px] sm:w-[18px]" /></div>
            <div className="leading-none"><div className="font-serif text-[16px] font-bold tracking-tight text-[#f6dda2] sm:text-[18px]">Fal Köşesi</div><div className="mt-1 text-[7px] uppercase tracking-[.22em] text-[#aaa1bd] sm:text-[8px]">Kaderini keşfet</div></div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/kredi" className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1.5 text-[9px] font-black text-amber-100 sm:px-3 sm:text-[10px]"><Coins className="h-3.5 w-3.5" /> {credits === null ? "—" : credits}</Link>
            <Link href="/bildirimler" className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[.035] text-[#f5d78e] sm:h-10 sm:w-10" aria-label="Bildirimler"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f2b84b] shadow-[0_0_8px_#f2b84b]" /></Link>
            <Link href="/profil" className="flex items-center gap-1.5 rounded-full border border-[#f0cf80]/15 bg-white/[.035] py-1 pl-1 pr-2 sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#f4d998] to-[#93602f] text-[#1a1020] sm:h-8 sm:w-8"><UserRound className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></div><span className="max-w-[58px] truncate text-[10px] font-semibold text-[#eee5d5] sm:max-w-[80px] sm:text-xs">{firstName}</span></Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1024px] px-3 sm:px-5">
        <section className="relative mt-2.5 overflow-hidden rounded-[20px] border border-[#d7b56d]/15 shadow-[0_18px_55px_rgba(0,0,0,.38)] sm:mt-4 sm:rounded-[28px]">
          <Image src="/fortune/coffee-reading.jpg" alt="Fal Köşesi mistik kahve falı" fill priority sizes="(max-width: 768px) 100vw, 1024px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090918]/96 via-[#0b0919]/74 to-[#0b0919]/18" />
          <div className="relative min-h-[220px] px-4 py-6 sm:min-h-[300px] sm:px-8 sm:py-9 md:min-h-[330px] md:px-10"><div className="max-w-[510px]"><div className="inline-flex items-center gap-1.5 rounded-full border border-[#f5d88e]/20 bg-black/20 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.20em] text-[#f5d88e] backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[9px]"><Sparkles className="h-3 w-3" /> Sana özel fal köşen</div><h1 className="mt-3 font-serif text-[27px] font-bold leading-none tracking-[-.035em] text-white sm:mt-4 sm:text-[38px] md:text-[44px]">Merhaba {firstName} <span className="text-[#f5d78e]">✦</span></h1><p className="mt-2 text-[12px] leading-5 text-[#d9d1e1] sm:mt-3 sm:text-base sm:leading-6">Bugün senin için neler söylüyor?</p><p className="mt-1 font-serif text-[11px] italic text-[#c8b9d6] sm:mt-2 sm:text-sm">“Her fincan, yeni bir hikâye anlatır…”</p></div></div>
        </section>
        <section className="relative mt-2.5 overflow-hidden rounded-[20px] border border-[#a56fff]/25 bg-[#17132b]/95 p-2.5 shadow-[0_18px_50px_rgba(0,0,0,.30)] sm:mt-4 sm:rounded-[24px] sm:p-3"><div className="grid grid-cols-[31%_69%] gap-2.5 sm:grid-cols-[25%_1fr] sm:gap-4 md:grid-cols-[210px_1fr_220px] md:items-center"><div className="relative h-[135px] overflow-hidden rounded-[16px] bg-[#0d0a18] sm:h-[170px] md:h-[180px]"><Image src="/fortune/coffee-reading.jpg" alt="Kahve falı" fill sizes="220px" className="object-cover object-[70%_65%]" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b0815] via-transparent to-transparent" /><div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[7px] font-semibold text-[#f6d98e] backdrop-blur-md sm:text-[9px]">KAHVE FALI</div></div><div className="min-w-0 px-0.5 sm:px-1 md:px-2"><div className="flex items-center gap-1.5 text-[#f6d98e]"><Coffee className="h-3.5 w-3.5 sm:h-4 sm:w-4" /><span className="text-[8px] font-bold uppercase tracking-[.18em] sm:text-[10px]">Kahve Falı</span></div><h2 className="mt-1 font-serif text-[17px] font-bold leading-[1.12] text-white sm:text-2xl md:text-3xl">Fincanını gönder, sembollerini keşfet.</h2><p className="mt-1 hidden text-xs leading-5 text-[#bdb4c9] sm:block">Fincan ve tabak fotoğrafını yükle. Sana özel, detaylı ve sıcak bir yorum hazırlayalım.</p><Link href="/fal/upload" className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#f6d88e] via-[#efbd69] to-[#c76e9a] px-4 py-2 text-[10px] font-black text-[#1b1020] shadow-[0_8px_20px_rgba(236,178,107,.20)] sm:mt-3 sm:px-5 sm:py-2.5 sm:text-xs">Falımı Yorumla <ChevronRight className="h-3.5 w-3.5" /></Link></div><div className="col-span-2 grid grid-cols-2 gap-1.5 md:col-span-1 md:grid-cols-1 md:gap-2"><Link href="/fal/upload" className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[.045] p-2 sm:gap-3 sm:rounded-2xl sm:p-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f3d48b]/10 text-[#f3d48b] sm:h-9 sm:w-9 sm:rounded-xl"><Coffee className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span><span className="min-w-0"><b className="block truncate text-[9px] sm:text-xs">Fincan Fotoğrafı</b><small className="hidden text-[9px] text-[#aaa1bb] sm:block">Yüklemeye hazır</small></span></Link><Link href="/fal/upload" className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[.045] p-2 sm:gap-3 sm:rounded-2xl sm:p-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#a875ff]/10 text-[#bd92ff] sm:h-9 sm:w-9 sm:rounded-xl"><Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span><span className="min-w-0"><b className="block truncate text-[9px] sm:text-xs">Tabak Fotoğrafı</b><small className="hidden text-[9px] text-[#aaa1bb] sm:block">Daha detaylı analiz</small></span></Link></div></div></section>
        <section className="mt-5 sm:mt-8"><div className="mb-2.5 flex items-end justify-between sm:mb-4"><div><p className="text-[8px] font-bold uppercase tracking-[.25em] text-[#f0c978] sm:text-[10px]">✦ keşfet</p><h2 className="mt-0.5 font-serif text-[21px] font-bold tracking-tight sm:text-3xl">Keşfet</h2></div><Link href="/fal/burc" className="flex items-center gap-0.5 text-[10px] font-semibold text-[#d7cce1] sm:text-sm">Tümünü Gör <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Link></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">{discoveries.map((item)=><Link key={item.title} href={item.href} className="group overflow-hidden rounded-[15px] border border-white/[.09] bg-[#111022] shadow-[0_8px_24px_rgba(0,0,0,.22)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d5a6ff]/35 sm:rounded-[18px]"><div className="relative aspect-[1.42] overflow-hidden"><Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#111022] via-transparent to-transparent opacity-90" /></div><div className="relative -mt-5 px-2.5 pb-2.5 sm:-mt-7 sm:px-3.5 sm:pb-3.5"><h3 className="font-serif text-[13px] font-bold leading-tight text-white sm:text-lg">{item.title}</h3><p className="mt-0.5 line-clamp-2 text-[9px] leading-3.5 text-[#bcb3c9] sm:mt-1 sm:text-xs sm:leading-5">{item.subtitle}</p></div></Link>)}</div></section>
        <Link href="/fal/premium" className="group mt-4 flex items-center gap-2.5 overflow-hidden rounded-[17px] border border-[#e8c86f]/40 bg-[radial-gradient(circle_at_0%_50%,rgba(242,193,93,.25),transparent_35%),linear-gradient(100deg,#211827,#17121e)] p-3.5 shadow-[0_14px_35px_rgba(0,0,0,.26)] sm:mt-7 sm:gap-4 sm:rounded-[22px] sm:p-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffe49c] to-[#c7863e] text-[#20121b] sm:h-14 sm:w-14 sm:rounded-2xl"><Crown className="h-5 w-5 sm:h-7 sm:w-7" /></div><div className="min-w-0 flex-1"><p className="font-serif text-[13px] font-bold sm:text-xl">Premium ile daha fazlasını keşfet</p><p className="mt-0.5 line-clamp-1 text-[9px] leading-4 text-[#bfb3c4] sm:mt-1 sm:text-sm">Sınırsız fal, detaylı yorumlar ve kişiselleştirilmiş içerikler seni bekliyor.</p></div><span className="hidden shrink-0 items-center gap-1 rounded-full bg-[#f4d18b] px-5 py-2.5 text-sm font-black text-[#24161c] sm:inline-flex">Premium’a Geç <ChevronRight className="h-4 w-4" /></span><ChevronRight className="h-4 w-4 shrink-0 text-[#f4d18b] sm:hidden" /></Link>
        <section className="mt-5 sm:mt-8"><div className="mb-2.5 flex items-end justify-between sm:mb-4"><div><p className="text-[8px] font-bold uppercase tracking-[.25em] text-[#a9a0b9] sm:text-[10px]">geçmiş</p><h2 className="mt-0.5 font-serif text-[21px] font-bold sm:text-2xl">Son Falın</h2></div><Link href="/fal/gecmis" className="flex items-center gap-0.5 text-[10px] text-[#c9bfd2] sm:text-sm">Tüm Geçmişim <ChevronRight className="h-3.5 w-3.5 sm:h-4 w-4" /></Link></div><div className="flex items-center gap-2.5 rounded-[17px] border border-white/[.09] bg-[#101021]/80 p-2.5 sm:gap-4 sm:rounded-[22px] sm:p-4"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-20 sm:w-20 sm:rounded-2xl"><Image src="/fortune/coffee-reading.jpg" alt="Son kahve falı" fill sizes="80px" className="object-cover object-[70%_70%]" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-1 text-[9px] text-[#e8cf91] sm:gap-2 sm:text-xs"><Coffee className="h-3 w-3 sm:h-4 sm:w-4" /> Kahve Falı <span className="text-[#777184]">• Son falın</span></div><h3 className="mt-0.5 truncate text-[11px] font-semibold sm:mt-1 sm:text-sm">Fincanındaki sembollere yeniden bak</h3><p className="mt-0.5 truncate text-[9px] text-[#9890a3] sm:mt-1 sm:text-xs">Falını aç ve Falcıya Sor ile devam et.</p></div><Link href="/fal/gecmis" className="hidden shrink-0 items-center gap-1 rounded-full border border-[#a86cff]/45 px-4 py-2.5 text-xs font-bold text-[#d4b8ff] sm:flex">Yorumu Gör <ChevronRight className="h-4 w-4" /></Link></div></section>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[.08] bg-[#090918]/96 px-1 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-2xl"><div className="mx-auto grid max-w-[720px] grid-cols-5">{bottomItems.map(([label,href,Icon],index)=><Link key={label} href={href} className={`flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-xl ${index===0?"bg-[#f4d18b]/[.10] text-[#f4d68e]":"text-[#9f97ae]"}`}><Icon className="h-[18px] w-[18px]" /><span className="text-[8px] font-semibold sm:text-[10px]">{label}</span></Link>)}</div></nav>
      {menuOpen && <div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}><aside className="h-full w-[84%] max-w-[340px] border-r border-white/10 bg-[#0c0b1b] p-4 shadow-[30px_0_90px_rgba(0,0,0,.5)] sm:p-5" onClick={event=>event.stopPropagation()}><div className="flex items-center justify-between"><div className="font-serif text-xl font-bold text-[#f4d68e] sm:text-2xl">Fal Köşesi</div><button type="button" onClick={()=>setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.05]"><X className="h-4 w-4" /></button></div><p className="mt-1.5 text-xs text-[#9991a8] sm:text-sm">Merhaba {firstName}, hangi keşfe çıkıyoruz?</p><div className="mt-5 grid gap-1.5 sm:mt-7 sm:gap-2">{drawerItems.map(([label,href,Icon])=><Link key={label} href={href} onClick={()=>setMenuOpen(false)} className="flex items-center gap-2.5 rounded-xl border border-white/[.06] bg-white/[.03] p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1d38b]/10 text-[#f1d38b] sm:h-10 sm:w-10 sm:rounded-xl"><Icon className="h-4 w-4 sm:h-5 sm:w-5" /></span><span className="text-sm font-semibold sm:text-base">{label}</span><ChevronRight className="ml-auto h-3.5 w-3.5 text-[#746d7e] sm:h-4 sm:w-4" /></Link>)}</div><Link href="/fal/premium" onClick={()=>setMenuOpen(false)} className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#e9c66d]/35 bg-[#e9c66d]/10 p-3 text-sm text-[#f5d992] sm:mt-6 sm:gap-3 sm:rounded-2xl sm:p-4"><Crown className="h-4 w-4 sm:h-5 sm:w-5" /><span className="font-bold">Premium’u Keşfet</span></Link></aside></div>}
    </main>
  );
}
