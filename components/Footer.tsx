import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line/20 mt-20 pt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gold">FAL</span>
              <span className="text-2xl font-bold">KÖŞESİ</span>
            </Link>
            <p className="text-muted text-sm">
              Kahve, merak ve biraz da gizem.
            </p>
          </div>
          <div className="flex flex-wrap space-x-4">
            <a href="#" className="hover:text-gold transition-colors text-muted">
              Hakkımızda
            </a>
            <a href="#" className="hover:text-gold transition-colors text-muted">
              Gizlilik Politikası
            </a>
            <a href="#" className="hover:text-gold transition-colors text-muted">
              Kullanım Şartları
            </a>
            <a href="#" className="hover:text-gold transition-colors text-muted">
              İletişim
            </a>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-gold transition-colors text-muted">
                Instagram
              </a>
              <a href="#" className="hover:text-gold transition-colors text-muted">
                Twitter
              </a>
              <a href="#" className="hover:text-gold transition-colors text-muted">
                YouTube
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-muted text-sm">
          © 2026 Fal Köşesi. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}