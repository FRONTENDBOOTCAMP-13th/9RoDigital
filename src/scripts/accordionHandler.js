/**
 * 아코디언 기능을 관리하는 모듈
 * 페이지 내 아코디언 요소의 접기/펼치기 기능을 관리합니다.
 */

// 상수 정의
const SELECTORS = {
  HEADER: '[data-accordion="header"]',
  ICON: '[data-accordion="icon"]',
};

const CLASSES = {
  INACTIVE: 'bg-gray-100',
  ACTIVE: 'accordion-active',
};

const COLORS = {
  ACTIVE: '#FFEF6D',
};

/**
 * 아코디언 초기화 함수
 */
export function initAccordions() {
  // 페이지 로딩 상태에 따라 이벤트 등록
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAccordions);
  } else {
    setupAccordions();
  }
}

/**
 * 페이지에 있는 모든 아코디언 요소에 이벤트를 추가합니다.
 */
function setupAccordions() {
  // 데이터 속성으로 모든 아코디언 헤더 선택
  const accordionHeaders = document.querySelectorAll(SELECTORS.HEADER);

  // 이벤트 위임을 통한 이벤트 처리
  document.addEventListener('click', (event) => {
    const header = event.target.closest(SELECTORS.HEADER);
    if (header) {
      toggleAccordion(header);
    }
  });

  // 페이지 로드 시 첫 번째 아코디언 열기 (필요한 경우)
  if (accordionHeaders.length > 0) {
    toggleAccordion(accordionHeaders[0]);
  }
}

/**
 * 아코디언 요소의 열기/닫기를 토글합니다.
 * @param {HTMLElement} header - 아코디언 헤더 요소
 */
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  if (!content) return;

  const icon = header.querySelector(SELECTORS.ICON);
  const isOpen = content.style.maxHeight !== '';

  // 동일한 부모 요소 내의 다른 아코디언 닫기 (선택적 기능)
  const parent = header.parentElement;
  if (parent) {
    const siblings = parent.querySelectorAll(SELECTORS.HEADER);
    siblings.forEach((accordion) => {
      if (accordion !== header) {
        closeAccordion(accordion);
      }
    });
  }

  // 아코디언 상태 토글
  if (isOpen) {
    closeAccordion(header);
  } else {
    openAccordion(header, content, icon);
  }
}

/**
 * 아코디언을 여는 함수
 * @param {HTMLElement} header - 아코디언 헤더
 * @param {HTMLElement} content - 아코디언 컨텐츠
 * @param {HTMLElement} icon - 아코디언 아이콘
 */
function openAccordion(header, content, icon) {
  // 애니메이션을 위한 maxHeight 설정
  content.style.maxHeight = `${content.scrollHeight}px`;

  // 아이콘 회전
  if (icon) {
    icon.style.transform = 'rotate(180deg)';
    icon.style.transition = 'transform 0.3s ease';
  }

  // 스타일 변경
  header.classList.remove(CLASSES.INACTIVE);
  header.style.backgroundColor = COLORS.ACTIVE;
  header.setAttribute('aria-expanded', 'true');
  content.setAttribute('aria-hidden', 'false');
}

/**
 * 아코디언을 닫는 함수
 * @param {HTMLElement} header - 아코디언 헤더
 */
function closeAccordion(header) {
  const content = header.nextElementSibling;
  if (!content) return;

  const icon = header.querySelector(SELECTORS.ICON);

  // 애니메이션을 위한 maxHeight 초기화
  content.style.maxHeight = null;

  // 아이콘 회전 복원
  if (icon) {
    icon.style.transform = 'rotate(0deg)';
  }

  // 스타일 변경
  header.classList.add(CLASSES.INACTIVE);
  header.style.backgroundColor = '';
  header.setAttribute('aria-expanded', 'false');
  content.setAttribute('aria-hidden', 'true');
}

// 창 크기 변경 시 열린 아코디언의 높이 재계산
window.addEventListener('resize', () => {
  const openAccordions = document.querySelectorAll(`${SELECTORS.HEADER}[aria-expanded="true"]`);
  openAccordions.forEach((header) => {
    const content = header.nextElementSibling;
    if (content && content.style.maxHeight) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});
