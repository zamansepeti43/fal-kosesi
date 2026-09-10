import type { TarotCard } from "@/types/tarot";
import { tarotCards as majorCards } from "@/lib/tarot/cards";

export type TarotDeckCard = TarotCard & {
  arcana: "major" | "minor";
  suit: "Major Arcana" | "Asalar" | "Kupalar" | "Kılıçlar" | "Pentakıllar";
  number: number;
  code: string;
  imageUrl: string;
  reversedMeaning: string;
};

const API_BASE = "https://petaloverflow.github.io/tarot-api/cards";

const majorCodes = [
  "ar00","ar01","ar02","ar03","ar04","ar05","ar06","ar07","ar08","ar09","ar10","ar11","ar12","ar13","ar14","ar15","ar16","ar17","ar18","ar19","ar20","ar21",
] as const;

const majorKeywords = [
  ["başlangıç","özgürlük","cesaret"],["yetenek","iletişim","inisiyatif"],["sezgi","gizem","gözlem"],["bolluk","sevgi","üretkenlik"],["düzen","güç","sınır"],["değerler","rehberlik","ciddiyet"],["aşk","seçim","uyum"],["irade","hareket","zafer"],["sabır","cesaret","denge"],["içe dönüş","bilgelik","netlik"],["değişim","döngü","fırsat"],["denge","hakikat","karar"],["bekleme","perspektif","değişim"],["dönüşüm","kapanış","yenilenme"],["uyum","iyileşme","sabır"],["bağ","gölge","özgürleşme"],["sarsıntı","gerçek","yeniden kurma"],["umut","ilham","iyileşme"],["belirsizlik","rüya","sezgi"],["başarı","neşe","açıklık"],["uyanış","karar","yenilenme"],["tamamlanma","bütünlük","yolculuk"],
] as const;

const suits = [
  { key: "wands", label: "Asalar" as const, prefix: "wa", icon: "🔥", theme: "eylem, tutku, girişim" },
  { key: "cups", label: "Kupalar" as const, prefix: "cu", icon: "💧", theme: "duygular, ilişkiler, bağ" },
  { key: "swords", label: "Kılıçlar" as const, prefix: "sw", icon: "⚔️", theme: "zihin, karar, iletişim" },
  { key: "pentacles", label: "Pentakıllar" as const, prefix: "pe", icon: "🪙", theme: "para, beden, emek, güven" },
];

const ranks = ["As","2","3","4","5","6","7","8","9","10","Vale","Şövalye","Kraliçe","Kral"] as const;

const rankTheme: Record<string, string> = {
  As: "başlangıç ve potansiyel",
  "2": "denge ve seçim",
  "3": "gelişim ve işbirliği",
  "4": "istikrar ve sınır",
  "5": "gerilim ve değişim",
  "6": "destek ve ilerleme",
  "7": "sınav ve strateji",
  "8": "hareket ve yoğunlaşma",
  "9": "olgunlaşma ve direnç",
  "10": "tamamlanma ve yük",
  Vale: "haber ve öğrenme",
  Şövalye: "hareket ve girişim",
  Kraliçe: "ustalık ve içgörü",
  Kral: "otorite ve yönetim",
};

function genericMeaning(suit: (typeof suits)[number], rank: string) {
  return `${suit.theme} alanında ${rankTheme[rank]}. Bu kart, konunun hangi yönde geliştiğini ve senin hangi seçimi daha bilinçli yapabileceğini düşünmek için sembolik bir çerçeve sunar.`;
}

function genericLove(suit: (typeof suits)[number], rank: string) {
  return `${suit.label} ${rank} kartı duygusal alanda ${rankTheme[rank]} temasını öne çıkarır. İlişkide davranışların, beklentilerin ve açık iletişimin birbirini nasıl etkilediğine bak.`;
}

function genericCareer(suit: (typeof suits)[number], rank: string) {
  return `${suit.label} ${rank} kartı iş tarafında ${rankTheme[rank]} temasını vurgular. Fırsat kadar sorumluluk ve uygulamaya dönük adım da önemlidir.`;
}

export const tarotFullDeck: TarotDeckCard[] = [
  ...majorCodes.map((code, index) => {
    const source = majorCards[index];
    return {
      ...source,
      arcana: "major" as const,
      suit: "Major Arcana" as const,
      number: index,
      code,
      imageUrl: `${API_BASE}/${code}.jpg`,
      reversedMeaning: `Bu kartın gölge tarafı ${source.keywords[0]} temasının dengesiz veya gecikmiş biçimde yaşanmasına işaret edebilir. Kesin bir sonuç değil, aynı temaya farklı bir açıdan bakma davetidir.`,
    };
  }),
  ...suits.flatMap((suit) => ranks.map((rank, index) => {
    const code = `${suit.prefix}${String(index + 1).padStart(2, "0")}`;
    const name = `${rank} ${suit.label}`;
    const keywords = [rankTheme[rank], suit.theme.split(", ")[0], suit.theme.split(", ")[1] ?? "tema"];
    return {
      id: `${suit.key}-${index + 1}`,
      name,
      meaning: genericMeaning(suit, rank),
      love: genericLove(suit, rank),
      career: genericCareer(suit, rank),
      keywords,
      arcana: "minor" as const,
      suit: suit.label,
      number: index + 1,
      code,
      imageUrl: `${API_BASE}/${code}.jpg`,
      reversedMeaning: `Ters geldiğinde ${rankTheme[rank]} temasının bloke olmuş, aşırıya kaçmış veya içe dönmüş tarafını düşün. ${suit.theme} alanında dengeyi yeniden kurmak önemli olabilir.`,
    };
  })),
];

export const TAROT_DECK_COUNT = tarotFullDeck.length;
