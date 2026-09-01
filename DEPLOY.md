# 배포 (다른 기기에서 접속하기)

> 데이터는 **접속한 브라우저의 localStorage**에만 저장된다. 기기·브라우저가 다르면 목록도 따로 논다(동기화 안 됨).

## GitHub Pages (권장 · 무료 · PC 안 켜도 됨)

준비된 것: `.github/workflows/deploy.yml`(빌드→배포), `vite.config.ts`의 `base` 자동 주입, 해시 라우터.

1. **GitHub에 저장소 만들기** — github.com에서 새 저장소 생성 (private 가능). 저장소 이름은 아무거나 (예: `wishlist`).
2. **로컬 저장소 연결 & 푸시**
   ```bash
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```
3. **Pages 활성화** — 저장소 → **Settings → Pages → Build and deployment → Source: `GitHub Actions`** 선택.
4. push가 되면 **Actions** 탭에서 배포가 돌고, 끝나면 주소가 나온다:
   `https://<사용자명>.github.io/<저장소명>/`
5. 이후에는 `git push` 할 때마다 자동 재배포. (수동 실행: Actions → Deploy to GitHub Pages → Run workflow)

## Vercel / Netlify / Cloudflare Pages (대안)

해시 라우터라 별도 리라이트 설정이 필요 없다. 저장소를 연결하고 아래만 지정:

- Build command: `npm run build`
- Output directory: `dist`
- `VITE_BASE` 는 설정하지 않는다 (루트 `/` 로 서빙됨).

## 같은 Wi-Fi에서 폰으로 (임시)

```bash
npm run dev -- --host
```

출력된 `Network:` 주소(`http://192.168.x.x:5173`)를 폰 브라우저에 입력. PC가 켜져 있고 같은 공유기여야 한다.
