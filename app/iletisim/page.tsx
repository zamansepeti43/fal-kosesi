import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function ContactPage() {
  return <LegalPage title="İletişim" intro="Fal Köşesi ile ilgili destek, satın alma, iade ve diğer talepleriniz için aşağıdaki iletişim kanallarını kullanabilirsiniz.">
    <Section title="Müşteri iletişimi"><p>E-posta: <a className="text-[#f3d58f] underline" href={`mailto:${merchant.email}`}>{merchant.email}</a></p><p>Telefon: {merchant.phone}</p><p>Adres: {merchant.address}</p></Section>
    <Section title="Destek talepleri">Sipariş, kredi bakiyesi, ödeme, teknik sorun veya iade talebinizi mümkün olduğunca sipariş bilgisi ve kayıtlı e-posta adresinizle birlikte iletmeniz önerilir.</Section>
    <Section title="İşletme bilgileri"><p>İşletme: {merchant.name}</p><p>Vergi / Kimlik: {merchant.taxId}</p><p>MERSİS: {merchant.mersis}</p></Section>
  </LegalPage>;
}
