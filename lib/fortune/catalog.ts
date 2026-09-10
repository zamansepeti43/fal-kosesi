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
};

export const DIGITAL_COMMENTATORS: DigitalCommentator[] = [
  {
    id: "ada",
    name: "Ada",
    title: "Sembol & Kahve Uzmanı",
    specialties: ["coffee", "love", "future", "general"],
    rating: 4.9,
    readingCount: 12840,
    etaMinutes: 3,
    priceCredits: 10,
    voiceCredits: 5,
    availability: "online",
    description: "Fincan şekilleri, sembol konumları ve ilişki odaklı okumaları birleştirir.",
    verified: true,
  },
  {
    id: "mira",
    name: "Mira",
    title: "Aşk & İlişki Yorumcusu",
    specialties: ["love", "tarot", "katina", "future"],
    rating: 4.9,
    readingCount: 10426,
    etaMinutes: 4,
    priceCredits: 15,
    voiceCredits: 6,
    availability: "online",
    description: "Hisler, iletişim, barışma ve ilişki yönü üzerine derinleştirir.",
    verified: true,
  },
  {
    id: "lale",
    name: "Lale",
    title: "Tarot & Yol Haritası",
    specialties: ["tarot", "career", "money", "future"],
    rating: 4.8,
    readingCount: 9650,
    etaMinutes: 5,
    priceCredits: 15,
    voiceCredits: 6,
    availability: "online",
    description: "Kartın tek başına anlamından çok açılımın tamamındaki ilişkileri okur.",
    verified: true,
  },
  {
    id: "selin",
    name: "Selin",
    title: "Rüya & Bilinçaltı",
    specialties: ["dream", "general", "future"],
    rating: 4.8,
    readingCount: 7821,
    etaMinutes: 4,
    priceCredits: 8,
    voiceCredits: 5,
    availability: "busy",
    description: "Rüyadaki sembolleri bağlam, duygu ve tekrar eden temalarla yorumlar.",
    verified: true,
  },
  {
    id: "derin",
    name: "Derin",
    title: "Numeroloji & Yıldızname",
    specialties: ["numerology", "astrology", "future"],
    rating: 4.7,
    readingCount: 6432,
    etaMinutes: 6,
    priceCredits: 12,
    voiceCredits: 6,
    availability: "online",
    description: "Doğum verilerini dönemsel temalar ve kişisel sayı döngüleriyle eşleştirir.",
    verified: true,
  },
];

export const FORTUNE_PRODUCTS: Record<FortuneKind, {
  label: string;
  baseCredits: number;
  defaultDelaySeconds: number;
  methods: string[];
}> = {
  coffee: {
    label: "Kahve Falı",
    baseCredits: 10,
    defaultDelaySeconds: 180,
    methods: ["telve şekli", "fincan bölgesi", "yakınlık-uzaklık", "sembol kümeleri", "zaman akışı"],
  },
  love: {
    label: "Aşk Falı",
    baseCredits: 10,
    defaultDelaySeconds: 45,
    methods: ["ilişki bağlamı", "duygu-davranış ayrımı", "iletişim", "engel", "yakın dönem"],
  },
  money: {
    label: "Para Falı",
    baseCredits: 10,
    defaultDelaySeconds: 45,
    methods: ["gelir akışı", "fırsat", "risk", "beklenen ödeme", "düzen"],
  },
  career: {
    label: "Kariyer Falı",
    baseCredits: 10,
    defaultDelaySeconds: 45,
    methods: ["rol", "başvuru", "görüşme", "görünürlük", "karar"],
  },
  future: {
    label: "Gelecek Falı",
    baseCredits: 7,
    defaultDelaySeconds: 45,
    methods: ["işaret", "olasılık", "yakın dönem", "sonraki adım", "hazırlık"],
  },
  daily: {
    label: "Günlük Fal",
    baseCredits: 3,
    defaultDelaySeconds: 15,
    methods: ["günün teması", "fırsat", "dikkat", "duygusal ton", "öneri"],
  },
  dream: {
    label: "Rüya Yorumu",
    baseCredits: 7,
    defaultDelaySeconds: 45,
    methods: ["sembol", "duygu", "bağlam", "tekrar", "kişisel çağrışım"],
  },
  astrology: {
    label: "Doğum Haritası",
    baseCredits: 15,
    defaultDelaySeconds: 60,
    methods: ["gezegen", "ev", "açı", "yönetici", "dönemsel tema"],
  },
  numerology: {
    label: "Numeroloji",
    baseCredits: 8,
    defaultDelaySeconds: 45,
    methods: ["yaşam yolu", "ifade", "ruh dürtüsü", "döngü", "kişisel yıl"],
  },
  general: {
    label: "Falcıya Sor",
    baseCredits: 8,
    defaultDelaySeconds: 30,
    methods: ["soru çerçevesi", "duygusal bağlam", "seçenekler", "engel", "eylem önerisi"],
  },
  tarot: {
    label: "Tarot",
    baseCredits: 5,
    defaultDelaySeconds: 30,
    methods: ["kart", "pozisyon", "ters/düz", "kombinasyon", "soru"],
  },
  katina: {
    label: "Katina Aşk",
    baseCredits: 15,
    defaultDelaySeconds: 45,
    methods: ["kart", "pozisyon", "ilişki dinamiği", "engel", "olasılık"],
  },
  lenormand: {
    label: "Lenormand",
    baseCredits: 10,
    defaultDelaySeconds: 30,
    methods: ["kart ikilileri", "kart zinciri", "zaman", "konu", "sonuç"],
  },
  angel: {
    label: "Melek Kartları",
    baseCredits: 8,
    defaultDelaySeconds: 30,
    methods: ["mesaj", "tema", "engel", "destek", "eylem"],
  },
};

export function getFortuneProduct(kind: string) {
  return FORTUNE_PRODUCTS[kind as FortuneKind] ?? null;
}

export function commentatorsFor(kind: FortuneKind) {
  return DIGITAL_COMMENTATORS.filter((commentator) => commentator.specialties.includes(kind));
}
