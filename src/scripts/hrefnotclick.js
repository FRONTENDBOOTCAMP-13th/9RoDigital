export function preventHashLinkClicks() {
  const topButton = document.querySelector('.top-button');
  const hideScrollThreshold = window.innerHeight * 0.7; // 뷰포트 높이의 0.7배 기준

  // 상단 버튼이 존재할 경우에만 스크롤 이벤트 및 클릭 이벤트 추가
  if (topButton) {
    let ticking = false;

    // 스크롤 위치에 따라 버튼 표시/숨김 처리 (성능 최적화)
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 뷰포트 높이의 0.7배 미만일 때 버튼 숨기기
          topButton.style.display = window.scrollY < hideScrollThreshold ? 'none' : 'block';
          ticking = false;
        });
        ticking = true;
      }
    });

    // 상단 버튼 클릭 시 부드럽게 스크롤 처리
    topButton.addEventListener('click', (event) => {
      event.preventDefault();
      // 브라우저 호환성을 고려한 부드러운 스크롤 방식
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드러운 스크롤 효과
      });
    });
  }

  // 해시 링크의 기본 동작 방지
  const links = document.querySelectorAll('a[href="#"]:not(.top-button *)');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      // URL에서 해시 제거 (페이지 리로드 없이)
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
    });
  });
}
