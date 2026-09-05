import Link from "next/link";
import { Menu, Heart, User, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-line/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gold">FAL</span>
              <span className="text-2xl font-bold">KÖŞESİ</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-gold transition-colors text-muted">
              Ana Sayfa
            </Link>
            <Link href="/fal/gecmis" className="hover:text-gold transition-colors text-muted">
              Fallarım
            </Link>
            <Link href="/fal/profil" className="hover:text-gold transition-colors text-muted">
              Profil
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-line/30 transition-colors">
              <Menu className="w-5 h-5 text-muted hover:text-gold" />
            </button>
            <Link href="/fal/upload" className="btn-primary">
              <Sparkles className="w-4 h-4 mr-1" />
              Falımı Bak
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}