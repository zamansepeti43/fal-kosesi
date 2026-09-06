# ☕ Fal Köşesi

Kahve falını merkeze alan, yapay zekâ destekli modern fal uygulaması.

## Vizyon
Kullanıcı fincan ve mümkünse tabak fotoğraflarını yükler; görsel analiz katmanı sembolleri ve konumlarını çıkarır; fal motoru bunları kişisel, sıcak ve eğlenceli bir yorum haline getirir. Kullanıcı aynı fal üzerinden Falcıya Sor ile takip soruları sorabilir.

## Şu anki durum
- Next.js + TypeScript + Tailwind üretim hazır
- Premium görünüm ve fal akışları tamamlandı
- Neon PostgreSQL kredi/üye/ödeme altyapısı hazır
- Kullanıcı oturumu ve profil API'si hazır
- iyzico Checkout Form ödeme entegrasyonu hazır; canlı anahtarlar hesap onayı sonrası eklenir
- Vercel deploy akışı için ortam değişkenleri hazır

## Temel teknik yapı
- Next.js 16
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- iyzico Checkout Form
- Vercel deployment-ready
- AI provider desteği

## Neon kurulumu
1. Neon üzerinde Fal Köşesi PostgreSQL projesi oluştur
2. Frankfurt bölgesini kullan
3. Neon'dan pooled connection string'i al
4. Vercel'de `DATABASE_URL` olarak tanımla
5. Gerekli SQL şemasını Neon SQL Editor'da çalıştır
6. Uygulamayı yeniden deploy et

## Vercel ortam değişkenleri
- DATABASE_URL
- MEMBER_SESSION_SECRET
- NEXT_PUBLIC_SITE_URL
- IYZICO_API_KEY
- IYZICO_SECRET_KEY
- IYZICO_API_URL

`DATABASE_URL`, `MEMBER_SESSION_SECRET`, `IYZICO_API_KEY` ve `IYZICO_SECRET_KEY` yalnızca Vercel Environment Variables içinde tutulmalıdır. Kaynak koda veya istemci tarafına yazılmamalıdır.

## Kredi paketleri
- 50 kredi — 50 TL
- 120 kredi — 100 TL
- 250 kredi — 200 TL
- 700 kredi — 500 TL
- 1500 kredi — 1000 TL

## Klasör yaklaşımı
`app/` kullanıcı arayüzü ve rotalar  
`lib/` paylaşımlı mantık ve servisler  
`supabase/` yalnızca eski migration/referans dosyaları  
`lib/neon/` Neon PostgreSQL bağlantısı  
`app/api/` backend route'ları

## Geliştirme sırası
1. Fotoğraf yükleme ve önizleme
2. Görsel analiz sağlayıcısı
3. Sembol/konum çıkarımı
4. Fal yorum motoru
5. Takip soruları
6. Kredi ve üyelik sistemi
7. iyzico canlı ödeme
8. Vercel yayınlama

> Not: Fal yorumları eğlence ve kişisel deneyim amacıyla tasarlanır; kesin gelecek, tıbbi, hukuki veya finansal tavsiye iddiası taşımaz.
