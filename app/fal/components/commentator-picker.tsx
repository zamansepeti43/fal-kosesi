"use client";

import { Clock3, Star, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FortuneKind } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string; bio?: string | null };
type Props = { kind: FortuneKind; selectedId?: string | null; onSelect: (commentator: Commentator | null) => void };

function characterAvatar(id: string) {
  return `/api/fal/avatar?id=${encodeURIComponent(id)}&v=3d-human-2`;
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
    const availabilityScore = (x: Commentator) => x.availability === "online" ? 30 : x.availability === "busy" ? 10 : 0;
    return (availabilityScore(b) + b.rating * 8 - b.priceCredits * 0.45 - b.etaMinutes * 0.8)
      - (availabilityScore(a) + a.rating * 8 - a.priceCredits * 0.45 - a.etaMinutes * 0.8);
  })[0] ?? null, [visible]);

  const chooseRecommended = () => {
    if (recommended) onSelect(recommended);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-black/20 p-3 shadow-xl sm:p-5">
      <div className="mb-4 text-center">
        <p className="font-serif text-xl font-bold text-white">Sana eşlik edecek karakteri seç ✨</p>
        <p className="mx-auto mt-1 max-w-lg text-[10px] leading-5 text-slate-500">
          Her karakter farklı bir yorum tarzına sahip sanal AI karakteridir; gerçek kişi değildir.
        </p>
      </div>

      <button
        type="button"
        onClick={chooseRecommended}
        className={`mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
          recommended?.id === selectedId
            ? "border-amber-300/70 bg-amber-300/[.09]"
            : "border-amber-200/25 bg-gradient-to-r from-amber-300/[.10] to-violet-400/[.07] hover:border-amber-200/45"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-200/20 bg-amber-200/10 text-amber-200">
            <Zap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-white">Bana en uygun karakteri seç</p>
            <p className="mt-0.5 truncate text-[9px] text-slate-400">
              {recommended ? `${recommended.name} · ${recommended.priceCredits} kredi · ${recommended.etaMinutes} dk` : "Uygun karakter aranıyor…"}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200/20 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-amber-200">Önerilen</span>
      </button>

      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {visible.map((item, index) => {
          const isSelected = selectedId === item.id;
          const isRecommended = item.id === recommended?.id;
          const centeredStart = index === 3 ? "col-start-2" : index === 4 ? "col-start-4" : "";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={isSelected}
              className={`group relative col-span-2 ${centeredStart} rounded-[22px] border p-2 text-left transition duration-300 sm:p-3 ${
                isSelected
                  ? "border-amber-300/70 bg-amber-300/[.08] shadow-[0_0_28px_rgba(251,191,36,.10)] -translate-y-0.5"
                  : "border-white/8 bg-white/[.025] hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/[.045]"
              }`}
            >
              {isRecommended && <span className="absolute left-2 top-2 z-10 rounded-full border border-amber-200/20 bg-[#17111e]/90 px-2 py-1 text-[7px] font-black uppercase tracking-wider text-amber-200">Önerilen</span>}
              <div className="relative aspect-[.78] overflow-hidden rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,.14),transparent_65%),#100d18]">
                <img src={characterAvatar(item.id)} alt={`${item.name} 3D sanal tarot karakteri`} loading="eager" className="h-full w-full object-contain px-1 pt-1 transition duration-500 group-hover:scale-[1.035]" />
                <span className="absolute bottom-1.5 right-1.5 rounded-full border border-white/10 bg-black/75 px-1.5 py-0.5 text-[7px] font-black tracking-wider text-white">AI</span>
                {isSelected && <span className="absolute right-1.5 top-1.5 rounded-full bg-amber-300 px-2 py-1 text-[7px] font-black uppercase text-slate-950">Seçildi</span>}
              </div>

              <div className="px-0.5 pb-0.5 pt-2">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-sm font-bold text-white sm:text-base">{item.name}</p>
                    <p className="mt-0.5 truncate text-[9px] font-medium text-violet-200">{item.title}</p>
                  </div>
                  <strong className="shrink-0 text-[10px] font-black text-amber-200">{item.priceCredits} kr.</strong>
                </div>

                <p className="mt-2 line-clamp-2 min-h-[30px] text-[9px] leading-4 text-slate-400">{item.description}</p>

                <div className="mt-2 flex items-center justify-between gap-1 border-t border-white/5 pt-2 text-[8px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><Star className="h-2.5 w-2.5 fill-current text-amber-300" />{item.rating}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-2.5 w-2.5" />{item.etaMinutes} dk</span>
                  <span className={item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}>
                    ● {availabilityLabel(item.availability)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] text-slate-500">
        <span>⚡ Hızlı seçim</span>
        <span>✦ 78 kartlık deste</span>
        <span>🔒 Ödeme adımına kadar ücret alınmaz</span>
      </div>
    </div>
  );
}
