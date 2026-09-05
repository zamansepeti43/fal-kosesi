"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Star } from "lucide-react";

const ZODIAC_SIGNS = [
  { id: "aries", name: "Koç", dateRange: "21 Mart - 19 Nisan" },
  { id: "taurus", name: "Boğa", dateRange: "20 Nisan - 20 Mayıs" },
  { id: "gemini", name: "İkizler", dateRange: "21 Mayıs - 20 Haziran" },
  { id: "cancer", name: "Yengeç", dateRange: "21 Haziran - 22 Temmuz" },
  { id: "leo", name: "Aslan", dateRange: "23 Temmuz - 22 Ağustos" },
  { id: "virgo", name: "Başak", dateRange: "23 Ağustos - 22 Eylül" },
  { id: "libra", name: "Terazi", dateRange: "23 Eylül - 22 Ekim" },
  { id: "scorpio", name: "Akrep", dateRange: "23 Ekim - 21 Kasım" },
  { id: "sagittarius", name: "Yay", dateRange: "22 Kasım - 21 Aralık" },
  { id: "capricorn", name: "Oğlak", dateRange: "22 Aralık - 19 Ocak" },
  { id: "aquarius", name: "Kova", dateRange: "20 Ocak - 18 Şubat" },
  { id: "pisces", name: "Balık", dateRange: "19 Şubat - 20 Mart" },
] as const;

type ZodiacId = (typeof ZODIAC_SIGNS)[number]["id"];

type ZodiacReading = {
  love: string;
  money: string;
  career: string;
  energy: string;
};

const ZODIAC_READINGS: Record<ZodiacId, ZodiacReading> = {
  aries: { love: "Duygularınız açıksa, romantik temaslar bekleniyor.", money: "Riskli ama kazançlı bir fırsat yaklaşıyor.", career: "Liderlik ve kararlılık ön plana çıkıyor.", energy: "Güçlü ve hareketli bir gün." },
  taurus: { love: "Güven ve sıcaklık artıyor; sağlıklı bir bağ güçleniyor.", money: "Tasarruf ve düzenli gelir daha anlamlı hale geliyor.", career: "İstikrar ve uzun vadeli hedefler öne çıkıyor.", energy: "Sakin ve dengeli bir enerji." },
  gemini: { love: "Konuşma ve karşılıklı anlama artıyor.", money: "Fikirler ve iletişim üzerinden gelir kapısı açılabilir.", career: "Yenilikçi fikirler dikkate alınacak.", energy: "Hızlı düşünme ve hareket için uygun bir dönem." },
  cancer: { love: "Ailevi ve duygusal bağlar güçleniyor; samimi temaslar öne çıkıyor.", money: "Güvenli finansal adımlar daha verimli sonuç verir.", career: "Ekibinize yakın kalmak ve destek vermek işinize yarar.", energy: "Koruyucu ve duygusal bir enerji." },
  leo: { love: "Aşk hayatında görünürlük ve sıcaklık artıyor.", money: "Görünmeyen fırsatları fark edip cesur adım atın.", career: "Yaratıcılık ve özgüven öne çıkıyor.", energy: "Parlak ve motive edici bir gün." },
  virgo: { love: "Duygusal detaylar önem kazanıyor; açık iletişim çok değerli.", money: "Planlı harcamalardan kazanç ve düzen gelir.", career: "Mücadeleler düzen ve verimlilikle çözülebilir.", energy: "Özenli ve stratejik bir akış." },
  libra: { love: "Denge ve güzellik ön planda; ilişkilerden tatmin bekleniyor.", money: "Adil çözümler ve iş birlikleri iyi sonuç getirebilir.", career: "İş birlikleri ve ortaklıklar sizin için avantajlı.", energy: "Uyumlu ve sanatsal bir enerji." },
  scorpio: { love: "Derinlikler ve güçlü bağlar öne çıkıyor.", money: "Yatırım kararları duygusal değil, mantıklı şekilde alınmalı.", career: "Güçlü bir değişim ya da stratejik hamle sizi ileri taşıyabilir.", energy: "Yoğun ve güçlü bir dönemdeyiz." },
  sagittarius: { love: "Serbestlik ve keyif artıyor; yeni tanışmalar mümkün.", money: "Yurtdışı/öğrenme/seyahat temalı gelir fırsatı olabilir.", career: "Yeni bir perspektif veya görev belirleyici olur.", energy: "Serbest ve coşkulu bir akış." },
  capricorn: { love: "İlişkilerde güven ve sorumluluk öne çıkıyor.", money: "Dürüst ve sabırlı adımlar size maddi kazanım sağlar.", career: "Mevcut emeğin karşılığı yakında netleşecek.", energy: "Sakin ama sağlam bir enerji." },
  aquarius: { love: "Bağımsızlık ve özgün ifade önemli hale geliyor.", money: "Yeni fikirler ve farklı bakış açısı para getirir.", career: "İnovasyon ve öngörü güçlü bir avantaj sunuyor.", energy: "Yaratıcı ve sıra dışı bir gün." },
  pisces: { love: "Sezgiler güçlü; kırılgan ama anlamlı bağlar kurulabilir.", money: "İçgüdüleriniz finansal kararlarında yardımcı olabilir.", career: "Sanat, iletişim ya da ruhsal alanı tercih etmek işinize yarar.", energy: "Rüya gibi ama anlamlı bir akış." },
};

export default function YildiznameClient() {
  const [selectedSign, setSelectedSign] = useState<ZodiacId>("aries");
  const [showReading, setShowReading] = useState(false);

  const getZodiacReading = (sign: ZodiacId): ZodiacReading => ZODIAC_READINGS[sign] ?? ZODIAC_READINGS.aries;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-300">← Ana sayfa</Link>
          <h1 className="text-2xl font-bold text-white">Yıldızname / Burç</h1>
        </header>

        {!showReading ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-amber-300 text-slate-950">
                <Star className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Burcunu seç, enerjini oku</h2>
                <p className="text-slate-300">Bugün, aşk, para ve kariyer alanında gökyüzünün sana ne söylediğini öğren.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC_SIGNS.map((sign) => (
                <label
                  key={sign.id}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selectedSign === sign.id ? "border-amber-400/80 bg-amber-400/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="sign"
                    value={sign.id}
                    checked={selectedSign === sign.id}
                    onChange={(e) => setSelectedSign(e.target.value as ZodiacId)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{sign.name}</h3>
                      <p className="text-xs text-slate-400">{sign.dateRange}</p>
                    </div>
                    <Star className="h-4 w-4 text-amber-200" />
                  </div>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowReading(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-400 via-purple-400 to-amber-300 px-6 py-3.5 font-bold text-slate-950"
            >
              <Sparkles size={18} />
              Burçumu Öğren
            </button>
          </section>
        ) : (
          <section className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold text-white">
              {ZODIAC_SIGNS.find((sign) => sign.id === selectedSign)?.name} burcu
            </h2>

            <div className="grid gap-4">
              {[
                ["❤️ Aşk", getZodiacReading(selectedSign).love],
                ["💰 Para", getZodiacReading(selectedSign).money],
                ["💼 Kariyer", getZodiacReading(selectedSign).career],
                ["✨ Günün Enerjisi", getZodiacReading(selectedSign).energy],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                  <p className="text-slate-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReading(false)}
                className="rounded-full border border-white/10 px-5 py-2.5 text-slate-200"
              >
                Başka burç
              </button>
              <Link href="/" className="rounded-full bg-violet-500/15 px-5 py-2.5 font-medium text-violet-200">
                Ana sayfa
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
