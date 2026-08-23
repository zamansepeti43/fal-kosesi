"use client";

import { ChangeEvent, useRef, useState } from "react";
import {
  Camera,
  ChevronRight,
  Coffee,
  Heart,
  ImagePlus,
  Sparkles,
  Upload,
  WalletCards,
  BriefcaseBusiness,
} from "lucide-react";

const categories = [
  { icon: Heart, title: "Aşk", text: "Kalbinin merak ettikleri", tone: "Kalp, yol ve buluşma izlerini yorumla." },
  { icon: WalletCards, title: "Kısmet", text: "Para ve bereket", tone: "Kısmet, fırsat ve hareketli dönemleri keşfet." },
  { icon: BriefcaseBusiness, title: "İş", text: "Kariyer ve yeni kapılar", tone: "İş, değişim ve yeni başlangıçlara odaklan." },
];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    setFiles(selected.slice(0, 3));
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
        <header className="flex items-center justify-between">
          <div>
            <div className="brand-title">
              FAL <span>KÖŞESİ</span>
            </div>
            <div className="brand-subtitle">Fincanındaki sırlar burada.</div>
          </div>
          <button className="header-button" type="button">Giriş Yap</button>
        </header>

        <section className="hero-section">
          <div className="hero-icon" aria-hidden="true">
            <Coffee size={34} />
          </div>
          <div className="eyebrow"><Sparkles size={15} /> YAPAY ZEKÂ DESTEKLİ KAHVE FALI</div>
          <h1>
            Fincanını getir.
            <br />
            <span>Falını keşfet.</span>
          </h1>
          <p className="hero-copy">
            Fincanının fotoğraflarını yükle. Fal Köşesi, fincanındaki izleri ve sembolleri yorumlayıp sana özel bir fal hazırlasın.
          </p>

          <section className="upload-card">
            <div className="upload-head">
              <div>
                <div className="section-kicker">01 / FOTOĞRAFLAR</div>
                <h2>Fincanını göster</h2>
                <p>İç kısmı net görünsün. Mümkünse fincan ve tabağı ayrı fotoğraflarla ekle.</p>
              </div>
              <div className="upload-mini-icon"><Camera size={21} /></div>
            </div>

            <div className="upload-actions">
              <button className="upload-dropzone" type="button" onClick={openPicker}>
                <div className="upload-circle"><ImagePlus size={27} /></div>
                <strong>{files.length ? `${files.length} fotoğraf seçildi` : "Fincan fotoğrafı ekle"}</strong>
                <span>JPG, PNG veya WEBP · en fazla 3 fotoğraf</span>
              </button>
              <button className="camera-button" type="button" onClick={openPicker}>
                <Upload size={17} /> Fotoğraf Seç
              </button>
              <input ref={inputRef} className="sr-only" type="file" accept="image/*" multiple onChange={addFiles} />
            </div>

            {files.length > 0 && (
              <div className="selected-files" aria-live="polite">
                {files.map((file) => (
                  <div key={`${file.name}-${file.lastModified}`} className="file-chip">{file.name}</div>
                ))}
              </div>
            )}

            <button className="primary-cta" type="button" disabled={!files.length}>
              <Sparkles size={18} /> Falımı Hazırla <ChevronRight size={17} />
            </button>
            <div className="privacy-note">Fotoğraflar yalnızca fal deneyimini hazırlamak için kullanılacaktır.</div>
          </section>
        </section>

        <section className="how-section">
          <div className="section-title-row">
            <div>
              <div className="section-kicker">02 / NASIL ÇALIŞIR?</div>
              <h2>Fincandan hikâyeye.</h2>
            </div>
            <p>Üç adımda falını hazırla.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card"><span>01</span><h3>Fotoğrafını çek</h3><p>Fincanını temiz ve aydınlık bir kareyle göster.</p></article>
            <article className="step-card"><span>02</span><h3>Merakını seç</h3><p>Aşk, kısmet, iş veya genel enerjiye odaklan.</p></article>
            <article className="step-card"><span>03</span><h3>Falını oku</h3><p>Semboller ve izler üzerinden kişisel yorumunu keşfet.</p></article>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-kicker">03 / FALININ ODAĞINI SEÇ</div>
          <div className="categories-grid">
            {categories.map(({ icon: Icon, title, text, tone }) => (
              <article key={title} className="category-card">
                <div className="category-icon"><Icon size={20} /></div>
                <h3>{title}</h3>
                <div className="category-text">{text}</div>
                <p>{tone}</p>
                <div className="category-arrow"><ChevronRight size={17} /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="trust-card">
          <div className="trust-icon"><Coffee size={20} /></div>
          <div>
            <strong>İyi bir fal için küçük bir ipucu</strong>
            <p>Fincanın içi net, kupanın tamamı kadraja yakın ve ışık mümkün olduğunca doğal olsun.</p>
          </div>
        </section>

        <footer>FAL KÖŞESİ · Kahve, merak ve biraz da gizem.</footer>
      </div>
    </main>
  );
}
