"use client";

import Link from "next/link";
import { useState } from "react";
import { BriefcaseBusiness, ChevronRight, Heart, Moon, Sparkles, WalletCards, HelpCircle } from "lucide-react";

const focusOptions = [
  { value: "genel", label: "Genel", icon: HelpCircle },
  { value: "ask", label: "Aşk", icon: Heart },
  { value: "para", label: "Para & Kısmet", icon: WalletCards },
  { value: "is", label: "İş & Kariyer", icon: BriefcaseBusiness },
  { value: "gelecek", label: "Gelecek", icon: Moon },
] as const;

export default function FocusClient() {
  const [selectedFocus, setSelectedFocus] = useState<(typeof focusOptions)[number]["value"]>("genel");
  const [customQuestion, setCustomQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem(
      "falFocus",
      JSON.stringify({ focus: selectedFocus, question: customQuestion.trim() })
    );
    window.location.href = "/fal/analyze";
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center gap-3">
          <Link href="/fal/preview" className="text-sm text-slate-300">← Geri</Link>
          <h1 className="text-2xl font-bold text-white">Falın odak noktasını seç</h1>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <p className="mb-6 text-center text-slate-300">
            Hangi konuda derinleşmesini istediğini seç; istersen kendi sorunu da yaz.
          </p>

          <form id="focus-form" onSubmit={handleSubmit} className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Odak alanı</p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {focusOptions.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl border p-4 transition ${
                      selectedFocus === value
                        ? "border-amber-400/80 bg-amber-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="focus"
                      value={value}
                      checked={selectedFocus === value}
                      onChange={(e) => setSelectedFocus(e.target.value as (typeof focusOptions)[number]["value"])}
                      className="h-4 w-4 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Icon size={18} className="text-amber-200" />
                      {label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="custom-question" className="mb-2 block text-sm font-medium text-slate-200">
                Merak ettiğin bir şey var mı?
              </label>
              <textarea
                id="custom-question"
                rows={5}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Örn: Yakın zamanda aşk hayatımda bir gelişme olacak mı?"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-amber-400/80"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 px-6 py-3.5 text-base font-bold text-slate-950 shadow-[0_10px_30px_rgba(251,191,36,0.35)]"
            >
              <Sparkles size={18} />
              Falımı Hazırla
              <ChevronRight size={18} />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
