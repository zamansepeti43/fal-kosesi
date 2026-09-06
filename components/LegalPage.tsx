import Link from "next/link";

export const merchant = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Fal Köşesi",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "İletişim e-postası başvuru hesabında tanımlanacaktır.",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "Telefon numarası başvuru bilgilerinde tanımlanacaktır.",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "Merkez adresi başvuru bilgilerinde tanımlanacaktır.",
  taxId: process.env.NEXT_PUBLIC_TAX_ID || "Vergi / kimlik bilgisi başvuru bilgilerinde tanımlanacaktır.",
  mersis: process.env.NEXT_PUBLIC_MERSIS || "MERSİS numarası varsa burada yayınlanacaktır.",
};

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#070714] px-4 py-10 text-[#eee7f3] sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-[24px] border border-white/10 bg-white/[.035] p-5 shadow-2xl sm:p-9">
        <Link href="/" className="text-xs font-bold text-[#f3d58f]">← Fal Köşesi</Link>
        <p className="mt-7 text-[10px] font-black uppercase tracking-[.25em] text-[#c9a3ff]">Bilgilendirme</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{intro}</p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-white/70">{children}</div>
      </article>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-2 text-base font-bold text-white">{title}</h2><div>{children}</div></section>;
}
