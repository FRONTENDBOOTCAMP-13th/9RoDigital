/**
 * 네비게이션 링크에 부드러운 스크롤 기능을 추가하는 함수
 */
const smoothScroll = function () {
  const navLinks = document.querySelectorAll('.scroll-smooth');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventㅋDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
};

export default smoothScroll;
