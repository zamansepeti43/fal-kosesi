import Link from "next/link";

const links = [
  ["Hakkımızda", "/hakkimizda"],
  ["İletişim", "/iletisim"],
  ["Gizlilik Politikası", "/gizlilik"],
  ["KVKK", "/kvkk"],
  ["Mesafeli Satış", "/mesafeli-satis"],
  ["İptal & İade", "/iptal-iade"],
] as const;

export default function LegalFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070714] px-4 py-8 text-white/60">
      <div className="mx-auto max-w-[1024px]">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <div className="font-serif text-lg font-bold text-[#f6dda2]">Fal Köşesi</div>
            <p className="mt-2 max-w-xl text-xs leading-5 text-white/45">
              Kahve falı, tarot ve kişisel yorum deneyimleri sunan dijital platform.
              Satın alma ve kullanım koşulları için aşağıdaki bilgilendirmeleri inceleyebilirsiniz.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] sm:text-xs" aria-label="Yasal bilgiler">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-[#f6d98f]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 border-t border-white/5 pt-4 text-[10px] leading-5 text-white/35">
          © {new Date().getFullYear()} Fal Köşesi. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
