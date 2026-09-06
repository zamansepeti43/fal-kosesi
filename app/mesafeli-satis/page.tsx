import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function DistanceSalesPage() {
  return <LegalPage title="Mesafeli Satış Sözleşmesi" intro="Bu sözleşme, Fal Köşesi üzerinden elektronik ortamda satın alınan dijital fal ve yorum hizmetlerinin satış koşullarını düzenler.">
    <Section title="1. Taraflar"><p>Satıcı / Hizmet sağlayıcı: {merchant.name}</p><p>E-posta: {merchant.email}</p><p>Telefon: {merchant.phone}</p><p>Adres: {merchant.address}</p><p>Vergi / Kimlik: {merchant.taxId}</p><p>MERSİS: {merchant.mersis}</p></Section>
    <Section title="2. Konu">Sözleşmenin konusu, tüketicinin Fal Köşesi üzerinde seçtiği dijital fal, tarot ve benzeri yorum hizmetinin elektronik ortamda satın alınması ve sunulmasıdır.</Section>
    <Section title="3. Sipariş ve ödeme">Hizmetin adı, kapsamı ve güncel satış bedeli ödeme öncesinde kullanıcıya gösterilir. Ödeme, yetkili ödeme hizmet sağlayıcısı aracılığıyla tamamlandıktan sonra sipariş oluşturulur.</Section>
    <Section title="4. Hizmetin ifası">Dijital hizmet, siparişin onaylanmasının ardından elektronik ortamda sunulur. Hizmetin sunulmasına tüketicinin açık talebi ve onayıyla ödeme sonrasında başlanabilir.</Section>
    <Section title="5. Cayma hakkı ve istisnalar">Dijital hizmetlerde cayma hakkının kullanılması, hizmetin ifasına tüketicinin onayıyla başlanması ve mevzuatta öngörülen istisnalar kapsamında değerlendirilebilir. Kullanıcı, satın alma ekranındaki bilgilendirmeleri ve onayları işlem öncesinde incelemelidir.</Section>
    <Section title="6. Uyuşmazlıklar">Tüketici mevzuatından doğan emredici haklar saklıdır. Yetkili tüketici mercileri ve mahkemeler bakımından yürürlükteki mevzuat hükümleri uygulanır.</Section>
  </LegalPage>;
}
