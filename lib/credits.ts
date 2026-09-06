export type CreditPackage = {
  id: string;
  credits: number;
  priceTry: number;
  bonus: number;
  label: string;
  popular?: boolean;
};

export const CREDIT_PACKAGES: readonly CreditPackage[] = [
  { id: "credits-50", credits: 50, priceTry: 50, bonus: 0, label: "Başlangıç" },
  { id: "credits-120", credits: 120, priceTry: 100, bonus: 20, label: "En çok tercih edilen", popular: true },
  { id: "credits-250", credits: 250, priceTry: 200, bonus: 50, label: "Avantajlı" },
  { id: "credits-700", credits: 700, priceTry: 500, bonus: 200, label: "Büyük paket" },
  { id: "credits-1500", credits: 1500, priceTry: 1000, bonus: 500, label: "En avantajlı" },
] as const;

export const WELCOME_CREDITS = 50;

export function getCreditPackage(id: string) {
  return CREDIT_PACKAGES.find((item) => item.id === id) ?? null;
}

export function formatTry(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
