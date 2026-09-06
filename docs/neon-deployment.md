# Fal Köşesi — Neon Deployment

Fal Köşesi production veritabanı Neon PostgreSQL üzerinde çalışır.

- Bölge: AWS Europe Central 1 (Frankfurt)
- Database: `neondb`
- Vercel database variable: `DATABASE_URL`
- Session signing variable: `MEMBER_SESSION_SECRET`
- iyzico canlı anahtarları hesap onayı sonrasında Vercel'e eklenecek.

Secret değerleri bu dosyada veya GitHub'da tutulmaz.
