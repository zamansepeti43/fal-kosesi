"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, MessagesSquare, Coffee, Heart, Wallet, Briefcase, Moon, Bookmark, Share2, Check } from "lucide-react";

type Symbol = { name: string; zone: string; meaning: string };
type Result = { summary: string; symbols: Symbol[]; sections: { love: string; career: string; money: string; future: string }; followUpQuestion?: string; readingId?: string | null };
type StoredReading = { result: Result; is_favorite?: boolean };

const fallback: Result = {
  summary: "Fincanındaki izler bir kapanıştan çok yeni bir sayfanın eşiğini gösteriyor. Önündeki dönemde seni bekleten bir haber, ardından vereceğin bir karar belirginleşebilir. Burada asıl tema, başkalarının senden beklediği hayat ile senin gerçekten istediğin hayat arasındaki farkı görmen.",
  symbols: [
    { name: "Kuş", zone: "Üst kenar", meaning: "Bir haber veya konuşma enerjisi taşıyor. Beklediğin mesaj geldiğinde sadece söylenenlere değil, konuşmanın sende uyandırdığı duyguya da dikkat et." },
    { name: "Anahtar", zone: "Orta bölüm", meaning: "Çözümü elinde olmayan bir konunun kapısını açabilecek fırsatı anlatıyor. Bu fırsat küçük görünebilir ama doğru değerlendirildiğinde yönünü değiştirebilir." },
    { name: "Yol", zone: "Dipten kenara", meaning: "Bir seçimden sonra hareketlenme var. Kısa vadede zorlayıcı olsa bile sana daha fazla özgürlük veren yolu seçmen uzun vadede daha huzurlu hissettirebilir." },
    { name: "Kalp", zone: "Sol bölüm", meaning: "Duygusal bir bağın hâlâ kararlarını etkilediğini gösteriyor. Hislerini bastırmak yerine neye gerçekten ihtiyaç duyduğunu ayırman önemli." },
    { name: "Yıldız", zone: "Üst bölüm", meaning: "Yeniden umutlanma ve görünür olma enerjisi. Uzun süredir ertelediğin bir isteğin için tekrar cesaret bulabileceğin bir dönem." },
    { name: "Halka", zone: "Dip", meaning: "Tamamlanan bir döngü ve daha sağlam bir düzen kurma ihtiyacı. Eski bir alışkanlığı veya ilişki biçimini değiştirdiğinde alanın genişleyecek." },
  ],
  sections: {
    love: "Duygusal alanda netlik arıyorsun ve artık yarım kalan cümleler seni eskisi kadar tatmin etmiyor. Hayatında biri varsa, aranızdaki bağı güçlendirecek olan şey büyük sözlerden çok küçük ama tutarlı davranışlar olacak. Bekârsan, geçmişte seni yoran benzer bir döngüyü tekrar etmemeye dikkat et.",
    career: "İş ve kariyer tarafında görünürlüğün artıyor. Senden fikir istenmesi, yeni bir sorumluluk veya farklı bir çalışma düzeni gündeme gelebilir. Kendini kanıtlamak için her yükü üstlenmen gerekmiyor; emeğinin karşılığını ve gelişim alanını birlikte düşün.",
    money: "Maddi tarafta önce düzen, sonra rahatlama mesajı var. Beklenen bir ödeme veya ek gelir fırsatı gündeme gelebilir; fakat asıl kazanım, paranı nereye yönlendirdiğini daha bilinçli takip etmen olacak. Ani harcamalarda kısa süreli rahatlama yerine uzun vadeli hedefini hatırla.",
    future: "Yakın gelecekte bir haberin ardından karar vermen gereken bir eşik oluşabilir. İlk anda belirsiz görünen seçeneklerden biri zamanla daha net hale gelecek. Acele karar vermek yerine sana huzur veren seçeneği gözlemle.",
  },
  followUpQuestion: "Bu yorumda seni en çok düşündüren konu hangisi? Onu biraz daha derinleştirebiliriz.",
};

const sections = [["Aşk", "love", Heart, "Kalbinin gündemi"], ["Para & Kısmet", "money", Wallet, "Maddi akışın"], ["İş & Kariyer", "career", Briefcase, "Hedeflerin ve yolun"], ["Yakın Gelecek", "future", Moon, "Önündeki dönem"]] as const;

export default function ResultClientV2() {
  const [reading, setReading] = useState<Result>(fallback);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean }>>([]);
  const [name, setName] = useState("Dostum");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const profileRaw = localStorage.getItem("fal-kosesi-profile");
    if (profileRaw) {
      try { const profile = JSON.parse(profileRaw) as { name?: string }; if (profile.name?.trim()) setName(profile.name.trim().split(" ")[0]); } catch {}
    }

    let storedResult: Result | null = null;
    try { storedResult = JSON.parse(sessionStorage.getItem("falResult") || "null") as Result | null; } catch {}

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id");
    const localId = storedResult?.readingId || null;
    const id = requestedId || localId;

    if (storedResult) {
      setReading({ ...fallback, ...storedResult, sections: { ...fallback.sections, ...storedResult.sections }, symbols: storedResult.symbols?.length ? storedResult.symbols : fallback.symbols });
      setReadingId(storedResult.readingId || null);
    }

    if (id) {
      setReadingId(id);
      fetch(`/api/readings/${encodeURIComponent(id)}`, { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) return;
          const data = (await response.json()) as { reading?: StoredReading };
          if (!data.reading) return;
          setReading({ ...fallback, ...(data.reading.result || {}) });
          setFavorite(Boolean(data.reading.is_favorite));
        })
        .catch(() => undefined);
    }
  }, []);

  const toggleFavorite = async () => {
    if (!readingId) return;
    const next = !favorite;
    setFavorite(next);
    const response = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readingId, favorite: next }) });
    if (!response.ok) setFavorite(!next);
  };

  const shareReading = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) await navigator.share({ title: "Fal Köşesi yorumum", text: "Fal Köşesi'ndeki yorumuma göz at.", url: shareUrl });
      else { await navigator.clipboard.writeText(shareUrl); setShareMessage("Bağlantı kopyalandı."); setTimeout(() => setShareMessage(""), 2200); }
    } catch {}
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setMessages((prev) => [...prev, { id: Date.now(), text, isUser: true }]);
    setChatInput("");
    setTimeout(() => setMessages((prev) => [...prev, { id: Date.now() + 1, text: `${name}, “${text}” sorunu falındaki sembollerle birlikte düşündüğümüzde özellikle netleşme ihtiyacın öne çıkıyor. İstersen bu konuyu Aşk, Para, Kariyer veya Yakın Gelecek başlıklarından biri üzerinden derinleştirebiliriz.`, isUser: false }]), 400);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(109,40,217,.22),transparent_32%),linear-gradient(180deg,#080817,#05050d)] text-white">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-5 sm:px-6 sm:pt-8">
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
          <Link href="/fal/upload" className="text-xs text-slate-300 sm:text-sm">← Yeni Fal</Link>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => void toggleFavorite()} disabled={!readingId} className={`grid h-9 w-9 place-items-center rounded-full border ${favorite ? "border-rose-300/30 bg-rose-400/15 text-rose-200" : "border-white/10 bg-white/[.04] text-slate-200"}`} aria-label={favorite ? "Favoriden çıkar" : "Favoriye ekle"}><Bookmark className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} /></button>
            <button type="button" onClick={() => void shareReading()} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.04]" aria-label="Paylaş"><Share2 className="h-4 w-4" /></button>
            <button type="button" onClick={() => setShowChat((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/30 bg-violet-400/10 text-violet-200" aria-label="Falcıya Sor"><MessagesSquare className="h-4 w-4" /></button>
          </div>
        </header>
        {shareMessage && <div className="mb-3 flex items-center justify-center gap-2 text-xs text-emerald-200"><Check className="h-3.5 w-3.5" /> {shareMessage}</div>}

        <section className="relative overflow-hidden rounded-[26px] border border-amber-200/20 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,.16),transparent_35%),linear-gradient(135deg,rgba(30,20,48,.95),rgba(11,10,27,.98))] p-5 shadow-[0_25px_80px_rgba(0,0,0,.35)] sm:rounded-[32px] sm:p-8">
          <div className="relative flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.25em] text-amber-200"><Coffee className="h-4 w-4"/> Fal Köşesi • Kişisel Kahve Okuması</div>
          <h1 className="relative mt-3 font-serif text-3xl font-bold sm:text-4xl">{name}, fincanın sana ne anlatıyor? ✦</h1>
          <p className="relative mt-2 max-w-3xl text-sm leading-6 text-slate-300">Profilin, seçtiğin odak ve fincanındaki semboller birlikte değerlendirilerek hazırlanan kişisel okuman.</p>
        </section>

        <section className="mt-4 rounded-[24px] border border-violet-300/15 bg-white/[.035] p-5 shadow-xl backdrop-blur-xl sm:mt-5 sm:p-7"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-300"/><h2 className="font-serif text-xl font-bold">Sana özel genel yorum</h2></div><p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">{reading.summary}</p></section>

        <section className="mt-5 sm:mt-7"><div className="mb-3 flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.25em] text-amber-200">Fincandaki izler</p><h2 className="mt-1 font-serif text-2xl font-bold">Gördüğümüz semboller</h2></div><span className="text-xs text-slate-500">{reading.symbols?.length || 0} sembol</span></div><div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{(reading.symbols || []).map((symbol, index) => <article key={`${symbol.name}-${index}`} className="rounded-[20px] border border-white/[.08] bg-gradient-to-br from-white/[.06] to-white/[.025] p-4 shadow-lg"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/10 text-lg text-amber-200">✦</span><span className="rounded-full border border-white/10 px-2 py-1 text-[8px] uppercase tracking-[.15em] text-slate-400">{symbol.zone}</span></div><h3 className="mt-3 font-serif text-lg font-bold">{symbol.name}</h3><p className="mt-1 text-xs leading-5 text-slate-300">{symbol.meaning}</p></article>)}</div></section>

        <section className="mt-7"><div className="mb-3"><p className="text-[9px] uppercase tracking-[.25em] text-violet-200">Hayatının dört alanı</p><h2 className="mt-1 font-serif text-2xl font-bold">Senin için ayrıntılı yorum</h2></div><div className="grid gap-3 sm:grid-cols-2">{sections.map(([title, key, Icon, subtitle]) => <article key={title} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-5 shadow-xl"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-400/10 text-violet-200"><Icon className="h-5 w-5"/></span><div><h3 className="font-serif text-lg font-bold">{title}</h3><p className="text-[10px] text-slate-500">{subtitle}</p></div></div><p className="mt-4 text-sm leading-7 text-slate-200">{reading.sections[key]}</p></article>)}</div></section>

        <section className="mt-5 rounded-[22px] border border-amber-300/20 bg-amber-300/[.05] p-5 sm:mt-7 sm:p-6"><p className="text-[9px] font-bold uppercase tracking-[.25em] text-amber-200">Bir sonraki soru</p><p className="mt-2 font-serif text-lg font-semibold">{reading.followUpQuestion}</p><button type="button" onClick={() => setShowChat(true)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-5 py-2.5 text-xs font-black text-slate-950">Falcıya Sor <ChevronRight className="h-4 w-4"/></button></section>

        {showChat && <section className="mt-5 rounded-[22px] border border-violet-400/20 bg-white/[.04] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-serif text-xl font-bold">Falcıya Sor</h2><p className="mt-1 text-xs text-slate-400">Bu falın üzerinden ek bir soru sor.</p></div><MessagesSquare className="text-violet-300"/></div><div className="mt-4 max-h-64 space-y-2 overflow-y-auto">{messages.length === 0 && <p className="rounded-xl bg-white/[.035] p-3 text-xs text-slate-400">Örn. “Bu haber aşk hayatımla mı ilgili?”</p>}{messages.map((message) => <div key={message.id} className={`max-w-[88%] rounded-2xl p-3 text-xs leading-5 ${message.isUser ? "ml-auto bg-amber-300 text-slate-950" : "bg-white/[.06] text-slate-200"}`}>{message.text}</div>)}</div><div className="mt-3 flex gap-2"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }} placeholder="Sorunu yaz..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none focus:border-violet-400"/><button type="button" onClick={handleSendMessage} className="rounded-xl bg-violet-400 px-4 py-2.5 text-xs font-black text-slate-950">Sor</button></div></section>}
      </div>
    </main>
  );
}
