/**
 * 네비게이션 링크에 부드러운 스크롤 기능을 추가하는 함수
 */
const smoothScroll = function () {
  const navLinks = document.querySelectorAll('.scroll-smooth');

  // 이벤트 핸들러 함수를 분리하여 재사용
  const handleClick = function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // 각 링크에 이벤트 리스너 추가
  navLinks.forEach((link) => {
    link.addEventListener('click', handleClick);
  });
};

export default smoothScroll;
