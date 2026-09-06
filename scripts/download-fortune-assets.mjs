import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "public", "fortune");

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

async function isFreshEnough(file) {
  try {
    const info = await stat(file);
    return info.size > 20_000;
  } catch {
    return false;
  }
}

await mkdir(outputDir, { recursive: true });

for (const asset of assets) {
  const target = path.join(outputDir, asset.file);
  if (await isFreshEnough(target)) continue;

  console.log(`[fortune-assets] downloading ${asset.file}`);
  const response = await fetch(asset.url, {
    headers: { "User-Agent": "Fal-Kosesi/1.0 asset downloader" },
    redirect: "follow",
  });

  if (!response.ok) throw new Error(`Failed to download ${asset.url}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
}

console.log(`[fortune-assets] ready: ${assets.length} visual assets; tarot deck is handled by the workflow archive step`);
