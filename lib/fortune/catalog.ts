export type FortuneKind =
  | "coffee"
  | "love"
  | "money"
  | "career"
  | "future"
  | "daily"
  | "dream"
  | "astrology"
  | "numerology"
  | "general"
  | "tarot"
  | "katina"
  | "lenormand"
  | "angel";

export type DeliveryMode = "instant" | "queued" | "priority" | "human";

export type DigitalCommentator = {
  id: string;
  name: string;
  title: string;
  specialties: FortuneKind[];
  rating: number;
  readingCount: number;
  etaMinutes: number;
  priceCredits: number;
  voiceCredits: number;
  availability: "online" | "busy" | "offline";
  description: string;
  verified: boolean;
  avatarUrl: string;
};

type Seed = [string, string, string, string];

const roster: Record<FortuneKind, Seed[]> = {
  coffee: [
    ["Esmeralya", "Telve & Sembol Ustası", "Fincanın küçük izlerini ve sembol kümelerini birleştirir.", "Semboller • Aşk • Zaman"],
    ["Zafira", "Sezgisel Fincan Yorumcusu", "Telve yoğunluğunu ve fincan bölgelerini sezgisel bir anlatımla yorumlar.", "Sezgisel • İlişki • Duygular"],
    ["Serafina", "Aşk Telvesi Uzmanı", "Kalp, yol ve karşılaşma sembollerini ilişki bağlamında okur.", "Aşk • Hisler • Karşılaşma"],
    ["Bellara", "Derin Kahve Okuması", "Geçmişten geleceğe uzanan sembol zincirlerini ayrıntılı ele alır.", "Detaylı • Geçmiş • Gelecek"],
    ["Velmira", "Kapsamlı Fincan Analisti", "Fincan, dip ve kenar bölgelerini birlikte değerlendirir.", "Kapsamlı • Kariyer • Para"],
  ],
  love: [
    ["Amaryssa", "Kalp & Hisler Yorumcusu", "Söylenenlerle hissedilenler arasındaki farkı inceler.", "Hisler • İletişim • Aşk"],
    ["Lunavera", "İlişki Sezgisi Uzmanı", "Yakınlaşma, uzaklaşma ve yeniden iletişim temalarını yorumlar.", "İlişki • Barışma • Sezgi"],
    ["Roselith", "Aşk Yol Haritası", "İlişkide dönüm noktalarını, engelleri ve sonraki adımları yorumlar.", "Gelecek • Engel • Karar"],
    ["Serenaya", "Eski Aşk & Yeni Başlangıç", "Geçmiş bağların izlerini ve yeni başlangıç temalarını ele alır.", "Eski Aşk • Başlangıç • Duygu"],
    ["Valessia", "Derin Bağ Analisti", "Güven, iletişim, çekim ve uzun vadeli uyumu ayrı ayrı değerlendirir.", "Bağ • Uyum • Gelecek"],
  ],
  money: [
    ["Aurelia", "Bereket Yorumcusu", "Fırsat, kazanç ve kaynakların sembolik akışını birlikte değerlendirir.", "Bereket • Fırsat • Kazanç"],
    ["Zelphira", "Finansal Sezgi Uzmanı", "Para kararlarında fırsat ile risk arasındaki dengeyi öne çıkarır.", "Risk • Fırsat • Karar"],
    ["Mirellia", "Kısmet & Kazanç Okuyucusu", "Beklenen para, yeni gelir ve geciken fırsat temalarını yorumlar.", "Kısmet • Gelir • Beklenti"],
    ["Calthera", "İş & Servet Yorumcusu", "Kariyer bağlantılı maddi fırsatları ve düzen değişikliklerini inceler.", "İş • Servet • Değişim"],
    ["Virelune", "Büyük Fırsat Analisti", "Maddi hedefleri, seçenekleri ve dikkat edilmesi gereken noktaları ayrıştırır.", "Fırsat • Hedef • Strateji"],
  ],
  career: [
    ["Avenora", "Kariyer Yolcusu", "İş değişimi, başvuru ve yükseliş dönemlerini yorumlar.", "İş • Değişim • Terfi"],
    ["Celestara", "Başarı Sezgisi Uzmanı", "Görünürlük, yetenek ve doğru zamanlama temalarına odaklanır.", "Başarı • Yetenek • Zaman"],
    ["Orphinea", "İş Kararı Yorumcusu", "İki seçenek arasında kalan durumları karşılaştırır.", "Karar • Seçenek • Risk"],
    ["Marivelle", "Terfi & Hedef Uzmanı", "Uzun vadeli hedefleri ve kariyer dönüm noktalarını ele alır.", "Terfi • Hedef • Plan"],
    ["Solmira", "Gelecek Meslek Analisti", "Yeni iş, proje ve kariyer fırsatlarının yönünü yorumlar.", "Proje • Fırsat • Gelecek"],
  ],
  future: [
    ["Nostrella", "Yakın Gelecek Yorumcusu", "Yakın dönemde öne çıkabilecek temaları ve değişim işaretlerini yorumlar.", "Yakın Gelecek • Değişim • İşaret"],
    ["Elvaria", "Yol & Kader Yorumcusu", "Seçimlerin olası yönlerini sembolik bir haritaya dönüştürür.", "Yol • Seçim • Kader"],
    ["Mavelya", "Zaman Akışı Uzmanı", "Kısa, orta ve ileri dönem temalarını ayrı katmanlarda ele alır.", "Zaman • Dönem • Plan"],
    ["Asterelle", "Dönüm Noktası Okuyucusu", "Hayattaki eşik ve karar anlarını belirginleştiren işaretlere odaklanır.", "Dönüm Noktası • Karar • İşaret"],
    ["Vespera", "Olasılık Yorumcusu", "Tek sonuç yerine öne çıkan olasılıkları ve hazırlık önerilerini sunar.", "Olasılık • Hazırlık • Seçim"],
  ],
  daily: [
    ["Liora", "Günün Işığı", "Günün ana temasını, fırsatını ve dikkat edilmesi gereken yönünü yorumlar.", "Günlük • Fırsat • Dikkat"],
    ["Nimara", "Ay Işığı Yorumcusu", "Duygusal ton, iletişim ve gün içindeki küçük işaretleri öne çıkarır.", "Duygu • İletişim • İşaret"],
    ["Elaris", "Günlük Sezgi", "Bugünün temasını kısa ve net bir sembolik anlatımla yorumlar.", "Sezgi • Tema • Öneri"],
    ["Solenne", "Sabah Kehaneti", "Güne başlarken odaklanılacak konu ve olası sürprizleri ele alır.", "Başlangıç • Sürpriz • Odak"],
    ["Vireya", "Gece Yorumcusu", "Günün sonunda yaşananları ve yarına taşınabilecek temaları yorumlar.", "Kapanış • Duygu • Yarın"],
  ],
  dream: [
    ["Somnara", "Rüya Sembol Ustası", "Rüyadaki sembolleri olay örgüsü ve kişisel bağlamla birlikte ele alır.", "Semboller • Bağlam • Duygu"],
    ["Nerissa", "Bilinçaltı Yorumcusu", "Tekrarlayan rüya temalarını, duyguları ve kişisel çağrışımları ayrıştırır.", "Bilinçaltı • Tekrar • Duygu"],
    ["Elyndra", "Rüya Haritası Uzmanı", "Rüyanın başlangıç, kırılma ve sonuç bölümlerini yorumlar.", "Harita • Olay Örgüsü • Anlam"],
    ["Morwenna", "Gece Mesajları Yorumcusu", "Yoğun ve sıra dışı rüyalar için katmanlı yorum sunar.", "Sembol • Mesaj • Gizem"],
    ["Calista", "Kapsamlı Rüya Analisti", "Geleneksel sembol anlamlarını kişisel deneyimle harmanlar.", "Geleneksel • Kişisel • Detay"],
  ],
  astrology: [
    ["Astrelia", "Doğum Haritası Ustası", "Gezegen, ev ve açıları birlikte değerlendirerek kişisel temaları yorumlar.", "Harita • Gezegen • Evler"],
    ["Cyrene", "Transit & Zamanlama Uzmanı", "Dönemsel gökyüzü hareketlerini yaşam alanlarıyla ilişkilendirir.", "Transit • Zamanlama • Dönem"],
    ["Lunaria", "Ay & Duygular Yorumcusu", "Ay göstergeleri ve ilişki temalarını öne çıkarır.", "Ay • Duygu • İlişki"],
    ["Solmeya", "Kariyer Astrolojisi", "10. ev ve dönemsel göstergeler üzerinden kariyer temalarını yorumlar.", "Kariyer • Başarı • Transit"],
    ["Vesperine", "Derin Harita Analisti", "Haritanın ana eksenlerini, açılarını ve baskın temalarını bütünsel okur.", "Derin Harita • Açılar • Temalar"],
  ],
  numerology: [
    ["Numeria", "Sayıların Sesi", "Yaşam yolu, ifade ve kişisel yıl sayılarını birlikte yorumlar.", "Yaşam Yolu • Sayılar • Döngü"],
    ["Zeraphine", "Kader Sayısı Uzmanı", "Doğum tarihindeki sayı örüntülerini dönemsel temalarla eşleştirir.", "Kader • Döngü • Zaman"],
    ["Avelisse", "İsim & Sayı Yorumcusu", "İsim titreşimi ile doğum sayılarının sembolik kesişimini inceler.", "İsim • Ruh • İfade"],
    ["Calveria", "Kişisel Döngü Analisti", "Kişisel yıl ve ay döngülerini karar dönemleriyle birlikte ele alır.", "Döngü • Karar • Zaman"],
    ["Mireth", "Derin Numeroloji", "Sayılar arasındaki tekrarları ve güçlü temaları uzun formatta yorumlar.", "Derinlik • Tekrar • Potansiyel"],
  ],
  general: [
    ["Oraclea", "Tek Soru Yorumcusu", "Tek soruyu netleştirip seçenekleri, engelleri ve yönleri ele alır.", "Tek Soru • Sezgi • Karar"],
    ["Mystara", "Sezgisel Danışman", "Karmaşık bir sorunun duygusal ve pratik katmanlarını ayırır.", "Sezgi • Bağlam • Netlik"],
    ["Evadore", "Karar Haritası Uzmanı", "İki veya daha fazla seçenek arasında kalan sorulara yapılandırılmış yorum sunar.", "Karar • Seçenek • Yol"],
    ["Seraphel", "Gizli İşaretler Yorumcusu", "Sorunun altında kalan kaygı, beklenti ve dikkat noktalarını ortaya çıkarır.", "İşaret • Duygu • Engel"],
    ["Velmora", "Derin Soru Analisti", "Soruyu geçmiş bağlam, mevcut durum ve sonraki adımlar olarak katmanlandırır.", "Derin • Bağlam • Eylem"],
  ],
  tarot: [
    ["Tarotella", "Kartların Sesi", "Kart, pozisyon ve kombinasyonları birlikte okuyarak açılımı bütünleştirir.", "Kombinasyon • Aşk • Gelecek"],
    ["Arcanessa", "Büyük Arkana Ustası", "Büyük Arkana kartlarının dönüşüm ve karar temalarını öne çıkarır.", "Arkana • Dönüşüm • Karar"],
    ["Noctara", "Gölge & Işık Tarot", "Ters ve düz kartları karşılaştırarak görünür ve gizli temaları yorumlar.", "Ters Kart • Gölge • Bilinç"],
    ["Elowena", "Açılım Haritacısı", "Çok kartlı açılımlarda kartlar arasındaki hikâyeyi kurar.", "Açılım • Hikâye • Bağlantı"],
    ["Zoryelle", "Kader Yolu Tarot", "Soruyu merkez alıp kartların zaman ve yön ilişkisini katmanlı yorumlar.", "Yol • Zaman • Olasılık"],
  ],
  katina: [
    ["Katinara", "Kalp Kartları Ustası", "Katina kartlarını ilişki dinamikleri ve duygusal bağlam üzerinden yorumlar.", "Aşk • Katina • Hisler"],
    ["Melisandra", "İlişki Açılımı Uzmanı", "Bağlanma, iletişim ve engel kartlarını birlikte ele alır.", "İletişim • Engel • Bağ"],
    ["Ravena", "Katina Sezgisi", "Kartların ardışıklığını ve tekrar eden ilişki sembollerini öne çıkarır.", "Sezgi • Sembol • Gelecek"],
    ["Elisara", "Barışma & Yakınlaşma", "Geçmiş bağlar, yeniden iletişim ve ilişkinin yönüne odaklanır.", "Barışma • Geçmiş • İletişim"],
    ["Zeloria", "Derin Katina", "Uzun açılımlarda kart kümelerini ilişki hikâyesi olarak birleştirir.", "Derin • Kümeler • Gelecek"],
  ],
  lenormand: [
    ["Lenoria", "Kart Zinciri Ustası", "Kart ikilileri ve zincirleri üzerinden olayların sembolik akışını yorumlar.", "Kart Zinciri • Olay • Zaman"],
    ["Mirelle", "Lenormand Sezgisi", "Yakın gelecek için kısa ve net kart kombinasyonları kurar.", "Yakın Gelecek • Kombinasyon • Netlik"],
    ["Seravine", "İlişki Lenormand", "İlişki sembollerinin birlikte oluşturduğu anlamı inceler.", "İlişki • İletişim • Bağ"],
    ["Valkyra", "Kariyer Lenormand", "İş, haber, yol ve fırsat kartlarını birlikte yorumlar.", "Kariyer • Haber • Fırsat"],
    ["Orlena", "Derin Lenormand", "Kart zincirlerini konu, zaman ve sonuç katmanlarıyla ayrıntılandırır.", "Derin • Zaman • Sonuç"],
  ],
  angel: [
    ["Angeliquea", "Melek Mesajları", "Kart mesajlarını güncel yaşam bağlamına çevirerek destekleyici yorum sunar.", "Mesaj • Destek • Umut"],
    ["Seraphina", "Koruyucu Rehber", "Korunma, cesaret ve içsel güç temalarını ana mesajla birleştirir.", "Koruma • Cesaret • Güç"],
    ["Aureline", "Şifa & Denge Yorumcusu", "Duygusal yük, sınırlar ve iç denge temalarını öne çıkarır.", "Denge • Şifa • Sınırlar"],
    ["Celestine", "İlham Kartları Ustası", "Yeni başlangıçlar ve karar dönemlerinde ilham veren temaları yorumlar.", "İlham • Başlangıç • Karar"],
    ["Miravelle", "Derin Melek Açılımı", "Kartları mesaj, engel, destek ve eylem başlıklarıyla bütünleştirir.", "Derin • Engel • Eylem"],
  ],
};

const prices = [10, 13, 16, 19, 24] as const;
const etas = [3, 4, 5, 6, 8] as const;
const ratings = [4.9, 4.8, 4.9, 4.7, 4.8] as const;
const counts = [12480, 8920, 15760, 6480, 11020] as const;
const statuses = ["online", "busy", "online", "offline", "online"] as const;
const voiceCredits = [5, 6, 7, 8, 10] as const;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeCommentator(kind: FortuneKind, seed: Seed, index: number): DigitalCommentator {
  const [name, title, description, specialties] = seed;
  const id = `${kind}-${slugify(name)}`;
  return {
    id,
    name,
    title,
    specialties: [kind],
    rating: ratings[index],
    readingCount: counts[index],
    etaMinutes: etas[index],
    priceCredits: prices[index],
    voiceCredits: voiceCredits[index],
    availability: statuses[index],
    description: `${description} ${specialties}.`,
    verified: true,
    // Non-Tarot characters use the same first-party avatar endpoint everywhere.
    // Tarot avatars are overridden by the Tarot picker and remain untouched.
    avatarUrl: kind === "tarot" ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(id)}&backgroundColor=161326` : `/api/fal/avatar?id=${encodeURIComponent(id)}`,
  };
}

export const DIGITAL_COMMENTATORS: DigitalCommentator[] = (Object.entries(roster) as [FortuneKind, Seed[]][]).flatMap(([kind, seeds]) =>
  seeds.map((seed, index) => makeCommentator(kind, seed, index)),
);

export const FORTUNE_PRODUCTS: Record<FortuneKind, {
  label: string;
  baseCredits: number;
  defaultDelaySeconds: number;
  methods: string[];
}> = {
  coffee: { label: "Kahve Falı", baseCredits: 10, defaultDelaySeconds: 180, methods: ["telve şekli", "fincan bölgesi", "yakınlık-uzaklık", "sembol kümeleri", "zaman akışı"] },
  love: { label: "Aşk Falı", baseCredits: 10, defaultDelaySeconds: 45, methods: ["ilişki bağlamı", "duygu-davranış ayrımı", "iletişim", "engel", "yakın dönem"] },
  money: { label: "Para Falı", baseCredits: 10, defaultDelaySeconds: 45, methods: ["gelir akışı", "fırsat", "risk", "beklenen ödeme", "düzen"] },
  career: { label: "Kariyer Falı", baseCredits: 10, defaultDelaySeconds: 45, methods: ["rol", "başvuru", "görüşme", "görünürlük", "karar"] },
  future: { label: "Gelecek Falı", baseCredits: 7, defaultDelaySeconds: 45, methods: ["işaret", "olasılık", "yakın dönem", "sonraki adım", "hazırlık"] },
  daily: { label: "Günlük Fal", baseCredits: 3, defaultDelaySeconds: 15, methods: ["günün teması", "fırsat", "dikkat", "duygusal ton", "öneri"] },
  dream: { label: "Rüya Yorumu", baseCredits: 7, defaultDelaySeconds: 45, methods: ["sembol", "duygu", "bağlam", "tekrar", "kişisel çağrışım"] },
  astrology: { label: "Doğum Haritası", baseCredits: 15, defaultDelaySeconds: 60, methods: ["gezegen", "ev", "açı", "yönetici", "dönemsel tema"] },
  numerology: { label: "Numeroloji", baseCredits: 8, defaultDelaySeconds: 45, methods: ["yaşam yolu", "ifade", "ruh dürtüsü", "döngü", "kişisel yıl"] },
  general: { label: "Falcıya Sor", baseCredits: 8, defaultDelaySeconds: 30, methods: ["soru çerçevesi", "duygusal bağlam", "seçenekler", "engel", "eylem önerisi"] },
  tarot: { label: "Tarot", baseCredits: 5, defaultDelaySeconds: 30, methods: ["kart", "pozisyon", "ters/düz", "kombinasyon", "soru"] },
  katina: { label: "Katina Aşk", baseCredits: 15, defaultDelaySeconds: 45, methods: ["kart", "pozisyon", "ilişki dinamiği", "engel", "olasılık"] },
  lenormand: { label: "Lenormand", baseCredits: 10, defaultDelaySeconds: 30, methods: ["kart ikilileri", "kart zinciri", "zaman", "konu", "sonuç"] },
  angel: { label: "Melek Kartları", baseCredits: 8, defaultDelaySeconds: 30, methods: ["mesaj", "tema", "engel", "destek", "eylem"] },
};

export function getFortuneProduct(kind: string) {
  return FORTUNE_PRODUCTS[kind as FortuneKind] ?? null;
}

export function commentatorsFor(kind: FortuneKind) {
  return DIGITAL_COMMENTATORS.filter((commentator) => commentator.specialties.includes(kind));
}
