# ☕ Fal Köşesi

Kahve falını merkeze alan, yapay zekâ destekli modern fal uygulaması.

## Vizyon
Kullanıcı fincan ve mümkünse tabak fotoğraflarını yükler; görsel analiz katmanı sembolleri ve konumlarını çıkarır; fal motoru bunları kişisel, sıcak ve eğlenceli bir yorum haline getirir. Kullanıcı aynı fal üzerinden **Falcıya Sor** ile takip soruları sorabilir.

## İlk ürün kapsamı
- Kahve falı fotoğraf yükleme
- Birden fazla fotoğraf desteği
- Sembol + konum analiz modeli
- Aşk, para/kısmet, iş ve gelecek yorumları
- Takip soruları için konuşma altyapısı
- Fal geçmişi ve favoriler için veri modeli hazırlığı
- Tarot, günlük fal ve diğer modüller için genişleyebilir mimari

## Teknik temel
- Next.js + TypeScript
- Tailwind CSS
- Provider-agnostic AI katmanı
- İleride Supabase/Postgres + kimlik doğrulama
- Vercel deploy'a uygun yapı

## Klasör yaklaşımı
`app/` kullanıcı arayüzü ve rotalar  
`lib/coffee/` kahve falı domain mantığı  
`lib/tarot/` tarot verisi ve ilerideki açılımlar  
`lib/ai/` görüntü analiz/yorum sağlayıcıları  
`public/` görseller ve marka varlıkları

## Geliştirme sırası
1. Fotoğraf yükleme ve önizleme
2. Görsel analiz sağlayıcısı
3. Sembol/konum çıkarımı
4. Fal yorum motoru
5. Falcıya Sor konuşması
6. Supabase kullanıcı/fal geçmişi
7. Tarot ve diğer fal türleri
8. Premium üyelik

> Not: Fal yorumları eğlence ve kişisel deneyim amacıyla tasarlanır; kesin gelecek, tıbbi, hukuki veya finansal tavsiye iddiası taşımaz.
