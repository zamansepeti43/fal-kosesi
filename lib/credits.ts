export type CreditPackage = {
  id: string;
  credits: number;
  priceTry: number;
  bonus: number;
  label: string;
  popular?: boolean;
};

/**
 * Public credit catalog. `credits` is the total balance granted after purchase;
 * `bonus` is shown separately only as the promotional portion of that total.
 * Prices are integer TRY amounts so the same catalog is used by the UI and
 * the server-side checkout/order creation code.
 */
export const CREDIT_PACKAGES: readonly CreditPackage[] = [
  { id: "credits-50", credits: 50, priceTry: 50, bonus: 0, label: "Başlangıç" },
  { id: "credits-120", credits: 120, priceTry: 100, bonus: 20, label: "En çok tercih edilen", popular: true },
  { id: "credits-250", credits: 250, priceTry: 200, bonus: 50, label: "Avantajlı" },
  { id: "credits-700", credits: 700, priceTry: 500, bonus: 200, label: "Büyük paket" },
  { id: "credits-1500", credits: 1500, priceTry: 1000, bonus: 500, label: "En avantajlı" },
] as const;

export const WELCOME_CREDITS = 50;

export const READING_COSTS: Record<string, number> = {
  coffee: 10,
  love: 10,
  money: 10,
  career: 10,
  future: 7,
  dream: 7,
  astrology: 15,
  numerology: 8,
  daily: 3,
  focus: 8,
  tarot_single: 5,
  tarot_three: 12,
  tarot_love: 15,
  tarot_career: 15,
  tarot_money: 15,
};

export function getCreditPackage(id: string) {
  return CREDIT_PACKAGES.find((item) => item.id === id) ?? null;
}

export function getEffectiveCreditPrice(pack: CreditPackage) {
  return pack.priceTry / pack.credits;
}

export function formatTry(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCreditUnitPrice(pack: CreditPackage) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(getEffectiveCreditPrice(pack));
}
