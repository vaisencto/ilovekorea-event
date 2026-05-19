import { writeFile } from "node:fs/promises";

const SITE_TITLE = "I Love Korea";

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

const pageHTML = ({ slug, ko }) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${ko} - ${SITE_TITLE}</title>
<meta name="description" content="${ko} ${SITE_TITLE} 이벤트 안내" />
<meta property="og:title" content="${ko} - ${SITE_TITLE}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/images/${slug}.jpg" />
<link rel="preload" as="image" href="/images/${slug}.webp" type="image/webp" />
<style>
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#000;}
  body{display:flex;justify-content:center;}
  main{width:100%;max-width:1600px;}
  picture,img{display:block;width:100%;height:auto;}
</style>
</head>
<body>
<main>
  <picture>
    <source type="image/webp" srcset="/images/${slug}.webp" />
    <img src="/images/${slug}.jpg" alt="${ko} - ${SITE_TITLE}" />
  </picture>
</main>
</body>
</html>
`;

const indexHTML = () => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${SITE_TITLE}</title>
<meta name="description" content="${SITE_TITLE} 이벤트 안내" />
<style>
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#fafafa;color:#111;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic",sans-serif;}
  main{max-width:560px;margin:0 auto;padding:48px 20px 64px;}
  h1{font-size:22px;font-weight:700;margin:0 0 24px;letter-spacing:-.01em;}
  ul{list-style:none;margin:0;padding:0;display:grid;gap:10px;}
  li a{display:block;padding:16px 20px;border-radius:12px;background:#fff;
    color:#111;text-decoration:none;font-size:17px;font-weight:600;
    border:1px solid #eee;transition:transform .1s ease, border-color .1s ease;}
  li a:hover{border-color:#bbb;}
  li a:active{transform:scale(.99);}
  footer{margin-top:32px;font-size:12px;color:#888;text-align:center;}
</style>
</head>
<body>
<main>
  <h1>${SITE_TITLE}</h1>
  <ul>
${countries
  .map((c) => `    <li><a href="/${c.slug}">${c.ko}</a></li>`)
  .join("\n")}
  </ul>
  <footer>© ${new Date().getFullYear()} ${SITE_TITLE}</footer>
</main>
</body>
</html>
`;

for (const c of countries) {
  await writeFile(`${c.slug}.html`, pageHTML(c), "utf8");
  console.log(`wrote ${c.slug}.html`);
}
await writeFile("index.html", indexHTML(), "utf8");
console.log("wrote index.html");
