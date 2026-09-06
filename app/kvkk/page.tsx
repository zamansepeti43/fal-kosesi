import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function KvkkPage() {
  return <LegalPage title="KVKK Aydınlatma Metni" intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu tarafından yapılan kişisel veri işleme faaliyetleri hakkında bilgilendirme.">
    <Section title="Veri sorumlusu">Veri sorumlusu: {merchant.name}. İletişim: {merchant.email}. Adres: {merchant.address}.</Section>
    <Section title="İşlenen veri kategorileri">Kimlik ve iletişim bilgileri, müşteri işlem bilgileri, ödeme/sipariş bilgileri, hizmet kullanım bilgileri ve hizmetin niteliğine göre kullanıcı tarafından sağlanan içerikler işlenebilir.</Section>
    <Section title="Hukuki sebepler ve amaçlar">Kişisel veriler; sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaatler ve gerekli hallerde açık rıza hukuki sebeplerine dayanılarak; hizmet sunumu, güvenlik, ödeme, destek ve yasal yükümlülükler için işlenir.</Section>
    <Section title="Haklarınız">KVKK'nın 11. maddesi kapsamındaki haklarınız için {merchant.email} adresine başvurabilirsiniz. Başvurular ilgili mevzuatta öngörülen usul ve süreler kapsamında değerlendirilir.</Section>
  </LegalPage>;
}
