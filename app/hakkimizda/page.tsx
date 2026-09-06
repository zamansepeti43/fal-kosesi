import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function AboutPage() {
  return <LegalPage title="Hakkımızda" intro="Fal Köşesi, kahve falı, tarot ve farklı kişisel yorum deneyimlerini tek bir dijital platformda sunmak amacıyla hazırlanmıştır.">
    <Section title="Fal Köşesi nedir?">Fal Köşesi; kullanıcıların kendi seçtikleri dijital fal ve yorum hizmetlerine erişebildiği, fotoğraf yükleyerek veya kart seçerek kişiselleştirilmiş yorumlar alabildiği bir dijital hizmet platformudur.</Section>
    <Section title="Hizmet yaklaşımımız">Yorumlar eğlence ve kişisel farkındalık amacıyla hazırlanır. Fal Köşesi; sağlık, hukuk, yatırım veya başka bir profesyonel danışmanlık hizmetinin yerine geçmez ve geleceğe ilişkin kesin sonuç garantisi vermez.</Section>
    <Section title="İşletme bilgileri"><p>İşletme: {merchant.name}</p><p>E-posta: {merchant.email}</p><p>Telefon: {merchant.phone}</p><p>Adres: {merchant.address}</p><p>Vergi / Kimlik: {merchant.taxId}</p><p>MERSİS: {merchant.mersis}</p></Section>
  </LegalPage>;
}
