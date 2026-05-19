import QRCode from "qrcode";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://event.ilovekorea.ai";
const QR_SIZE = 1000;
const LABEL_HEIGHT = 140;

const countries = [
  { slug: "cambodia", ko: "캄보디아" },
  { slug: "china", ko: "중국" },
  { slug: "indonesia", ko: "인도네시아" },
  { slug: "kazakhstan", ko: "카자흐스탄" },
  { slug: "nepal", ko: "네팔" },
  { slug: "philippines", ko: "필리핀" },
  { slug: "russia", ko: "러시아" },
  { slug: "thailand", ko: "태국" },
  { slug: "uzbekistan", ko: "우즈베키스탄" },
  { slug: "vietnam", ko: "베트남" },
];

await mkdir("qrcodes", { recursive: true });
await mkdir("qrcodes/plain", { recursive: true });

const escape = (s) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

for (const c of countries) {
  const url = `${BASE}/${c.slug}`;

  const plain = await QRCode.toBuffer(url, {
    width: QR_SIZE,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  await writeFile(`qrcodes/plain/${c.slug}.png`, plain);

  const urlText = url.replace(/^https?:\/\//, "");
  const labelSvg = Buffer.from(
    `<svg width="${QR_SIZE}" height="${LABEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${QR_SIZE}" height="${LABEL_HEIGHT}" fill="#ffffff"/>
      <text x="${QR_SIZE / 2}" y="72" text-anchor="middle"
            font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans CJK KR',sans-serif"
            font-size="64" font-weight="700" fill="#111">${escape(c.ko)}</text>
      <text x="${QR_SIZE / 2}" y="120" text-anchor="middle"
            font-family="sans-serif" font-size="30" fill="#666">${escape(urlText)}</text>
    </svg>`,
  );

  await sharp({
    create: {
      width: QR_SIZE,
      height: QR_SIZE + LABEL_HEIGHT,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: plain, top: 0, left: 0 },
      { input: labelSvg, top: QR_SIZE, left: 0 },
    ])
    .png()
    .toFile(`qrcodes/${c.slug}.png`);

  console.log(`${c.slug.padEnd(12)} → ${url}`);
}

console.log(`\nDone. ${countries.length} QR codes (labeled + plain) generated in qrcodes/`);
