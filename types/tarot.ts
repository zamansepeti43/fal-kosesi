export type TarotCard = {
  id: number;
  name: string;
  arcana: string;
  suit: string | null;
  meaning: string;
  meaning_reverse: string;
};

export type TarotSpread = {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: "single",
    name: "1 Kart Seç",
    description: "Anlık durum, netlik ve tek yönlü bir mesaj için ideal düzen.",
    cardCount: 1,
    positions: [
      {
        id: "position",
        name: "Anlık Durum",
        description: "Sorunun şu anki enerjisi ve mevcut durumunu gösterir."
      }
    ]
  },
  {
    id: "two-card",
    name: "2 Kart Seç",
    description: "Durum ile çözüm arasında denge kuran kısa ve net okuma.",
    cardCount: 2,
    positions: [
      {
        id: "durge",
        name: "Durum",
        description: "Şu anki durum ve etkileyen etkenler."
      },
      {
        id: "cozum",
        name: "Çözüm",
        description: "Yol gösteren yön ve çözüm enerjisi."
      }
    ]
  },
  {
    id: "three-card",
    name: "3 Kart Seç",
    description: "Geçmiş, bugün ve gelecek arasında akış oluşturan derin okuma.",
    cardCount: 3,
    positions: [
      {
        id: "past",
        name: "Geçmiş",
        description: "Şu anki durumu etkileyen geçmiş enerjisi."
      },
      {
        id: "present",
        name: "Güncel",
        description: "Şu anki mesele ve mevcut akış."
      },
      {
        id: "future",
        name: "Gelecek",
        description: "İlerleyen yol ve olası sonuç."
      }
    ]
  }
];

export const TAROT_SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
