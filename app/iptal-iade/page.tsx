import { LegalPage, Section, merchant } from "@/components/LegalPage";

export default function RefundPage() {
  return <LegalPage title="İptal ve İade Koşulları" intro="Fal Köşesi dijital hizmetlerinde sipariş iptali, hizmetin durumuna ve yürürlükteki tüketici mevzuatına göre değerlendirilir.">
    <Section title="İptal">Hizmet henüz başlatılmadıysa kullanıcı destek kanallarından iptal talebi iletebilir. Hizmetin başlatılması veya tamamlanması sonrasında dijital hizmetin niteliği ve mevzuattaki istisnalar dikkate alınır.</Section>
    <Section title="İade">Ödeme hatası, teknik sebeple hizmetin sunulamaması veya mevzuat kapsamında iade hakkının doğduğu durumlarda ücret iadesi uygulanır. İade, mümkün olduğunca ödemenin yapıldığı yönteme gerçekleştirilir.</Section>
    <Section title="Eksik veya hatalı hizmet">Siparişin eksik, hatalı veya teknik olarak kullanılamaz şekilde sonuçlandığını düşünüyorsanız {merchant.email} adresine sipariş bilgisiyle başvurabilirsiniz. Uygun durumlarda hizmet yeniden sunulabilir veya iade yapılabilir.</Section>
    <Section title="Destek"><p>E-posta: {merchant.email}</p><p>Telefon: {merchant.phone}</p><p>Adres: {merchant.address}</p></Section>
  </LegalPage>;
}
