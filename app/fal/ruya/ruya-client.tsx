"use client";

import Link from "next/link";
import { useState } from "react";
import { CloudLightning, MoonStar, Sparkles } from "lucide-react";

type DreamInterpretation = {
  theme: string;
  symbols: string[];
  meaning: string;
  emotional: string;
  message: string;
};

export default function RuyaClient() {
  const [dreamDescription, setDreamDescription] = useState("");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [mockInterpretation, setMockInterpretation] = useState<DreamInterpretation | null>(null);

  const handleInterpretDream = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dreamDescription.trim()) {
      alert("Lütfen rüyanızı açıklayın.");
      return;
    }

    const lowerCaseDream = dreamDescription.toLowerCase();

    let theme = "Kişisel büyüme";
    let symbols = ["Yıldız", "Ay", "Çiçek"];
    let meaning = "Rüyanız bilinçaltınızdaki değişim ve içsel yönelimi taşıyor.";
    let emotional = "Duygusal olarak daha açık ve sezgisel bir döneme giriyorsunuz.";
    let message = "İç sesinizi dinleyin; küçük işaretler sizi doğru yöne götürecek.";

    if (lowerCaseDream.includes("su") || lowerCaseDream.includes("deniz") || lowerCaseDream.includes("nehir")) {
      theme = "Su ve duygular";
      symbols = ["Dalga", "Balık", "Deniz kabuğu"];
      meaning = "Su sembolü duygusal akışınızı, bilinçaltı etkilerinizi ve manevi arayışınızı anlatır.";
      emotional = "İç duygularınızı daha samimi şekilde ifade etme zamanı.";
      message = "Hislerinizi bastırmak yerine açıkça paylaşmak enerjinizi temizler.";
    } else if (lowerCaseDream.includes("uçma") || lowerCaseDream.includes("kuş") || lowerCaseDream.includes("gök")) {
      theme = "Özgürlük ve ilham";
      symbols = ["Kuş", "Rüzgar", "Ufuk"];
      meaning = "Bu rüya özgürlük, hedefler ve yeni bir bakış açısı isteğini yansıtıyor.";
      emotional = "Sınırlardan çıkma hissi ve yeni başlangıç arayışı.";
      message = "Korkularınızı bir kenara bırakıp büyük düşünmeye hazırlanın.";
    } else if (lowerCaseDream.includes("köprü") || lowerCaseDream.includes("yol")) {
      theme = "Geçiş ve dönüşüm";
      symbols = ["Köprü", "Yol", "Kapı"];
      meaning = "Yaşamınızda değişen bir dönemin eşiğindesiniz; kararlarınız yeni bir sezona açıyor.";
      emotional = "Bir önceki evreyi geride bırakma ihtiyacı hissediyorsunuz.";
      message = "Şimdi bir adım atma zamanı. Yavaş ve kararlı ilerleyin.";
    }

    setMockInterpretation({ theme, symbols, meaning, emotional, message });
    setShowInterpretation(true);
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-300">← Ana sayfa</Link>
          <h1 className="text-2xl font-bold text-white">Rüya Yorumu</h1>
        </header>

        {!showInterpretation ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-400">
                <MoonStar className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Rüyanın mesajını çöz</h2>
                <p className="text-slate-300">Rüya detaylarını yaz, görünmeyen anlamı sana açıklayalım.</p>
              </div>
            </div>

            <form onSubmit={handleInterpretDream} className="space-y-5">
              <div>
                <label htmlFor="dream" className="mb-2 block text-sm font-medium text-slate-200">
                  Rüyanızı anlatın
                </label>
                <textarea
                  id="dream"
                  rows={6}
                  value={dreamDescription}
                  onChange={(e) => setDreamDescription(e.target.value)}
                  placeholder="Örn: Rüyamda büyük bir denizde yüzüyordum."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-400 via-pink-400 to-fuchsia-400 px-6 py-3.5 font-bold text-slate-950"
              >
                <CloudLightning size={18} />
                Rüyamı Yorumla
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold text-white">Rüya yorumu</h2>
            <div className="grid gap-4">
              {[
                ["🌙 Rüyanın teması", mockInterpretation?.theme],
                ["🔮 Semboller", mockInterpretation?.symbols?.join(", ")],
                ["✨ Genel yorum", mockInterpretation?.meaning],
                ["❤️ Duygusal anlam", mockInterpretation?.emotional],
                ["💡 Mesaj", mockInterpretation?.message],
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
                onClick={() => {
                  setShowInterpretation(false);
                  setDreamDescription("");
                }}
                className="rounded-full border border-white/10 px-5 py-2.5 text-slate-200"
              >
                Yeni yorum
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
