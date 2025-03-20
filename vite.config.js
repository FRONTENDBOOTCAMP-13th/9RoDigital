import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // 기본 index.html
        // 컴포넌트
        landing: '/src/components/landing/landing.html', // Main 랜딩 섹션
        header: '/src/components/header/header.html', // 헤더
        footer: '/src/components/footer/footer.html', // 푸터
        login: '/src/components/login/login.html', // 로그인 페이지
        member: '/src/components/member/member.html', // 멤버 페이지
        button: '/src/components/button/button.html', // 버튼
        signup: '/src/components/mypage/mypage.html', // 마이 페이지
        title: '/src/components/title/title.html', // 타이틀
        frames: '/src/components/quote-frames/quote-frames.html', // 마이 페이지
        // 섹션들
        section1: '/src/components/section1/section1.html', // 마이 페이지
        ranking: '/src/components/section2/section2.html', // 밀리 랭킹
        section3: '/src/components/section3/section3.html', // 마이 페이지
        section4: '/src/components/section4/section4.html', // 마이 페이지
        section5: '/src/components/section5/original.html', // 밀리 오리지널
        section8: '/src/components/section8/section8.html', // 오늘의 한 문장
        frames: '/src/components/quote-frames/quote-frames.html', // 마이 페이지
        section7: '/src/components/section7/thisbook.html', // 이럴떈 이런책
        feed: './src/components/feed/feed.html', //피드
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
  server: {
    // open: 'src/pages/main/index.html', // 서버 시작 시 브라우저에서 지정페이지 자동으로 열기
  },
});
