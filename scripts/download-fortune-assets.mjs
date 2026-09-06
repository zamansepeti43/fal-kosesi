import { mkdir, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "public", "fortune");
const tarotDir = path.join(outputDir, "tarot");

const assets = [
  {
    file: "coffee-reading.jpg",
    url: "https://images.pexels.com/photos/37823298/pexels-photo-37823298.jpeg?cs=srgb&dl=pexels-idilcelikler-37823298.jpg&fm=jpg",
  },
  {
    file: "coffee-grounds.jpg",
    url: "https://images.pexels.com/photos/37468296/pexels-photo-37468296.jpeg?cs=srgb&dl=pexels-gizem-gokce-1072613075-37468296.jpg&fm=jpg",
  },
  {
    file: "tarot-spread.jpg",
    url: "https://images.pexels.com/photos/14190187/pexels-photo-14190187.jpeg?cs=srgb&dl=pexels-gabriela-hughes-326722820-14190187.jpg&fm=jpg",
  },
  {
    file: "love-reading.jpg",
    url: "https://images.pexels.com/photos/35315663/pexels-photo-35315663.jpeg?cs=srgb&dl=pexels-vireshstudio-35315663.jpg&fm=jpg",
  },
  {
    file: "money-abundance.jpg",
    url: "https://images.pexels.com/photos/8442425/pexels-photo-8442425.jpeg?cs=srgb&dl=pexels-zlataky-cz-61823415-8442425.jpg&fm=jpg",
  },
  {
    file: "career-success.jpg",
    url: "https://images.pexels.com/photos/10375959/pexels-photo-10375959.jpeg?cs=srgb&dl=pexels-rdne-10375959.jpg&fm=jpg",
  },
  {
    file: "daily-moon.jpg",
    url: "https://images.pexels.com/photos/8929853/pexels-photo-8929853.jpeg?cs=srgb&dl=pexels-osman-8929853.jpg&fm=jpg",
  },
  {
    file: "birth-chart.jpg",
    url: "https://images.pexels.com/photos/10780188/pexels-photo-10780188.jpeg?cs=srgb&dl=pexels-158524029-10780188.jpg&fm=jpg",
  },
  {
    file: "dream-sleep.jpg",
    url: "https://images.pexels.com/photos/4752718/pexels-photo-4752718.jpeg?cs=srgb&dl=pexels-vika-glitter-392079-4752718.jpg&fm=jpg",
  },
  {
    file: "numerology-number.jpg",
    url: "https://images.pexels.com/photos/15271787/pexels-photo-15271787.jpeg?cs=srgb&dl=pexels-enginakyurt-15271787.jpg&fm=jpg",
  },
];

const majorArcana = [
  ["00", "fool", "Fool"],
  ["01", "magician", "Magician"],
  ["02", "high-priestess", "High_Priestess"],
  ["03", "empress", "Empress"],
  ["04", "emperor", "Emperor"],
  ["05", "hierophant", "Hierophant"],
  ["06", "lovers", "Lovers"],
  ["07", "chariot", "Chariot"],
  ["08", "strength", "Strength"],
  ["09", "hermit", "Hermit"],
  ["10", "wheel-of-fortune", "Wheel_of_Fortune"],
  ["11", "justice", "Justice"],
  ["12", "hanged-man", "Hanged_Man"],
  ["13", "death", "Death"],
  ["14", "temperance", "Temperance"],
  ["15", "devil", "Devil"],
  ["16", "tower", "Tower"],
  ["17", "star", "Star"],
  ["18", "moon", "Moon"],
  ["19", "sun", "Sun"],
  ["20", "judgement", "Judgement"],
  ["21", "world", "World"],
];

for (const [number, slug, sourceName] of majorArcana) {
  assets.push({
    file: path.join("tarot", `${number}-${slug}.jpg`),
    url: `https://commons.wikimedia.org/wiki/Special:Redirect/file/RWS_Tarot_${number}_${sourceName}.jpg?width=900`,
  });
}

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

await mkdir(tarotDir, { recursive: true });

for (const asset of assets) {
  const target = path.join(outputDir, asset.file);
  if (await exists(target)) continue;

  console.log(`[fortune-assets] downloading ${asset.file}`);
  const response = await fetch(asset.url, {
    headers: { "User-Agent": "Fal-Kosesi/1.0 asset downloader" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${asset.url}: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
}

console.log(`[fortune-assets] ready: ${assets.length} local visual assets`);
