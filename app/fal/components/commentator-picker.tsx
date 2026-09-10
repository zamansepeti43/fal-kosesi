"use client";

import { Heart, Mic2, Star, UserRound, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FortuneKind } from "@/lib/fortune/catalog";
import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type Commentator = (typeof DIGITAL_COMMENTATORS)[number] & { favorite?: boolean; type?: string };

type Props = {
  kind: FortuneKind;
  selectedId?: string | null;
  onSelect: (commentator: Commentator | null) => void;
};

export default function CommentatorPicker({ kind, selectedId, onSelect }: Props) {
  const [items, setItems] = useState<Commentator[]>(DIGITAL_COMMENTATORS.filter((item) => item.specialties.includes(kind)));
  const [showAll, setShowAll] = useState(false);

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

  const visible = useMemo(() => showAll ? items : items.slice(0, 3), [items, showAll]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Yorumcunu seç</p>
          <p className="mt-1 text-[11px] text-slate-500">Dijital yorumcuların tonu ve uzmanlık alanı farklıdır. Gerçek insan yorumcuları sisteme eklendiğinde aynı seçim ekranında görünür.</p>
        </div>
        {items.length > 3 && <button type="button" onClick={() => setShowAll((value) => !value)} className="text-xs text-violet-200">{showAll ? "Azalt" : "Tümü"}</button>}
      </div>

      <div className="mt-3 grid gap-2">
        <button type="button" onClick={() => onSelect(null)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === null ? "border-amber-300/50 bg-amber-300/[.08]" : "border-white/8 bg-white/[.02]"}`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5"><Zap className="h-5 w-5 text-amber-200" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Hızlı otomatik seçim</span><span className="block text-[10px] text-slate-500">En uygun yorumcuyu sistem seçer</span></span>
        </button>
        {visible.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item)} className={`rounded-xl border p-3 text-left transition ${isSelected ? "border-amber-300/50 bg-amber-300/[.08]" : "border-white/8 bg-white/[.02]"}`}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-400/20"><UserRound className="h-5 w-5 text-violet-100" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2"><strong className="text-sm text-slate-100">{item.name}</strong>{item.verified && <span className="text-[9px] text-emerald-200">✓ doğrulanmış profil</span>}</span>
                  <span className="mt-0.5 block text-[11px] text-violet-200">{item.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current text-amber-300" />{item.rating}</span><span>{item.readingCount.toLocaleString("tr-TR")} yorum</span><span>{item.etaMinutes} dk</span></span>
                </span>
                <span className="shrink-0 text-right"><strong className="block text-sm text-amber-200">{item.priceCredits} kr.</strong><span className="mt-1 inline-flex items-center gap-1 text-[9px] text-slate-500"><Mic2 className="h-3 w-3" />+{item.voiceCredits} ses</span></span>
              </div>
              <p className="mt-2 text-[10px] leading-5 text-slate-500">{item.description}</p>
              <span className={`mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider ${item.availability === "online" ? "text-emerald-200" : item.availability === "busy" ? "text-amber-200" : "text-slate-500"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{item.availability === "online" ? "Çevrimiçi" : item.availability === "busy" ? "Meşgul" : "Çevrimdışı"}</span>
              <span className="ml-2 text-[9px] text-slate-500"><Heart className="mr-1 inline h-3 w-3" />Favoriye ekle profil sayfasından</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
