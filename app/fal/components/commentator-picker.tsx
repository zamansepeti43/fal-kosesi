"use client";

import { Clock3, Star, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FortuneKind } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string; bio?: string | null };
type Props = { kind: FortuneKind; selectedId?: string | null; onSelect: (commentator: Commentator | null) => void };

const TAROT_AVATAR_BY_ID: Record<string, string> = {
  "tarot-tarotella": "tarotella-reference.jpg",
  "tarot-arcanessa": "arcanessa-reference.jpg",
  "tarot-noctara": "noctara-reference.jpg",
  "tarot-elowena": "elowena-reference.jpg",
  "tarot-zoryelle": "zoryelle-reference.jpg",
};

const TAROT_FALLBACK_BY_ID: Record<string, string> = {
  "tarot-tarotella": "tarotella.svg",
  "tarot-arcanessa": "arcanessa.svg",
  "tarot-noctara": "noctara.svg",
  "tarot-elowena": "elowena.svg",
  "tarot-zoryelle": "zoryelle.svg",
};

function characterAvatar(item: Commentator, slot: number) {
  if (item.id.startsWith("tarot-") && TAROT_AVATAR_BY_ID[item.id]) {
    return `/fortune/avatars/${TAROT_AVATAR_BY_ID[item.id]}?v=10`;
  }
  return `/api/fal/avatar?id=${encodeURIComponent(item.id)}&slot=${slot}&v=2`;
}

function characterFallback(item: Commentator) {
  if (item.id.startsWith("tarot-") && TAROT_FALLBACK_BY_ID[item.id]) return `/fortune/avatars/${TAROT_FALLBACK_BY_ID[item.id]}?v=10`;
  return "";
}

function availabilityLabel(status: Commentator["availability"]) {
  if (status === "online") return "Şimdi hazır";
  if (status === "busy") return "Yoğun ama açık";
  return "Şu an çevrimdışı";
}

export default function CommentatorPicker({ kind, selectedId, onSelect }: Props) {
  const [items, setItems] = useState<Commentator[]>([]);
  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/fal/commentators?kind=${encodeURIComponent(kind)}`).then((response) => response.ok ? response.json() : null).then((data) => {
      if (!cancelled && Array.isArray(data?.commentators) && data.commentators.length) setItems(data.commentators);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [kind]);
  const visible = useMemo(() => items.slice(0, 5), [items]);
  const recommended = useMemo(() => [...visible].sort((a, b) => {
    const score = (x: Commentator) => (x.availability === "online" ? 30 : x.availability === "busy" ? 10 : 0) + x.rating * 8 - x.priceCredits * 0.45 - x.etaMinutes * 0.8;
    return score(b) - score(a);
  })[0] ?? null, [visible]);

  return <div className="w-full px-0 py-1">
    <div className="mb-5 text-center"><p className="font-serif text-2xl font-bold text-white">Sana eşlik edecek karakteri seç ✨</p><p className="mx-auto mt-1 max-w-lg text-[11px] leading-5 text-slate-500">Her karakter farklı bir yorum tarzına sahip sanal AI karakteridir; gerçek kişi değildir.</p></div>
    <button type="button" onClick={() => recommended && onSelect(recommended)} className={`mb-5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${recommended?.id === selectedId ? "border-amber-300/70 bg-amber-300/[.09]" : "border-amber-200/25 bg-gradient-to-r from-amber-300/[.10] to-violet-400/[.07] hover:border-amber-200/45"}`}>
      <div className="flex min-w-0 items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-200/20 bg-amber-200/10 text-amber-200"><Zap className="h-5 w-5" /></div><div className="min-w-0"><p className="text-sm font-black text-white">Bana en uygun karakteri seç</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{recommended ? `${recommended.name} · ${recommended.priceCredits} coin · ${recommended.etaMinutes} dk` : "Uygun karakter aranıyor…"}</p></div></div><span className="shrink-0 rounded-full border border-amber-200/20 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-amber-200">ÖNERİLEN</span>
    </button>
    <div className="-mx-1 grid grid-cols-2 items-start gap-4 sm:mx-0 sm:gap-5">
      {visible.map((item, index) => {
        const isSelected = selectedId === item.id;
        const centeredLast = index === 4 ? "col-span-2 mx-auto w-[calc(50%-8px)] sm:col-span-1 sm:col-start-2 sm:mx-0 sm:w-full" : "";
        return <button key={item.id} type="button" onClick={() => onSelect(item)} aria-pressed={isSelected} className={`group relative ${centeredLast} rounded-[24px] border p-2.5 text-left transition duration-300 sm:p-3 ${isSelected ? "-translate-y-0.5 border-amber-300/70 bg-amber-300/[.08] shadow-[0_0_30px_rgba(251,191,36,.12)]" : "border-white/8 bg-white/[.025] hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/[.045]"}`}>
          <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#100d18] shadow-inner">
            <img src={characterAvatar(item, index)} alt={`${item.name} sanal karakteri`} loading="eager" decoding="async" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; const fallback = characterFallback(item); if (fallback) event.currentTarget.src = fallback; else event.currentTarget.style.visibility = "hidden"; }} className="absolute inset-0 block h-full w-full object-cover object-center" />
            {isSelected && <span className="absolute right-2 top-2 rounded-full bg-amber-300 px-2 py-1 text-[7px] font-black uppercase text-slate-950">Seçildi</span>}
          </div>
          <div className="px-0.5 pb-0.5 pt-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="font-serif text-[18px] font-bold leading-tight text-white sm:text-lg">{item.name}</p><p className="mt-1 line-clamp-1 text-[10px] font-semibold text-violet-200">{item.title}</p></div><strong className="shrink-0 pt-0.5 text-[10px] font-black text-amber-200">{item.priceCredits} coin</strong></div><p className="mt-2 line-clamp-2 min-h-[32px] text-[10px] leading-4 text-slate-400">{item.description}</p><div className="mt-3 flex items-center justify-between gap-1 border-t border-white/5 pt-2.5 text-[9px] text-slate-500"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current text-amber-300" />{item.rating}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{item.etaMinutes} dk</span><span className={item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}>● {availabilityLabel(item.availability)}</span></div></div>
        </button>;
      })}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[9px] text-slate-500"><span>⚡ Hızlı seçim</span><span>✦ 78 kartlık deste</span><span>🔒 Ödeme adımına kadar ücret alınmaz</span></div>
  </div>;
}
