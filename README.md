# I Love Korea — Event Landing

이벤트용 정적 랜딩 사이트입니다. 9개 국가별 페이지로 구성되어 있으며, 각 페이지는 단일 이미지만 표시합니다.

## 구조

```
/
├── index.html              # 메인(9개 국가 링크)
├── {country}.html          # 국가별 페이지 (cambodia, china, ... uzbekistan)
├── images/                 # 최적화된 WebP + JPG (서비스용)
├── originals/              # 원본 JPG (배포에서 제외)
├── scripts/
│   ├── optimize-images.mjs # originals → images 최적화
│   └── build-pages.mjs     # 9개 국가 + index.html 생성
└── vercel.json             # cleanUrls (확장자 없는 URL)
```

## URL

- `/` 메인
- `/cambodia`, `/china`, `/indonesia`, `/kazakhstan`, `/nepal`, `/philippines`, `/russia`, `/thailand`, `/uzbekistan`

## 로컬에서 확인

정적 파일이라 별도 빌드가 필요 없습니다. 아무 정적 서버나 사용하세요.

```bash
npx serve .
# http://localhost:3000/cambodia 등으로 확인
```

## 이미지 교체 / 페이지 수정

1. `originals/`의 JPG/PNG 파일을 교체하거나 추가
2. 최적화 실행: `npm install && npm run optimize`
3. 국가 목록을 바꿨다면 `scripts/build-pages.mjs`의 `countries` 배열을 수정 후 `npm run build-pages`

원본은 `originals/`에 그대로 보존됩니다. 서비스에는 `images/`의 최적화 버전이 사용됩니다.

## 배포 (Vercel)

- main 브랜치 푸시 시 자동 배포
- `.vercelignore`로 `originals/`, `scripts/`, `node_modules/` 제외

## 도메인 (ilovekorea.ai → Vercel)

1. Vercel 프로젝트 → Settings → Domains에서 `ilovekorea.ai`와 `www.ilovekorea.ai` 둘 다 추가
2. Vercel이 보여주는 DNS 레코드를 Cafe24 DNS 관리 화면에 등록
   - `@` (루트) → A 레코드 `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`
3. DNS 전파 후 Vercel이 자동으로 SSL(Let's Encrypt) 발급
4. www↔루트 리다이렉트는 Vercel 도메인 설정에서 "Redirect to" 옵션으로 지정 (보통 루트로 통일 권장)

> Cafe24 호스팅(웹호스팅)을 사용 중이라면 DNS만 다른 곳을 가리켜도 호스팅 비용이 청구될 수 있습니다. 호스팅이 필요 없다면 도메인만 유지하세요.
