# ☕ Fal Köşesi

Kahve falını merkeze alan, yapay zekâ destekli modern fal uygulaması.

## Vizyon
Kullanıcı fincan ve mümkünse tabak fotoğraflarını yükler; görsel analiz katmanı sembolleri ve konumlarını çıkarır; fal motoru bunları kişisel, sıcak ve eğlenceli bir yorum haline getirir. Kullanıcı aynı fal üzerinden Falcıya Sor ile takip soruları sorabilir.

## Şu anki durum
- Next.js + TypeScript + Tailwind üretim hazır
- Premium görünüm ve fal akışları tamamlandı
- Supabase-ready altyapı kuruldu
- Kullanıcı signup/login, profil ve premium statüsü için hazırlık tamamlandı
- Vercel deploy akışı için ortam değişkenleri hazır

## Temel teknik yapı
- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Vercel deployment-ready
- AI provider desteği

## Supabase kurulumu
1. Supabase üzerinde yeni proje aç
2. Authentication > Email auth etkinleştir
3. SQL editor içinde `supabase/schema.sql` çalıştır
4. Vercel’e ortam değişkenlerini ekle
5. Uygulamayı deploy et

## Vercel ortam değişkenleri
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_SECRET
- NEXT_PUBLIC_APP_URL

## Klasör yaklaşımı
`app/` kullanıcı arayüzü ve rotalar  
`lib/` paylaşımlı mantık ve servisler  
`supabase/` SQL şemaları ve veri modelleri  
`app/api/` backend route'ları

## Geliştirme sırası
1. Fotoğraf yükleme ve önizleme
2. Görsel analiz sağlayıcısı
3. Sembol/konum çıkarımı
4. Fal yorum motoru
5. Takip soruları
6. Supabase kullanıcı/fal geçmişi
7. Premium üyelik ve ödeme akışı
8. Vercel yayınlama

> Not: Fal yorumları eğlence ve kişisel deneyim amacıyla tasarlanır; kesin gelecek, tıbbi, hukuki veya finansal tavsiye iddiası taşımaz.
