import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const SRC = "originals";
const OUT = "images";
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 8000; // WebP hard-caps output around 16383px — keep margin for tall banners
const WEBP_QUALITY = 82;
const JPG_QUALITY = 82;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const slug = parse(file).name.toLowerCase();
  const src = join(SRC, file);
  const webpOut = join(OUT, `${slug}.webp`);
  const jpgOut = join(OUT, `${slug}.jpg`);

  const pipeline = sharp(src).resize({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
    fit: "inside",
    withoutEnlargement: true,
  });

  await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut);
  await pipeline
    .clone()
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(jpgOut);

  const [origStat, webpStat, jpgStat] = await Promise.all([
    stat(src),
    stat(webpOut),
    stat(jpgOut),
  ]);
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(
    `${file.padEnd(20)}  orig ${kb(origStat.size).padStart(8)}  →  webp ${kb(
      webpStat.size,
    ).padStart(8)}  jpg ${kb(jpgStat.size).padStart(8)}`,
  );
}

console.log(`\nDone. ${files.length} image(s) processed.`);
