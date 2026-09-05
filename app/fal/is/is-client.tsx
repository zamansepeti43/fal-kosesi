"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Sparkles, Star, TrendingUp } from "lucide-react";

const careers = [
  "Yönetim / Liderlik",
  "İletişim / Pazarlama",
  "Teknoloji / Yapay Zeka",
  "Girişim / Kurumsal",
  "Eğitim / Danışmanlık",
  "Yaratıcılık / Tasarım",
] as const;

type CareerForm = {
  role: (typeof careers)[number];
  experience: string;
  question: string;
  confidence: string;
};

export default function IsClient() {
  const [form, setForm] = useState<CareerForm>({
    role: careers[0],
    experience: "1-3 yıl",
    question: "",
    confidence: "orta",
  });
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;

    const roleMap: Record<string, { energy: string; opportunity: string; caution: string; future: string; advice: string }> = {
      "Yönetim / Liderlik": {
        energy: "Liderlik ve kararlılık enerjiniz güçlü; yön vermek için doğru zamandasınız.",
        opportunity: "Sorumluluk alanı genişlerken, takım içinde güven oluşturan pozisyonlar açılabilir.",
        caution: "Kontrolcü tavır yerine net iletişim daha güçlü sonuç verir.",
        future: "Bir sonraki adım, daha görünür sorumluluk ve stratejik görevler olabilir.",
        advice: "Yalnızca işin içindeki başarıya değil, güçlü etki bırakmaya odaklanın.",
      },
      "İletişim / Pazarlama": {
        energy: "İletişim ve görünürlük artıyor; doğru mesajı vermek önem taşıyor.",
        opportunity: "Yeni ortaklıklar, teklifler ve güçlü iletişim odaklı projeler çıkabilir.",
        caution: "Aşırı baskı veya gereksiz sürtüşmelere karşı dikkatli olun.",
        future: "Duygusal açıdan net ve güvenli yaklaşım fark yaratır.",
        advice: "Kısa ama etkili iletişim, sizi hedeflenen fırsatlara götürür.",
      },
      "Teknoloji / Yapay Zeka": {
        energy: "Yenilik, öğrenme ve adapte olma ritmi bu dönemde yüksekti.",
        opportunity: "Yenilikçi çözümler ve uzmanlaşma fırsatları artıyor.",
        caution: "Aşırı veri yükü ve sürekli değişim içinde dengeyi koruyun.",
        future: "Yatırım ve uzmanlık odaklı bir yükseliş süreci başlıyor.",
        advice: "Derin uzmanlık ve net hedef, sizi öne çıkaracak anahtar olacak.",
      },
      "Girişim / Kurumsal": {
        energy: "Kendi işinizi kurma veya daha özgür bir yön seçme arayışı güçleniyor.",
        opportunity: "Büyük fikirler daha somut teklifler haline gelebilir.",
        caution: "Riskleri doğru ölçmeden atmak sizi yorar; planlı hareket edin.",
        future: "Küçük ama stratejik adımlar büyük dönüşüm sağlar.",
        advice: "İşinizi büyütmek için güçlü bir sistem ve güven veren iletişim kurun.",
      },
      "Eğitim / Danışmanlık": {
        energy: "İnsanlarla temas, yol gösterme ve güven inşa etme enerjiniz güçlü.",
        opportunity: "Uzmanlık ve güven veren yönünüz belirleyici bir avantaj yaratıyor.",
        caution: "Aşırı sorumluluk almak enerjinizi tüketebilir.",
        future: "İçerik, rehberlik ve yetkinlik odaklı yeni kapılar açılabilir.",
        advice: "Bilginizi paylaşırken sınırlarınızı da net tutun.",
      },
      "Yaratıcılık / Tasarım": {
        energy: "Yaratıcılığınız ve özgün bakış açınız bu dönemde güçleniyor.",
        opportunity: "Proje ve iş birliklerinde görünürlüğünüz artabilir.",
        caution: "Yaratıcı yönünüzü çok çok uzatmak, netlik kaybına yol açabilir.",
        future: "Özgün sunumlar ve stratejik iş birlikleri öne çıkacak.",
        advice: "Kendi tarzınızı koruyup, teknik düzeni de birlikte kurun.",
      },
    };

    return roleMap[form.role] ?? roleMap[careers[0]];
  }, [form, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) {
      alert("Lütfen kariyer sorunuzunu yazın.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300">
            <ArrowLeft className="h-4 w-4" /> Geri
          </Link>
          <div className="h-2 w-2 rounded-full bg-amber-300" />
          <h1 className="text-2xl font-bold text-white md:text-3xl">İş & Kariyer Falı</h1>
        </header>

        {!submitted ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 shadow-[0_0_24px_rgba(59,130,246,0.35)]">
                <BriefcaseBusiness className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Premium okuma</p>
                <h2 className="mt-1 text-xl font-semibold text-white md:text-2xl">Kariyer yolunu aç</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Alan</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as (typeof careers)[number] }))}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  >
                    {careers.map((career) => (
                      <option key={career} value={career}>{career}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Deneyim</label>
                  <select
                    value={form.experience}
                    onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="1-3 yıl">1-3 yıl</option>
                    <option value="3-6 yıl">3-6 yıl</option>
                    <option value="6-10 yıl">6-10 yıl</option>
                    <option value="10+ yıl">10+ yıl</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Kariyer sorunuz</label>
                <textarea
                  rows={5}
                  value={form.question}
                  onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="Örn: Yakın dönemde işim ve pozisyonum için en doğru adım ne olacak?"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Güven seviyesi</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["düşük", "Düşük"],
                    ["orta", "Orta"],
                    ["yüksek", "Yüksek"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, confidence: value }))}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        form.confidence === value
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100"
                          : "border-white/10 bg-white/5 text-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]"
              >
                <Sparkles size={18} />
                Sonuçları Gör
              </button>
            </form>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl md:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Kariyer yorumu</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{form.role}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
              >
                Yeni okuma
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["💼 Kariyer Enerjisi", result?.energy],
                ["🚀 Fırsatlar", result?.opportunity],
                ["⚠️ Dikkat", result?.caution],
                ["🔮 Yakın Gelecek", result?.future],
              ].map(([title, value]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/5 to-cyan-500/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-amber-200">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.2em]">Tavsiye</span>
              </div>
              <p className="text-base leading-7 text-slate-200">{result?.advice}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-amber-200">
                <Star className="h-4 w-4" /> Ana sayfaya dön
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
