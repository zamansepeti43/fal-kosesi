export type TarotCard = {
  id: string | number;
  name: string;
  arcana?: string;
  suit?: string | null;
  meaning: string;
  meaning_reverse?: string;
  love: string;
  career: string;
  keywords: string[];
};

export type TarotSpread = {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: Array<{ id: string; name: string; description: string }>;
};

export const TAROT_SPREADS: TarotSpread[] = [
  { id: "single", name: "1 Kart", description: "Anlık durumun ve bugün dikkat etmen gereken ana mesaj.", cardCount: 1, positions: [{ id: "position", name: "Anlık Durum", description: "Sorunun mevcut enerjisi." }] },
  { id: "two-card", name: "2 Kart", description: "Mevcut durum ve sana yol gösterecek çözüm enerjisi.", cardCount: 2, positions: [{ id: "durum", name: "Durum", description: "Şu anki enerji." }, { id: "cozum", name: "Çözüm", description: "Yol gösteren enerji." }] },
  { id: "three-card", name: "3 Kart", description: "Geçmiş, bugün ve önündeki olası yönü birlikte oku.", cardCount: 3, positions: [{ id: "past", name: "Geçmiş", description: "Bugünü etkileyen iz." }, { id: "present", name: "Bugün", description: "Şu anki mesele." }, { id: "future", name: "Gelecek", description: "Olası yön." }] },
];

export const TAROT_SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
