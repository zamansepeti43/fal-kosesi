"use client";

import { useState } from "react";
import { Camera, Coffee, Heart, Sparkles, Upload, WandSparkles } from "lucide-react";

const services = [
  {icon:Coffee,title:"Kahve Falı",text:"Fincanındaki şekilleri ve izleri keşfet."},
  {icon:Heart,title:"Aşk Falı",text:"Kalbinin merak ettiği sorulara odaklan."},
  {icon:Sparkles,title:"Günlük Fal",text:"Bugünün enerjisini ve kısmetini öğren."},
];

export default function Home(){
 const [file,setFile]=useState<File|null>(null);
 return <main className="starfield min-h-screen px-5 py-8 md:px-10">
  <nav className="mx-auto flex max-w-6xl items-center justify-between"><div><div className="text-2xl font-bold tracking-wide">FAL <span className="gold">KÖŞESİ</span></div><div className="text-xs text-zinc-400">Fincanındaki sırlar burada.</div></div><button className="rounded-full border border-[#d7ad55]/30 px-4 py-2 text-sm text-zinc-200">Giriş Yap</button></nav>
  <section className="mx-auto max-w-6xl py-16 text-center md:py-24"><div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d7ad55]/30 bg-[#171020] shadow-[0_0_70px_rgba(215,173,85,.14)]"><Coffee className="gold" size={34}/></div><p className="gold mb-3 text-sm font-medium uppercase tracking-[.3em]">☕ Yapay zekâ destekli kahve falı</p><h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Fincanını getir.<br/><span className="gold">Falını keşfet.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">Kahve fincanının fotoğraflarını yükle. Fal Köşesi, fincanındaki şekilleri yorumlayıp sana özel bir fal hazırlasın.</p>
  <label className="glass mx-auto mt-10 flex max-w-xl cursor-pointer flex-col items-center rounded-3xl p-8 transition hover:border-[#d7ad55]/50"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d7ad55]/10"><Upload className="gold"/></div><span className="text-lg font-medium">{file?file.name:"Fincan fotoğrafını yükle"}</span><span className="mt-2 text-sm text-zinc-500">Fincan + mümkünse tabak fotoğrafı</span><input type="file" accept="image/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]??null)}/></label>
  <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d7ad55] px-7 py-3.5 font-semibold text-[#140d17] shadow-[0_10px_40px_rgba(215,173,85,.18)] disabled:opacity-40" disabled={!file}><WandSparkles size={18}/> Falıma Bak</button></section>
  <section className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{services.map(({icon:Icon,title,text})=><div key={title} className="glass rounded-2xl p-6"><Icon className="gold mb-5" size={22}/><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></div>)}</section>
  <section className="mx-auto mt-12 max-w-6xl rounded-3xl border border-white/5 bg-white/[.025] p-7 text-center"><Camera className="gold mx-auto mb-3" size={24}/><p className="text-sm text-zinc-400">Daha iyi yorum için fincanın içini net, aydınlık ve mümkün olduğunca yakından çek.</p></section>
 </main>
}
