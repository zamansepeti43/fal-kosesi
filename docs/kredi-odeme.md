# Fal Köşesi Kredi ve Ödeme Sistemi

## Kredi paketleri

- 50 kredi — 50 TL
- 120 kredi — 100 TL (+20 hediye)
- 250 kredi — 200 TL (+50 hediye)
- 700 kredi — 500 TL (+200 hediye)
- 1.500 kredi — 1.000 TL (+500 hediye)

Yeni üye hesabına 50 hoş geldin kredisi tanımlanır.

## Fal ücretleri

- Kahve — 10 kredi
- Aşk — 10 kredi
- Para & Kısmet — 10 kredi
- İş & Kariyer — 10 kredi
- Yakın Gelecek — 7 kredi
- Rüya — 7 kredi
- Yıldızname / astroloji — 15 kredi
- Numeroloji — 8 kredi
- Günlük — 3 kredi
- Tarot Tek Kart — 5 kredi
- Tarot 3 Kart — 12 kredi
- Tarot Aşk / Kariyer / Para — 15 kredi

## Canlı ödeme kurulumu

Vercel production ortamına şu değişkenler eklenmelidir:

- `NEXT_PUBLIC_SITE_URL=https://fal-kosesi.vercel.app`
- `MEMBER_SESSION_SECRET=<uzun-rastgele-secret>`
- `IYZICO_API_KEY=<iyzico-api-key>`
- `IYZICO_SECRET_KEY=<iyzico-secret-key>`
- `IYZICO_API_URL=https://api.iyzipay.com`
- `NEXT_PUBLIC_SUPABASE_URL=<Fal Köşesi Supabase URL>`
- `SUPABASE_SERVICE_ROLE_KEY=<Fal Köşesi Supabase service role key>`

Test ortamı için `IYZICO_API_URL=https://sandbox-api.iyzipay.com` kullanılabilir.

Supabase tarafında `supabase/credits.sql` migration'ı çalıştırılmalıdır. Ödeme callback'i yalnızca iyzico'dan doğrulanan başarılı ve fraud kontrolünden geçen ödemelerde kredi verir; aynı ödeme ikinci kez kredi yazmaz.
