"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Heart, 
  Sparkles, 
  User 
} from "lucide-react";

export default function AskClient() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    relationshipStatus: "",
    question: ""
  });
  const [showResult, setShowResult] = useState(false);
  const [mockResult, setMockResult] = useState<{ name: string; loveEnergy: string; partnerFeeling: string; nearFuture: string; advice: string; question: string } | null>(null);

  const steps = [
    "İsminiz",
    "İlişki Durumu",
    "Sorunuz",
    "Sonuç"
  ];

  const handleNext = () => {
    if (step === 0) {
      if (!userData.name.trim()) {
        alert("Lütfen isminizi yazın.");
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!userData.relationshipStatus.trim()) {
        alert("Lütfen ilişki durumunuzu seçin.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!userData.question.trim()) {
        alert("Lütfen aşk sorunuzunu yazın.");
        return;
      }
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!userData.name.trim() || !userData.relationshipStatus.trim() || !userData.question.trim()) {
      alert("Lütfen isim, ilişki durumu ve aşk sorunuzunu doldurun.");
      return;
    }

    const questionText = userData.question.trim();
    const relationshipMood = userData.relationshipStatus === "single"
      ? "Bu dönemde duygusal çekim ve kendini tanıma enerjisi yüksek."
      : userData.relationshipStatus === "in_relationship"
        ? "İlişkide yakınlık ve güven artıyor; duygusal açıklık önem taşıyor."
        : userData.relationshipStatus === "uncertain"
          ? "Kararsızlık hissi var; netlik için iç sesinizi dinleyin."
          : "Geçmişte kalan bağlar ve öğrenilmiş dersler yeniden görünmeye başlıyor.";

    const partnerMood = userData.relationshipStatus === "single"
      ? "Yeni bir ilişkinin kapısı aralanabilir; kendinizi koruyup net kalın."
      : "İlişki tarafı için anlayış ve samimiyet ön planda. Açık iletişim güçleniyor.";

    setMockResult({
      name: userData.name.trim(),
      loveEnergy: `Sorunuz: "${questionText}" için bu süreçte ${relationshipMood.toLowerCase()}`,
      partnerFeeling: `"${questionText}" sorusuna göre, karşı tarafın duygusal enerjisi şöyle okunuyor: ${partnerMood.toLowerCase()}`,
      nearFuture: `Sorunuzdan yola çıkarsak, yakın gelecekte ${questionText.toLowerCase()} konusunda netlik ve olumlu hareketler yaşanabilir.`,
      advice: `"${questionText}" sorunu için en güçlü öneri, dürüst iletişim ve kalpten gelen netliktir. Bu süreçte duygusal olarak açık olmak ve gerçek hislerinizi saklamamak en doğru adımı yaratır.`,
      question: questionText
    });
    setShowResult(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-gradient-to-br from-rose-800 via-red-600 to-pink-400 rounded-xl">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gold">Aşk Falı</h1>
        <p className="text-muted mb-6">
          Aşk hayatındaki meraklarını keşfet. 
          Şu anki durumunuz, geçmiş bağlantılarınız ve geleceğinizdeki olası gelişmeler hakkında ipuçları alın.
        </p>
         
        {!showResult && (
          <div className="w-80 bg-card/50 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="font-semibold text-xl mb-4">{steps[step]}</h2>
            <form id="ask-form" onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              {step === 0 && (
                <>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    İsminiz
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    placeholder="Adınızı yazın"
                    className="w-full px-4 py-3 glass hover:glass-hover transition-all rounded-lg border border-line/30 focus:border-gold focus:ring-0"
                  />
                </>
              )}
              {step === 1 && (
                <>
                  <label htmlFor="relationship" className="block text-sm font-medium mb-1">
                    İlişki Durumu
                  </label>
                  <select
                    id="relationship"
                    value={userData.relationshipStatus}
                    onChange={(e) => setUserData({...userData, relationshipStatus: e.target.value})}
                    className="w-full px-4 py-3 glass hover:glass-hover transition-all rounded-lg border border-line/30 focus:border-gold focus:ring-0"
                  >
                    <option value="">Bir seçenek yapın</option>
                    <option value="single">Bekarım</option>
                    <option value="in_relationship">İlişkim var</option>
                    <option value="uncertain">Kararsızım</option>
                    <option value="ex">Geçmişten biri</option>
                  </select>
                </>
              )}
              {step === 2 && (
                <>
                  <label htmlFor="question" className="block text-sm font-medium mb-1">
                    Aşk sorunuz
                  </label>
                  <textarea
                    id="question"
                    rows={4}
                    value={userData.question}
                    onChange={(e) => setUserData({...userData, question: e.target.value})}
                    placeholder="Örn: Benimle ilgileniyor mu?"
                    className="w-full px-4 py-3 glass hover:glass-hover transition-all rounded-lg border border-line/30 focus:border-gold focus:ring-0"
                  />
                  <p className="text-xs text-muted mt-1">
                    Sorunuzu yazın; fal yorumunuz bu soruya göre şekillenecek.
                  </p>
                </>
              )}
            </form>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={step === 0}
                className="px-3 py-1 bg-line/30 hover:bg-line/40 text-gray-500 rounded-lg disabled:opacity-50"
              >
                ← Geri
              </button>
              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift"
                >
                  İleri →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-3 py-1 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift"
                >
                  Sonuçları Gör
                </button>
              )}
            </div>
          </div>
        )}
        
        {showResult && mockResult && (
          <div className="w-80 bg-card/50 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="font-semibold text-xl mb-4">Aşk Falınız</h2>
            <div className="mb-4 rounded-lg border border-line/30 bg-line/10 p-3 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Yorum için</p>
              <p className="mt-1 font-medium text-white">{mockResult.name}</p>
              <p className="mt-1 text-sm text-slate-300">Sorunuz: {mockResult.question}</p>
            </div>
            <div className="space-y-6">
              <div className="glass p-4 hover:glass-hover transition-all card-lift hover:-translate-y-2">
                <h3 className="font-semibold text-lg">❤️ Aşk Enerjisi</h3>
                <p className="text-muted">{mockResult.loveEnergy}</p>
              </div>
              <div className="glass p-4 hover:glass-hover transition-all card-lift hover:-translate-y-2">
                <h3 className="font-semibold text-lg">💌 Karşı Taraf</h3>
                <p className="text-muted">{mockResult.partnerFeeling}</p>
              </div>
              <div className="glass p-4 hover:glass-hover transition-all card-lift hover:-translate-y-2">
                <h3 className="font-semibold text-lg">🔮 Yakın Gelecek</h3>
                <p className="text-muted">{mockResult.nearFuture}</p>
              </div>
              <div className="glass p-4 hover:glass-hover transition-all card-lift hover:-translate-y-2">
                <h3 className="font-semibold text-lg">✨ Tavsiye</h3>
                <p className="text-muted">{mockResult.advice}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center text-gold hover:text-gold-hover">
                ← Ana Sayfaya Dön
                <Heart className="ml-2 w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setShowResult(false);
                  setStep(0);
                }}
                className="ml-4 inline-flex items-center px-4 py-2 bg-line/30 hover:bg-line/40 text-gray-500 rounded-lg hover:text-gray-600"
              >
                Yeni Fal
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}