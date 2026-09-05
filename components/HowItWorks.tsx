import { Sparkles, Coffee, ChevronRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="mb-20">
      <div className="section-heading">
        <span className="section-tag">Nasıl Çalışır?</span>
        <h2 className="section-title">Üç adımda falınızı keşfedin</h2>
        <p className="section-description">
          Fincanınızın fotoğraflarını yükleyin, fal türünüzü seçin ve kişisel yorumunuzu anlayın.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center text-center p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="w-14 h-14 mb-6 flex items-center justify-center bg-gold/20 rounded-lg">
            <Sparkles className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-3">Fotoğrafını çek</h3>
          <p className="text-muted">
            Fincanını temiz ve aydınlık bir kareyle göster. İç kısım net görünmeli.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="w-14 h-14 mb-6 flex items-center justify-center bg-gold/20 rounded-lg">
            <Coffee className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-3">Fal türünü seç</h3>
          <p className="text-muted">
            Kahve, tarot, aşk, para veya diğer fal türlerinden birini seçin.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="w-14 h-14 mb-6 flex items-center justify-center bg-gold/20 rounded-lg">
            <ChevronRight className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-3">Sonuçları keşfet</h3>
          <p className="text-muted">
            Semboller ve yorumlar üzerinden kişisel falınızı anlayın.
          </p>
        </div>
      </div>
    </section>
  );
}