"use client";

import Link from "next/link";
import { useState } from "react";
import { Wallet, Sparkles, ArrowLeft } from "lucide-react";

type ParaReading = {
  moneyEnergy: string;
  opportunities: string;
  caution: string;
  nearFuture: string;
};

export default function ParaClient() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ question: "", financialSituation: "" });
  const [showResult, setShowResult] = useState(false);
  const [mockResult, setMockResult] = useState<ParaReading | null>(null);

  const steps = ["Finansal Durum", "Soru", "Sonuç"];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.question.trim()) {
      alert("Lütfen sorunuzu yazın.");
      return;
    }

    setMockResult({
      moneyEnergy: "Artış treni belirginleşti; gelir ve düzen akışı güçleniyor.",
      opportunities: "Bu ay içinde küçük ama değerli fırsatlar ortaya çıkabilir; iletişim ve teklifleri ciddiye alın.",
      caution: "Ani harcamalardan kaçının; yatırım kararlarını aceleye getirmeyin.",
      nearFuture: "Gelen dönemde maddi rahatlama ve planlı kazanç ihtimali yükseliyor.",
    });
    setShowResult(true);
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-300">
            <ArrowLeft className="inline h-4 w-4" /> Geri
          </Link>
          <h1 className="text-2xl font-bold text-white">Para & Kısmet</h1>
        </header>

        {!showResult ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-300 text-slate-950">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Maddi enerjini oku</h2>
                <p className="text-slate-300">Finansal akışın, fırsatların ve dikkat edilmesi gereken noktaların yolunu göster.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="financialSituation" className="mb-2 block text-sm font-medium text-slate-200">
                  Finansal durumu belirtmek ister misin?
                </label>
                <select
                  id="financialSituation"
                  value={userData.financialSituation}
                  onChange={(e) => setUserData({ ...userData, financialSituation: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                  <option value="">Seçim yap</option>
                  <option value="stable">Dengeli</option>
                  <option value="improving">İyileşiyor</option>
                  <option value="variable">Değişken</option>
                  <option value="focus">Dikkat gerektiriyor</option>
                </select>
              </div>

              <div>
                <label htmlFor="question" className="mb-2 block text-sm font-medium text-slate-200">
                  Sorun nedir?
                </label>
                <textarea
                  id="question"
                  rows={5}
                  value={userData.question}
                  onChange={(e) => setUserData({ ...userData, question: e.target.value })}
                  placeholder="Örn: Bu ay maddi açıdan rahatlayacak mıyım?"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-slate-300"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-300 px-6 py-3 font-bold text-slate-950"
                >
                  <Sparkles size={18} />
                  Sonuçları Gör
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold text-white">Para & Kısmet Falınız</h2>
            <div className="grid gap-4">
              {[
                ["💰 Para Enerjisi", mockResult?.moneyEnergy],
                ["📈 Fırsatlar", mockResult?.opportunities],
                ["⚠️ Dikkat", mockResult?.caution],
                ["🔮 Yakın Dönem", mockResult?.nearFuture],
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
                  setShowResult(false);
                  setUserData({ question: "", financialSituation: "" });
                }}
                className="rounded-full border border-white/10 px-5 py-2.5 text-slate-200"
              >
                Yeni fal
              </button>
              <Link href="/" className="rounded-full bg-emerald-500/15 px-5 py-2.5 font-medium text-emerald-200">
                Ana sayfa
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
