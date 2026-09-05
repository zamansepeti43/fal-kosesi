import Link from "next/link";
import { Sparkles, Star, ShieldCheck, Clock } from "lucide-react";

export default function PremiumSection() {
  return (
    <section className="mb-20">
      <div className="section-heading">
        <span className="section-tag">Fal Köşesi Premium</span>
        <h2 className="section-title">Daha derinlemesine bir deneyim</h2>
        <p className="section-description">
          Premium üyelikle kahve falı deneyiminizi bir sonraki seviyeye taşıyın.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="flex items-center justify-center w-14 h-14 mb-6 bg-gold/20 rounded-lg">
            <Sparkles className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Derinlemesine Analiz</h3>
          <p className="text-muted">
            Daha detaylı sembol yorumları, geçmiş falarınızla ilişkilerinizi keşfetme ve
            kişisel gelişim önerileri.
          </p>
        </div>
        <div className="p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="flex items-center justify-center w-14 h-14 mb-6 bg-gold/20 rounded-lg">
            <Star className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Sınırsız Falcıya Sor</h3>
          <p className="text-muted">
            Falınız hakkında takip sorularınızı sınırsız sorun ve daha derinlemesine
            yorumlar alın.
          </p>
        </div>
        <div className="p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="flex items-center justify-center w-14 h-14 mb-6 bg-gold/20 rounded-lg">
            <ShieldCheck className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Reklamsız Deneyim</h3>
          <p className="text-muted">
            Reklam olmadığı için tam odaklanarak fal yolculuğunuzu sürdürebilirsiniz.
          </p>
        </div>
        <div className="p-8 glass hover:glass-hover transition-all card-lift hover:-translate-y-2">
          <div className="flex items-center justify-center w-14 h-14 mb-6 bg-gold/20 rounded-lg">
            <Clock className="w-8 h-8 text-gold" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Öncelikli İşlem</h3>
          <p className="text-muted">
            Fal isteklerinizi öncelikli kuyruğa alın ve daha hızlı yorumlar alın.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center">
        <Link href="/fal/premium" className="btn-primary pulse">
          <Sparkles className="w-5 h-5 mr-2" />
          Premium'u Keşfet
        </Link>
      </div>
    </section>
  );
}