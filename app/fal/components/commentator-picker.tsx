"use client";

import { Heart, Mic2, Star, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FortuneKind } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string };
type Props = { kind: FortuneKind; selectedId?: string | null; onSelect: (commentator: Commentator | null) => void };

function characterAvatar(id: string) {
  return `/api/fal/avatar?id=${encodeURIComponent(id)}`;
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

  return (
    <div className="rounded-[28px] border border-white/10 bg-black/20 p-3 shadow-xl sm:p-5">
      <div className="mb-4 text-center">
        <p className="font-serif text-xl font-bold text-white">Sana eşlik edecek tarot karakterini seç ✨</p>
        <p className="mx-auto mt-1 max-w-lg text-[10px] leading-5 text-slate-500">
          Her karakter farklı bir yorum tarzına sahip sanal AI karakteridir; gerçek kişi değildir.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {visible.map((item, index) => {
          const isSelected = selectedId === item.id;
          const centeredStart = index === 3 ? "col-start-2" : index === 4 ? "col-start-4" : "";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`group col-span-2 ${centeredStart} rounded-[22px] border p-2.5 text-left transition duration-300 sm:p-3 ${
                isSelected
                  ? "border-amber-300/70 bg-amber-300/[.08] shadow-[0_0_28px_rgba(251,191,36,.10)]"
                  : "border-white/8 bg-white/[.025] hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/[.045]"
              }`}
            >
              <div className="relative aspect-[.88] overflow-hidden rounded-[18px] border border-white/10 bg-[#17111e]">
                <img src={characterAvatar(item.id)} alt={`${item.name} sanal tarot karakteri`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute bottom-1.5 right-1.5 rounded-full border border-white/10 bg-black/70 px-1.5 py-0.5 text-[7px] font-black tracking-wider text-white">AI</span>
                {isSelected && <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-300 px-2 py-1 text-[7px] font-black uppercase text-slate-950">Seçildi</span>}
              </div>
              <div className="px-0.5 pb-0.5 pt-2">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-sm font-bold text-white sm:text-base">{item.name}</p>
                    <p className="mt-0.5 truncate text-[9px] font-medium text-violet-200">{item.title}</p>
                  </div>
                  <strong className="shrink-0 text-[10px] font-black text-amber-200">{item.priceCredits}</strong>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-1 text-[8px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><Star className="h-2.5 w-2.5 fill-current text-amber-300" />{item.rating}</span>
                  <span>{item.etaMinutes} dk</span>
                  <span className={item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-600"}>
                    {item.availability === "online" ? "●" : item.availability === "busy" ? "●" : "●"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition ${
          selectedId === null
            ? "border-amber-300/60 bg-amber-300/[.08] text-amber-100"
            : "border-white/8 bg-white/[.02] text-slate-400 hover:border-white/15"
        }`}
      >
        <Zap className="h-4 w-4" /> Otomatik seçim
        <span className="text-[9px] font-normal text-slate-600">(fiyat, hız ve uygunluğa göre)</span>
      </button>

      {selectedId && (
        <div className="mt-3 flex items-center justify-center gap-3 text-[9px] text-slate-500">
          <span><Mic2 className="mr-1 inline h-3 w-3" />Sesli yorum ayrıca kullanılabilir</span>
          <span><Heart className="mr-1 inline h-3 w-3" />Favoriye ekle</span>
        </div>
      )}
    </div>
  );
}
