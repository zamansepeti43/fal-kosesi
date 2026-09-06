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

Fal Köşesi artık veritabanı olarak Neon PostgreSQL kullanır. Supabase bu ödeme/kredi akışının parçası değildir.

### Vercel Production ortamına

- `NEXT_PUBLIC_SITE_URL=https://fal-kosesi.vercel.app`
- `MEMBER_SESSION_SECRET=<uzun-rastgele-secret>`
- `DATABASE_URL=<Neon pooled connection string>`
- `IYZICO_API_KEY=<iyzico-api-key>`
- `IYZICO_SECRET_KEY=<iyzico-secret-key>`
- `IYZICO_API_URL=https://api.iyzipay.com`

Test ortamı için `IYZICO_API_URL=https://sandbox-api.iyzipay.com` kullanılabilir.

### Neon veritabanı kurulumu

Neon SQL Editor içinde `neon/schema.sql` dosyası bir kez çalıştırılmalıdır. Bu dosya üyeler, kredi bakiyeleri, kredi hareketleri ve iyzico siparişleri için gerekli tabloları ve atomik PostgreSQL fonksiyonlarını oluşturur.

Ödeme callback'i iyzico üzerinden ödeme durumunu yeniden doğrular; başarılı ve fraud kontrolünden geçen ödemelerde kredi verir. Aynı iyzico payment ID ikinci kez kredi yazmaz.

### Güvenlik

`DATABASE_URL`, `MEMBER_SESSION_SECRET`, `IYZICO_API_KEY` ve `IYZICO_SECRET_KEY` yalnızca Vercel Environment Variables içinde tutulmalıdır. Kaynak koda veya istemci tarafına yazılmamalıdır.
