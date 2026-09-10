# Fal Köşesi Kredi ve Ödeme Sistemi

## Kredi paketleri

| Paket | Kullanıcıya geçen toplam kredi | Hediye | Fiyat |
|---|---:|---:|---:|
| Başlangıç | 50 | 0 | 50 TL |
| En çok tercih edilen | 120 | 20 | 100 TL |
| Avantajlı | 250 | 50 | 200 TL |
| Büyük paket | 700 | 200 | 500 TL |
| En avantajlı | 1.500 | 500 | 1.000 TL |

`credits` değeri satın alma sonunda hesaba eklenecek **toplam** bakiyeyi ifade eder. Örneğin 100 TL'lik paket 100 satın alınan + 20 hediye = 120 kredi verir. Ödeme sağlayıcısına gönderilen tutar her zaman `priceTry` değeridir.

Yeni üye hesabına 50 hoş geldin kredisi tanımlanır ve bu işlem kredi hareketleri defterine `welcome` olarak yazılır.

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
- Odak — 8 kredi
- Tarot Tek Kart — 5 kredi
- Tarot 3 Kart — 12 kredi
- Tarot Aşk / Kariyer / Para — 15 kredi

## Fiyatlandırma mantığı

- Fiyatlar ve kredi maliyetleri tek kaynak olarak `lib/credits.ts` içinde tutulur.
- Kullanıcı arayüzü ve sunucu tarafı ödeme siparişi aynı paket kataloğunu kullanır.
- İstemci yalnızca `packageId` gönderir; sunucu fiyatı istemciden kabul etmez, paketi kendi katalogundan çözer.
- Ödeme callback'i siparişte kayıtlı fiyat, ödeme tutarı ve TRY para birimini tekrar doğrular.
- Aynı ödeme ID'si ikinci kez kredi yazamaz.
- Başarısız bir fal üretiminde kredi iadesi ayrı `refund` hareketi olarak tutulur.

## Canlı ödeme kurulumu

Fal Köşesi Neon PostgreSQL kullanır. Supabase bu ödeme/kredi akışının parçası değildir.

### Vercel Production ortamına

- `NEXT_PUBLIC_SITE_URL=https://fal-kosesi.vercel.app`
- `MEMBER_SESSION_SECRET=<uzun-rastgele-secret>`
- `DATABASE_URL=<Neon pooled connection string>`
- Ödeme sağlayıcısının API anahtarları yalnızca Vercel Environment Variables içinde tutulmalıdır.

Mevcut iyzico entegrasyonu sağlayıcıya özel bir adaptördür; yeni ödeme sağlayıcısı seçildiğinde kredi kataloğu ve Neon sipariş/ledger yapısı değişmeden yeni checkout/callback adaptörü eklenebilir.

### Neon veritabanı kurulumu

Yeni veritabanında `neon/schema.sql` bir kez çalıştırılmalıdır. Mevcut veritabanında `neon/migrations/2026-09-credit-ledger-hardening.sql` bir kez çalıştırılmalıdır.

Migration, hoş geldin kredisi hareketinin aynı referansla tekrar yazılmasını engelleyen benzersiz indeksi ekler.

### Güvenlik

`DATABASE_URL`, `MEMBER_SESSION_SECRET` ve ödeme sağlayıcısının gizli anahtarları kaynak koda veya istemci tarafına yazılmamalıdır.
