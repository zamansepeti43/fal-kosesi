import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function PrivacyPage() {
  return <LegalPage title="Gizlilik Politikası" intro="Bu metin, Fal Köşesi üzerinden sunulan dijital hizmetlerde kişisel verilerin ve hesap bilgilerinin nasıl işlendiğini açıklar.">
    <Section title="Toplanan bilgiler">Hesap ve hizmet kullanımı sırasında ad, e-posta, telefon, doğum tarihi, seçilen fal türleri, yüklenen fal fotoğrafları ve işlem bilgileri gibi hizmetin sunulması için gerekli veriler işlenebilir.</Section>
    <Section title="Kullanım amaçları">Veriler; üyelik ve oturum işlemleri, fal/yorum hizmetinin sunulması, kredi ve ödeme işlemlerinin yürütülmesi, müşteri desteği, güvenlik, dolandırıcılığın önlenmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır.</Section>
    <Section title="Ödeme bilgileri">Kart bilgileriniz Fal Köşesi sunucularında saklanmaz. Ödeme işlemleri yetkili ödeme hizmet sağlayıcısının ödeme altyapısı üzerinden gerçekleştirilir.</Section>
    <Section title="Veri güvenliği">Kişisel verilerin yetkisiz erişime, kayba veya hukuka aykırı kullanıma karşı korunması için makul teknik ve idari tedbirler uygulanır. Yasal zorunluluklar saklıdır.</Section>
    <Section title="İletişim">Veri talepleriniz için {merchant.email} adresinden iletişime geçebilirsiniz. İşletme: {merchant.name}.</Section>
  </LegalPage>;
}
