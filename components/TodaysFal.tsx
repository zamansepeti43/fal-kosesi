import Link from "next/link";
import { Moon, Star } from "lucide-react";

export default function TodaysFal() {
  return (
    <section className="mb-20">
      <div className="section-heading">
        <span className="section-tag">Günün Falı</span>
        <h2 className="section-title">Bugün size ne await ediyor?</h2>
      </div>
      <div className="glass p-8 hover:glass-hover transition-all card-lift hover:-translate-y-2">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gold/20 rounded-lg">
            <Moon className="w-8 h-8 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Yıldızname: Boğa</h3>
            <p className="text-muted">
              Bugün sabır ve déterminasyonunuzun ödüllendirildiği bir gün. 
              Kariyer ve finansal konularda fırsatlar yakalamaya açık olun.
              Aşk hayatında ise duygusal bağlantılarınızı derinleştirmek için 
              doğru gün.
            </p>
            <Link href="/fal/yildizname" className="text-sm font-medium text-gold hover:text-gold-hover">
              Daha Detaylı Oku →
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4 pt-4 border-t border-line/20">
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Star className="w-4 h-4 text-gold" />
            Günün enerjisi: ⭐⭐⭐⭐☆
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Moon className="w-4 h-4 text-gold" />
            Uyumlu burç: Scorpio
          </div>
        </div>
      </div>
    </section>
  );
}