import './style.css';

// 현재 페이지 경로 확인
const currentPath = window.location.pathname;

// accentButtonHandler.js는 버튼 컴포넌트 페이지와 홈 페이지에서만 로드
// if (currentPath.includes('/src/components/button/button.html') || currentPath.includes('/src/pages/home/home.html')) {
//   import('/src/components/button/accentButtonHandler.js').then((module) => {
//     const initAccentButtons = module.default;
//     initAccentButtons();
//   });
// }

// initAccordions과 smoothScroll은 루트 경로의 index.html에서만 로드
if (currentPath === '/index.html' || currentPath === '/') {
  // accordionHandler 로드
  import('/src/scripts/accordionHandler.js').then((module) => {
    const initAccordions = module.default;
    initAccordions();
  });
  // smoothScroll 로드
  import('/src/scripts/smoothScroll.js').then((module) => {
    const smoothScroll = module.default;
    smoothScroll();
  });
}
