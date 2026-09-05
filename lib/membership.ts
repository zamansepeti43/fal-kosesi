export type MembershipTier = "guest" | "member" | "plus" | "pro" | "premium" | "weekly" | "monthly";
export type PlanCycle = "weekly" | "monthly" | "unlimited";

export type MemberRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  plan: string;
  status: string;
  memberSince: string;
  renewalDate: string;
  readings: number;
  favorites: number;
  streak: number;
  lastReading: string;
  premium: boolean;
  membership: MembershipTier;
  freeReadingsLeft: number;
  planCycle?: PlanCycle;
};

export const MEMBER_STORAGE_KEY = "fal-kosesi-user";

export function createMember(name: string, email: string, phone: string): MemberRecord {
  const now = new Date();
  const started = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const renewal = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30 * 6).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    id: `${Date.now()}`,
    name: name.trim() || email.split("@")[0] || "Üye",
    email: email.trim().toLowerCase(),
    phone: phone.trim() || "+90 5xx xxx xx xx",
    location: "İstanbul, Türkiye",
    plan: "Normal Üye",
    status: "Üye",
    memberSince: started,
    renewalDate: renewal,
    readings: 0,
    favorites: 0,
    streak: 0,
    lastReading: "Henüz fal bakılmadı",
    premium: false,
    membership: "member",
    freeReadingsLeft: 1,
    planCycle: "weekly",
  };
}

export function getStoredMember(): MemberRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(MEMBER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MemberRecord;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMember(member: MemberRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(member));
}

export function isSignedInMember(member: MemberRecord | null) {
  return Boolean(member?.email && member.membership !== "guest");
}

export function canUseFal(member: MemberRecord | null) {
  if (!member || !isSignedInMember(member)) return false;

  if (member.membership === "member") {
    return member.freeReadingsLeft > 0;
  }

  if (["plus", "pro", "premium", "weekly", "monthly"].includes(member.membership)) {
    return true;
  }

  return false;
}

export function consumeFreeReading(member: MemberRecord | null): MemberRecord | null {
  if (!member) return null;

  if (member.membership === "member" && member.freeReadingsLeft > 0) {
    const next = {
      ...member,
      freeReadingsLeft: Math.max(0, member.freeReadingsLeft - 1),
      readings: member.readings + 1,
      lastReading: "Bugün ücretsiz fal okuması kullanıldı",
    };

    if (next.freeReadingsLeft <= 0) {
      next.plan = "Ücretli üyelik gerekli";
    }

    return next;
  }

  if (["plus", "pro", "premium", "weekly", "monthly"].includes(member.membership)) {
    return {
      ...member,
      readings: member.readings + 1,
      lastReading: "Premium fal okuması tamamlandı",
    };
  }

  return member;
}

export function applyPlan(
  member: MemberRecord,
  tier: MembershipTier | "weekly" | "monthly",
  cycle: PlanCycle = "monthly",
) {
  const normalizedTier = tier === "weekly" || tier === "monthly" ? (tier === "weekly" ? "plus" : "pro") : tier;

  const planMap: Record<string, Partial<MemberRecord>> = {
    plus: {
      plan: cycle === "weekly" ? "Plus - Haftalık" : "Plus - Aylık",
      premium: true,
      status: "Aktif",
      membership: "plus",
      freeReadingsLeft: 0,
      planCycle: cycle,
    },
    pro: {
      plan: cycle === "weekly" ? "Pro - Haftalık" : "Pro - Aylık",
      premium: true,
      status: "Aktif",
      membership: "pro",
      freeReadingsLeft: 0,
      planCycle: cycle,
    },
    premium: {
      plan: "Premium - Sınırsız",
      premium: true,
      status: "Aktif",
      membership: "premium",
      freeReadingsLeft: 0,
      planCycle: "unlimited",
    },
    weekly: {
      plan: "Haftalık Üyelik",
      premium: true,
      status: "Aktif",
      membership: "weekly",
      freeReadingsLeft: 0,
      planCycle: "weekly",
    },
    monthly: {
      plan: "Aylık Üyelik",
      premium: true,
      status: "Aktif",
      membership: "monthly",
      freeReadingsLeft: 0,
      planCycle: "monthly",
    },
  };

  const nextPlan = planMap[normalizedTier] ?? planMap.plus;

  return {
    ...member,
    ...nextPlan,
    renewalDate: new Date(Date.now() + (cycle === "weekly" ? 7 : cycle === "unlimited" ? 30 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}
