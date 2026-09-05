import Link from "next/link";
import { Bell, Briefcase, Coffee, Heart, Menu, MoonStar, UserRound, Wallet, WandSparkles } from "lucide-react";

const quickItems = [
  { label: "Kahve Falı", href: "/fal/upload", icon: Coffee },
  { label: "Tarot", href: "/fal/tarot", icon: WandSparkles },
  { label: "Aşk Falı", href: "/fal/ask", icon: Heart },
  { label: "Para Falı", href: "/fal/para", icon: Wallet },
  { label: "Günlük Fal", href: "/fal/gunluk", icon: MoonStar },
  { label: "Kariyer", href: "/fal/kariyer", icon: Briefcase },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0810] px-4 py-5 text-white md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">
        <header className="mb-8 flex items-center justify-between rounded-full border border-[#d7b56d]/10 bg-[#120d1b]/70 px-4 py-3 shadow-[0_18px_45px_rgba(10,8,16,0.5)] backdrop-blur-sm md:px-6 lg:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b56d]/20 bg-[#f3d58a]/10 text-[#f4d58a]">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="text-lg font-black tracking-[0.18em] text-[#f4d58a] md:text-xl">
              FAL <span className="text-white">KÖŞESİ</span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-[15px] text-[#f3e6c5] lg:flex">
            <Link href="/fal/upload" className="transition hover:text-[#f4d58a]">Kahve Falı</Link>
            <Link href="/fal/tarot" className="transition hover:text-[#f4d58a]">Tarot</Link>
            <Link href="/fal/ask" className="transition hover:text-[#f4d58a]">Aşk Falı</Link>
            <Link href="/fal/gunluk" className="transition hover:text-[#f4d58a]">Günlük Fal</Link>
            <Link href="/fal/premium" className="transition hover:text-[#f4d58a]">Üyelik</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b56d]/15 bg-[#ffffff08] text-[#f5d88e] lg:hidden" aria-label="Menü">
              <Menu className="h-4 w-4" />
            </button>
            <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b56d]/15 bg-[#ffffff08] text-[#f5d88e]" aria-label="Bildirimler">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0bb4a]" />
            </button>
            <Link href="/giris" className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-4 py-2.5 text-[11px] font-black tracking-[0.14em] text-[#140d17] shadow-[0_12px_30px_rgba(239,198,101,0.25)] lg:inline-flex">
              <UserRound className="h-4 w-4" />
              GİRİŞ YAP
            </Link>
          </div>
        </header>

        <section className="rounded-[2.25rem] border border-[#d7b56d]/10 bg-[radial-gradient(circle_at_top,_rgba(92,68,120,0.18),_transparent_30%),linear-gradient(180deg,_rgba(16,11,22,0.9),_rgba(11,8,16,0.96))] p-5 shadow-[0_28px_80px_rgba(7,5,12,0.58)] backdrop-blur-sm md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-10">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#d7b56d]/15 bg-[#f5d790]/6 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.26em] text-[#f4d58a]">
                <Coffee className="h-3.5 w-3.5" />
                Yapay zekâ destekli kahve falı
              </div>

              <h1 className="max-w-[680px] text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white md:text-6xl lg:text-[72px]">
                Fincanını getir.
                <span className="mt-2 block text-[#f4d58a]">Falını keşfet.</span>
              </h1>

              <p className="mt-5 max-w-[620px] text-base leading-8 text-[#d8d0de] md:text-[18px]">
                Kahve izlerinden aşkını, şansını ve hayatındaki gelişmeleri keşfet. Fal Köşesi, fincanındaki şekilleri yorumlayıp sana özel bir okuma hazırlar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/fal/upload" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f7d98b] via-[#efc76d] to-[#cb8f41] px-6 py-3.5 text-[15px] font-black uppercase tracking-[0.12em] text-[#140d17] shadow-[0_16px_35px_rgba(239,198,101,0.26)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(239,198,101,0.32)] active:translate-y-[0px]">
                  Falını Gönder
                </Link>
                <Link href="/fal/tarot" className="inline-flex items-center justify-center rounded-full border border-[#d7b56d]/20 bg-[#ffffff08] px-6 py-3.5 text-[15px] font-semibold text-[#f4e7c9] transition hover:border-[#d7b56d]/35 hover:bg-[#ffffff10]">
                  Tarotu Keşfet
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "1 ücretsiz fal", value: "Başlangıç" },
                  { label: "Plus / Pro / Premium", value: "Üyelik" },
                  { label: "Hızlı analiz", value: "Anlık" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.1rem] border border-[#d7b56d]/10 bg-[#ffffff04] p-3.5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#f4d58a]">{item.value}</div>
                    <div className="mt-2 text-sm font-semibold text-[#f5ecd4]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-[560px] overflow-hidden rounded-[2.1rem] bg-[radial-gradient(circle_at_50%_18%,_rgba(142,104,163,0.24),_transparent_28%),radial-gradient(circle_at_50%_100%,_rgba(95,62,32,0.14),_transparent_42%)] px-2 py-2 md:px-4 md:py-4">
                <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(95,62,32,0.20),_rgba(16,8,22,0.75)_50%,_rgba(11,8,16,1)_100%)] md:h-[380px]">
                  <div className="absolute left-8 top-8 h-14 w-14 rounded-full border border-[#f1d48a]/30 bg-[#f7d98d]/8" />
                  <div className="absolute left-10 top-12 text-[1.5rem] text-[#f3d47a]">✦</div>
                  <div className="absolute right-12 top-16 text-[1.4rem] text-[#f3d47a] opacity-80">✦</div>
                  <div className="absolute right-20 top-24 text-[1.8rem] text-[#f3d47a] opacity-60">☾</div>

                  <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.18),_transparent_62%)] blur-2xl" />

                  <div className="absolute left-[24%] top-[20%] h-20 w-10 rounded-full border-[2px] border-[#f1d48a]/30 border-b-0 opacity-80" style={{ transform: "rotate(-18deg)" }} />
                  <div className="absolute left-[42%] top-[18%] h-24 w-12 rounded-full border-[2px] border-[#f1d48a]/30 border-b-0 opacity-80" style={{ transform: "rotate(14deg)" }} />
                  <div className="absolute left-[58%] top-[20%] h-20 w-10 rounded-full border-[2px] border-[#f1d48a]/30 border-b-0 opacity-80" style={{ transform: "rotate(22deg)" }} />

                  <div className="relative flex h-[250px] w-[250px] items-center justify-center md:h-[300px] md:w-[300px]">
                    <div className="absolute bottom-[8%] left-1/2 h-8 w-44 -translate-x-1/2 rounded-[999px] border border-[#d7b56d]/10 bg-[#1a1120]/80 shadow-[0_0_30px_rgba(243,203,110,0.08)]" />

                    <div className="absolute bottom-[18%] left-1/2 h-[120px] w-[160px] -translate-x-1/2 rounded-[42%_42%_46%_54%/42%_42%_58%_58%] border-[3px] border-[#f1d48a]/30 bg-[linear-gradient(180deg,_rgba(82,50,34,0.95),_rgba(32,18,17,0.98)_30%,_rgba(18,12,16,0.95)_100%)] shadow-[0_18px_35px_rgba(17,9,13,0.6)]">
                      <div className="absolute inset-x-[16%] bottom-[14%] h-[44px] rounded-[50%] bg-[radial-gradient(circle_at_50%_30%,_#8e4d22_0%,_#4a2414_38%,_#2a120d_100%)] opacity-90" />
                      <div className="absolute inset-x-[16%] top-[18%] h-[46px] rounded-[50%] bg-[radial-gradient(circle_at_50%_30%,_rgba(255,224,172,0.28),_transparent_62%)]" />
                    </div>

                    <div className="absolute bottom-[26%] left-1/2 h-16 w-[120px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,_rgba(255,210,127,0.25),_rgba(41,24,17,0.15)_58%,_transparent_100%)] blur-md" />

                    <div className="absolute left-[38%] top-[28%] h-8 w-8 rounded-full bg-[#f8e8b4]/70 blur-sm" />
                    <div className="absolute right-[34%] top-[32%] h-6 w-6 rounded-full bg-[#f8e8b4]/60 blur-sm" />
                    <div className="absolute left-[30%] top-[38%] h-4 w-4 rounded-full bg-[#f1d48a]/80" />
                    <div className="absolute right-[30%] top-[38%] h-4 w-4 rounded-full bg-[#f1d48a]/80" />

                    <div className="absolute left-[50%] top-[18%] h-24 w-12 -translate-x-1/2 rounded-full border-[2px] border-[#f1d48a]/35 border-b-0 opacity-80" style={{ transform: "translateX(-50%) rotate(-12deg)" }} />
                    <div className="absolute left-[46%] top-[10%] h-28 w-14 -translate-x-1/2 rounded-full border-[2px] border-[#f1d48a]/25 border-b-0 opacity-70" style={{ transform: "translateX(-50%) rotate(8deg)" }} />
                    <div className="absolute left-[54%] top-[12%] h-24 w-12 -translate-x-1/2 rounded-full border-[2px] border-[#f1d48a]/25 border-b-0 opacity-70" style={{ transform: "translateX(-50%) rotate(20deg)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 pb-6 md:mt-14">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#f4d58a]">Keşfet</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white md:text-4xl">Falını keşfet</h2>
            </div>
            <Link href="/fal/premium" className="hidden rounded-full border border-[#d7b56d]/20 bg-[#ffffff05] px-4 py-2 text-sm text-[#f6e8c8] hover:border-[#d7b56d]/35 md:inline-flex">
              Premium üyelik
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {quickItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-[1.4rem] border border-[#d7b56d]/10 bg-[#120d1b]/80 p-4 text-left transition hover:-translate-y-1 hover:border-[#d7b56d]/25 hover:bg-[#1a1323]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-gradient-to-br from-[#f5d790] to-[#d7a64f] text-[#140d17] shadow-[0_10px_25px_rgba(244,213,138,0.2)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-bold text-white">{label}</p>
                <p className="mt-2 text-sm text-[#c8bfcf]">İçerik ve yorum için tıkla</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

