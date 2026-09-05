import Link from "next/link";
import { Sparkles, Coffee } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-text from-gold to-gold-hover">
            Fincanını getir,<br className="hidden md:inline" />
            <span className="block">falını keşfet.</span>
          </h1>
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
            Fincanınızın fotoğraflarını yükleyerek, yapay zekâ destekli kahve falı deneyimini yaşa.
            Geleneksel fal sembollerini modern yorumlayarak size özel bir yol haritası oluşturuyoruz.
          </p>
          <Link href="/fal/upload" className="btn-primary pulse">
            <Sparkles className="w-5 h-5 mr-2" />
            Kahve Falıma Bak
          </Link>
        </div>
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:justify-center md:space-x-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Coffee className="w-8 h-8 text-gold" />
              <span className="text-lg font-medium">1000+</span>
              <span className="text-muted">Mutlu kullanıcı</span>
            </div>
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Sparkles className="w-8 h-8 text-gold" />
              <span className="text-lg font-medium">98%</span>
              <span className="text-muted">Doğruluk oranı</span>
            </div>
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-medium">24/7</span>
              <span className="text-muted">Destek</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-b from-background/80 to-transparent" />
      </div>
    </section>
  );
}