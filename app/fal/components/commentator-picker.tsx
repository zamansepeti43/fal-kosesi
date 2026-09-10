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
  const [showAll, setShowAll] = useState(true);

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

  const visible = useMemo(() => showAll ? items.slice(0, 5) : items.slice(0, 3), [items, showAll]);

  return (
    <div className="rounded-[26px] border border-white/10 bg-black/20 p-4 shadow-xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-white">Sanal falcını seç ✨</p>
          <p className="mt-1 text-[10px] leading-5 text-slate-500">Bunlar gerçek kişi değildir. Her karakterin kendine ait yorum tarzı, hız ve kredi bedeli vardır.</p>
        </div>
        {items.length > 3 && <button type="button" onClick={() => setShowAll((value) => !value)} className="shrink-0 text-[10px] font-bold text-violet-200">{showAll ? "3 göster" : "5 falcı"}</button>}
      </div>

      <div className="mt-4 grid gap-2.5">
        <button type="button" onClick={() => onSelect(null)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${selectedId === null ? "border-amber-300/60 bg-amber-300/[.08]" : "border-white/8 bg-white/[.025]"}`}>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300/15 to-violet-400/15"><Zap className="h-5 w-5 text-amber-200" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Otomatik seçim</span><span className="block text-[10px] text-slate-500">Sistem fiyat, hız ve uygunluğa göre seçer</span></span>
          <span className="text-xs text-amber-200">Öner</span>
        </button>
        {visible.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item)} className={`rounded-2xl border p-3 text-left transition ${isSelected ? "border-rose-400/70 bg-rose-500/[.08] shadow-[0_0_24px_rgba(244,63,94,.10)]" : "border-white/8 bg-white/[.02] hover:border-white/15"}`}>
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#21152d]">
                  <img src={characterAvatar(item.id)} alt={`${item.name} sanal karakter`} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1 py-0.5 text-[7px] font-bold text-white">AI</span>
                </div>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5"><strong className="font-serif text-base text-white">{item.name}</strong><span className="rounded-full bg-violet-400/10 px-1.5 py-0.5 text-[8px] font-bold text-violet-200">SANAL KARAKTER</span></span>
                  <span className="mt-0.5 block text-[11px] font-medium text-violet-200">{item.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current text-amber-300" />{item.rating}</span><span>{item.readingCount.toLocaleString("tr-TR")} yorum</span><span>{item.etaMinutes} dk</span></span>
                </span>
                <span className="shrink-0 text-right"><strong className="block text-sm font-black text-amber-200">{item.priceCredits} kredi</strong><span className="mt-1 inline-flex items-center gap-1 text-[9px] text-slate-500"><Mic2 className="h-3 w-3" />+{item.voiceCredits}</span></span>
              </div>
              <p className="mt-2 text-[10px] leading-5 text-slate-500">{item.description}</p>
              <div className="mt-2 flex items-center justify-between"><span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider ${item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{item.availability === "online" ? "Çevrimiçi" : item.availability === "busy" ? "Meşgul" : "Çevrimdışı"}</span><span className="text-[9px] text-slate-500"><Heart className="mr-1 inline h-3 w-3" />Favoriye ekle</span></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
