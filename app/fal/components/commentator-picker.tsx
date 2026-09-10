"use client";

import { Clock3, Star, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FortuneKind } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string; bio?: string | null };
type Props = { kind: FortuneKind; selectedId?: string | null; onSelect: (commentator: Commentator | null) => void };

const AVATAR_INDEX: Record<string, number> = {
  "tarot-tarotella": 0,
  "tarot-arcanessa": 1,
  "tarot-noctara": 2,
  "tarot-elowena": 3,
  "tarot-zoryelle": 4,
};

function avatarPosition(id: string) {
  const index = AVATAR_INDEX[id] ?? 0;
  return `${index * 25}% center`;
}

function availabilityLabel(status: Commentator["availability"]) {
  if (status === "online") return "Şimdi hazır";
  if (status === "busy") return "Yoğun ama açık";
  return "Şu an çevrimdışı";
}

export default function CommentatorPicker({ kind, selectedId, onSelect }: Props) {
  const [items, setItems] = useState<Commentator[]>(DIGITAL_COMMENTATORS.filter((item) => item.specialties.includes(kind)));

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/fal/commentators?kind=${encodeURIComponent(kind)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!cancelled && Array.isArray(data?.commentators) && data.commentators.length) setItems(data.commentators);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [kind]);

  const visible = useMemo(() => items.slice(0, 5), [items]);
  const recommended = useMemo(() => [...visible].sort((a, b) => {
    const score = (x: Commentator) => (x.availability === "online" ? 30 : x.availability === "busy" ? 10 : 0) + x.rating * 8 - x.priceCredits * 0.45 - x.etaMinutes * 0.8;
    return score(b) - score(a);
  })[0] ?? null, [visible]);

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/25 p-3 shadow-2xl sm:p-5">
      <div className="mb-5 text-center">
        <p className="font-serif text-2xl font-bold text-white">Sana eşlik edecek karakteri seç ✨</p>
        <p className="mx-auto mt-1 max-w-lg text-[11px] leading-5 text-slate-500">Her karakter farklı bir yorum tarzına sahip sanal AI karakteridir; gerçek kişi değildir.</p>
      </div>

      <button type="button" onClick={() => recommended && onSelect(recommended)} className={`mb-5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${recommended?.id === selectedId ? "border-amber-300/70 bg-amber-300/[.09]" : "border-amber-200/25 bg-gradient-to-r from-amber-300/[.10] to-violet-400/[.07] hover:border-amber-200/45"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-200/20 bg-amber-200/10 text-amber-200"><Zap className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-sm font-black text-white">Bana en uygun karakteri seç</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{recommended ? `${recommended.name} · ${recommended.priceCredits} coin · ${recommended.etaMinutes} dk` : "Uygun karakter aranıyor…"}</p></div>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200/20 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-amber-200">Önerilen</span>
      </button>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {visible.map((item, index) => {
          const isSelected = selectedId === item.id;
          const isRecommended = item.id === recommended?.id;
          const centeredLast = index === 4 ? "col-span-2 mx-auto w-[calc(50%-6px)] sm:col-span-1 sm:col-start-2 sm:mx-0 sm:w-full" : "";
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item)} aria-pressed={isSelected} className={`group relative ${centeredLast} rounded-[24px] border p-2.5 text-left transition duration-300 sm:p-3 ${isSelected ? "-translate-y-0.5 border-amber-300/70 bg-amber-300/[.08] shadow-[0_0_30px_rgba(251,191,36,.12)]" : "border-white/8 bg-white/[.025] hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/[.045]"}`}>
              {isRecommended && <span className="absolute left-3 top-3 z-10 rounded-full border border-amber-200/25 bg-[#17111e]/90 px-2.5 py-1 text-[7px] font-black uppercase tracking-wider text-amber-200">Önerilen</span>}
              <div className="relative aspect-[.88] overflow-hidden rounded-[19px] border border-white/10 bg-[#100d18] shadow-inner">
                <div role="img" aria-label={`${item.name} sanal karakteri`} className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-[1.025]" style={{ backgroundImage: "url('/fortune/avatars/tarot-avatars-sprite.jpg')", backgroundPosition: avatarPosition(item.id) }} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-2 right-2 rounded-full border border-white/10 bg-black/75 px-2 py-1 text-[7px] font-black tracking-wider text-white">AI</span>
                {isSelected && <span className="absolute right-2 top-2 rounded-full bg-amber-300 px-2 py-1 text-[7px] font-black uppercase text-slate-950">Seçildi</span>}
              </div>

              <div className="px-0.5 pb-0.5 pt-3">
                <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="font-serif text-[17px] font-bold leading-tight text-white sm:text-lg">{item.name}</p><p className="mt-1 line-clamp-1 text-[10px] font-semibold text-violet-200">{item.title}</p></div><strong className="shrink-0 pt-0.5 text-[10px] font-black text-amber-200">{item.priceCredits} coin</strong></div>
                <p className="mt-2 line-clamp-2 min-h-[32px] text-[10px] leading-4 text-slate-400">{item.description}</p>
                <div className="mt-3 flex items-center justify-between gap-1 border-t border-white/5 pt-2.5 text-[9px] text-slate-500"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current text-amber-300" />{item.rating}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{item.etaMinutes} dk</span><span className={item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}>● {availabilityLabel(item.availability)}</span></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[9px] text-slate-500"><span>⚡ Hızlı seçim</span><span>✦ 78 kartlık deste</span><span>🔒 Ödeme adımına kadar ücret alınmaz</span></div>
    </div>
  );
}
