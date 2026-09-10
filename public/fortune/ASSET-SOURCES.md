# Fal Köşesi visual asset sources

These visual assets are downloaded by `scripts/download-fortune-assets.mjs`. GitHub Actions syncs the downloaded binaries into `public/fortune` so the actual visual files are versioned in the repository; Vercel can also download them during a clean build.

## Coffee fortune imagery
- Pexels — Idil Ceren Çelikler, “Traditional Turkish Coffee Fortune Reading”: https://www.pexels.com/photo/traditional-turkish-coffee-fortune-reading-37823298/
- Pexels — Gizem Gökce, “Close-up of Turkish Coffee Cup with Grounds”: https://www.pexels.com/photo/close-up-of-turkish-coffee-cup-with-grounds-37468296/

## Tarot imagery
- Pexels — Gabriela Hughes, “Tarot Cards and Crystals”: https://www.pexels.com/photo/tarot-cards-and-crystals-14190187/
- Rider-Waite-Smith Major Arcana scans — Wikimedia Commons, public domain: https://commons.wikimedia.org/wiki/Category:Major_Arcana
- Complete 78-card Rider-Waite image API used for minor-arcana card faces: `https://petaloverflow.github.io/tarot-api/cards/` (repository states the 1909 Rider-Waite images are public domain): https://github.com/sixseeds/tarot-api
- Full card index and exact image codes are documented by the upstream API's `cards.json`.

## Homepage fortune-card imagery
- Pexels — viresh studio, “Romantic Candlelit Proposal with Couple Holding Hands”: https://www.pexels.com/photo/romantic-candlelit-proposal-with-couple-holding-hands-35315663/
- Pexels — Zlaťáky.cz, “Close-Up Shot of Gold Coins”: https://www.pexels.com/photo/close-up-shot-of-gold-coins-8442425/
- Pexels — RDNE Stock project, “Woman Sitting at her Desk”: https://www.pexels.com/photo/woman-sitting-at-her-desk-10375959/
- Pexels — Lucas Pezeta, “Moon and Star in the Sky during Night Time”: https://www.pexels.com/photo/moon-and-star-in-the-sky-during-night-time-10192712/
- Pexels — Nikita Grishin, “Magical View Of the Night Sky With Crescent Moon”: https://www.pexels.com/photo/magical-view-of-the-night-sky-with-crescent-moon-11718527/
- Pexels — Wolf Art, “Sun Behind Clouds”: https://www.pexels.com/photo/sun-behind-clouds-9201718/
- Pexels — Ксения Вохминцева, “A Close-Up of a Natal Chart”: https://www.pexels.com/photo/a-close-up-of-a-natal-chart-10780188/
- Pexels — Vika Glitter, “Dreamy woman sleeping on bed”: https://www.pexels.com/photo/dreamy-woman-sleeping-on-bed-4752718/
- Pexels — Engin Akyurt, “Photograph of a Lit Seven Candle”: https://www.pexels.com/photo/photograph-of-a-lit-seven-candle-15271787/

All listed Pexels photos are marked free to use on their source pages. The homepage uses local downloaded copies under `public/fortune` rather than hotlinking remote images.
