import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "public", "fortune");
const tarotSourceDir = path.join(outputDir, "tarot-source");

const assets = [
  { file: "coffee-reading.jpg", url: "https://images.pexels.com/photos/37823298/pexels-photo-37823298.jpeg?cs=srgb&dl=pexels-idilcelikler-37823298.jpg&fm=jpg" },
  { file: "coffee-grounds.jpg", url: "https://images.pexels.com/photos/37468296/pexels-photo-37468296.jpeg?cs=srgb&dl=pexels-gizem-gokce-1072613075-37468296.jpg&fm=jpg" },
  { file: "tarot-spread.jpg", url: "https://images.pexels.com/photos/14190187/pexels-photo-14190187.jpeg?cs=srgb&dl=pexels-gabriela-hughes-326722820-14190187.jpg&fm=jpg" },
  { file: "love-reading.jpg", url: "https://images.pexels.com/photos/35315663/pexels-photo-35315663.jpeg?cs=srgb&dl=pexels-vireshstudio-35315663.jpg&fm=jpg" },
  { file: "money-abundance.jpg", url: "https://images.pexels.com/photos/8442425/pexels-photo-8442425.jpeg?cs=srgb&dl=pexels-zlataky-cz-61823415-8442425.jpg&fm=jpg" },
  { file: "career-success.jpg", url: "https://images.pexels.com/photos/10375959/pexels-photo-10375959.jpeg?cs=srgb&dl=pexels-rdne-10375959.jpg&fm=jpg" },
  { file: "daily-moon.jpg", url: "https://images.pexels.com/photos/10192712/pexels-photo-10192712.jpeg?cs=srgb&dl=pexels-lucaspezeta-10192712.jpg&fm=jpg" },
  { file: "daily-moon-premium.jpg", url: "https://images.pexels.com/photos/11718527/pexels-photo-11718527.jpeg?cs=srgb&dl=pexels-nikita-grishin-128711293-11718527.jpg&fm=jpg" },
  { file: "daily-sunrise.jpg", url: "https://images.pexels.com/photos/9201718/pexels-photo-9201718.jpeg?cs=srgb&dl=pexels-wolfart-9201718.jpg&fm=jpg" },
  { file: "birth-chart.jpg", url: "https://images.pexels.com/photos/10780188/pexels-photo-10780188.jpeg?cs=srgb&dl=pexels-158524029-10780188.jpg&fm=jpg" },
  { file: "dream-sleep.jpg", url: "https://images.pexels.com/photos/4752718/pexels-photo-4752718.jpeg?cs=srgb&dl=pexels-vika-glitter-392079-4752718.jpg&fm=jpg" },
  { file: "numerology-number.jpg", url: "https://images.pexels.com/photos/15271787/pexels-photo-15271787.jpeg?cs=srgb&dl=pexels-enginakyurt-15271787.jpg&fm=jpg" },
];

// Modern, photographic Frideborg Major Arcana deck.
// Tarot Spreader documents the deck as made from public-domain source imagery and free for commercial use.
const majorArcana = [
  ["00", "fool", "the-fool"], ["01", "magician", "the-magician"], ["02", "high-priestess", "the-high-priestess"], ["03", "empress", "the-empress"],
  ["04", "emperor", "the-emperor"], ["05", "hierophant", "the-hierophant"], ["06", "lovers", "the-lovers"], ["07", "chariot", "the-chariot"],
  ["08", "strength", "strength"], ["09", "hermit", "the-hermit"], ["10", "wheel-of-fortune", "the-wheel-of-fortune"], ["11", "justice", "justice"],
  ["12", "hanged-man", "the-hanged-man"], ["13", "death", "death"], ["14", "temperance", "temperance"], ["15", "devil", "the-devil"],
  ["16", "tower", "the-tower"], ["17", "star", "the-star"], ["18", "moon", "the-moon"], ["19", "sun", "the-sun"], ["20", "judgement", "judgement"], ["21", "world", "the-world"],
];

for (const [number, slug, sourceSlug] of majorArcana) {
  assets.push({
    file: path.join("tarot-source", `${number}-${slug}.png`),
    url: `https://www.tarotspreader.info/img/tarot/decks/the-frideborg/${sourceSlug}.png`,
  });
}

async function isFreshEnough(file, asset) {
  try {
    const info = await stat(file);
    if (asset.file.startsWith("tarot-source/") && info.size < 20_000) return false;
    return true;
  } catch {
    return false;
  }
}

await mkdir(tarotSourceDir, { recursive: true });

for (const asset of assets) {
  const target = path.join(outputDir, asset.file);
  if (await isFreshEnough(target, asset)) continue;

  console.log(`[fortune-assets] downloading ${asset.file}`);
  const response = await fetch(asset.url, {
    headers: { "User-Agent": "Fal-Kosesi/1.0 asset downloader" },
    redirect: "follow",
  });

  if (!response.ok) throw new Error(`Failed to download ${asset.url}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
}

console.log(`[fortune-assets] ready: ${assets.length} local visual assets`);
