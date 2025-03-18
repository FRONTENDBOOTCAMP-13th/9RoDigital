import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // 기본 index.html
        landing: '/src/components/landing/landing.html', // Main 랜딩 섹션
        header: '/src/components/header/header.html', // 헤더
        footer: '/src/components/footer/footer.html', // 푸터
        login: '/src/components/login/login.html', // 로그인 페이지
        member: '/src/components/member/member.html', // 멤버 페이지
        button: '/src/components/button/button.html', // 버튼
        signup: '/src/components/mypage/mypage.html', // 마이 페이지
        quote: '/src/components/section8/section8.html', // 오늘의 한 문장
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
  server: {
    // open: 'src/pages/main/index.html', // 서버 시작 시 브라우저에서 지정페이지 자동으로 열기
  },
});
