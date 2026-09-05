import Link from "next/link";
import { Sparkles, Clock, TrendingUp, Users } from "lucide-react";

export default function Gecmis() {
  // Mock data for past readings
  const mockReadings = [
    {
      id: 1,
      date: "2026-08-20",
      type: "Kahve Falı",
      summary: "Bir dönüm noktası ve yeni başlangıçların önü.",
      isFavorite: true
    },
    {
      id: 2,
      date: "2026-08-18",
      type: "Aşk Falı",
      summary: "Aşk hayatımdaki derinleşme ve duygusal bağlantı artışı.",
      isFavorite: false
    },
    {
      id: 3,
      date: "2026-08-15",
      type: "Para & Kısmet",
      summary: "Finansal durumunuzda iyileşme görünüyor.",
      isFavorite: true
    }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gold">Fallarım</h1>
        <p className="text-muted mb-6">
          Geçmiş parlarecinizi görüntüleyin, analiz edin ve favorilerinizi işaretleyin.
          Her bir parlare, size geçmişteki kararlarınızın ve olayların sonuçlarını anlamada yardımcı olur.
        </p>
        <div className="w-full max-w-2xl bg-card/50 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="font-semibold text-xl mb-4">Okuma Geçmişiniz</h2>
          <div className="space-y-4">
            {mockReadings.map((reading) => (
              <div key={reading.id} className="glass p-4 hover:glass-hover transition-all card-lift hover:-translate-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{reading.type}</span>
                  <span className="text-xs text-muted">{reading.date}</span>
                </div>
                <p className="text-muted">{reading.summary}</p>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-muted">
                    {reading.isFavorite ? "?" : "?"} Favori
                  </span>
                  <span className="ml-auto text-xs text-muted">
                    <Clock className="w-4 h-4 text-muted" /> 5 dakika okundu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center space-x-3">
          <span className="text-xs text-muted">
            Toplam {mockReadings.length} fala bakıldı
          </span>
          <span className="ml-4 text-xs text-muted">
            {mockReadings.filter(r => r.isFavorite).length} favorili fala
          </span>
        </div>
        <Link href="/" className="mt-8 inline-flex items-center text-gold hover:text-gold-hover">
          ‹ Ana Sayfaya Dön
          <Sparkles className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
