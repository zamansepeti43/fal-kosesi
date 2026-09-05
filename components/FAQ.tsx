export default function FAQ() {
  const faqs = [
    {
      question: "Kahve falı nasıl çalışır?",
      answer: "Fincanınızın iç fotoğrafını ve tabak fotoğrafını yükleyin. Yapay zeka destekli sistemimiz fincanındaki şekilleri ve konumlarını analiz ederek geleneksel kahve falı sembollerini yorumlar ve size kişisel bir fal sunar."
    },
    {
      question: "Fotoğraflarım güvende mi?",
      answer: "Kesinlikle. Fotoğraflarınız yalnızca fal analizi süresi boyunca kullanılır ve analiz tamamlandığında güvenli bir şekilde silinir. Hiçbir fotoğrafımızı üçüncü taraflarla paylaşmıyoruz veya saklamıyoruz."
    },
    {
      question: "Kaç fotoğraf yükleyebilirim?",
      answer: "En fazla 3 fotoğraf yükleyebilirsiniz: fincanın içi, fincanın dışı ve tabak fotoğrafı. En iyi sonuçlar için fincanın içi fotoğrafını net ve iyi ışıkta çekin."
    },
    {
      question: "Premium nedir?",
      answer: "Premium üyelik, daha detaylı fal analizi, sınırsız 'Falcıya Sor' hakkı, geçmiş falarınızı saklama özelliği, özel aşk ve kariyer açılımları, reklamsız deneyim ve öncelikli işlem gibi avantajlar içerir."
    }
  ];

  return (
    <section className="mb-20">
      <div className="section-heading">
        <span className="section-tag">Sık Sorulan Sorular</span>
        <h2 className="section-title">Fal Köşesi hakkında merak ettikleriniz</h2>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
            <h3 className="font-semibold text-xl mb-3">{faq.question}</h3>
            <p className="text-muted leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}