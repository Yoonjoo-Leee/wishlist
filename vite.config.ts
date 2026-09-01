import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 프로젝트 사이트는 /<repo>/ 하위 경로로 서빙되므로
// 배포 워크플로에서 VITE_BASE 로 그 경로를 넘긴다. 로컬/그 외 호스트는 "/".
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
