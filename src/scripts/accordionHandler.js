/**
 * 아코디언 기능을 관리하는 모듈 JS입니다.
 * 페이지 내 아코디언 요소의 접기/펼치기 기능을 관리합니다.
 */
export function initAccordions() {
  // 페이지 로딩이 끝났는지 확인해서 이벤트 추가 방법 결정
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAccordions);
  } else {
    setupAccordions();
  }
}

/**
 * 페이지에 있는 모든 아코디언 요소에 클릭 이벤트를 추가합니다.
 * 아코디언 헤더는 data-accordion="header" 속성을 가지고 있어야 합니다.
 */
function setupAccordions() {
  // 데이터 속성으로 모든 아코디언 헤더 선택
  const accordionHeaders = document.querySelectorAll('[data-accordion="header"]');
  
  // 각 아코디언 헤더에 클릭 이벤트 추가
  accordionHeaders.forEach((header) => {
    // onclick 속성 제거 (인라인 이벤트 핸들러 제거)
    header.removeAttribute('onclick');
    
    // 클릭 이벤트 추가
    header.addEventListener('click', () => {
      toggleAccordion(header);
    });
  });
  
  // 페이지 로드 시 첫 번째 아코디언 열기
  if (accordionHeaders.length > 0) {
    const firstAccordion = accordionHeaders[0];
    toggleAccordion(firstAccordion);
  }
}

/**
 * 아코디언 요소의 열기/닫기를 토글합니다.
 * @param {HTMLElement} element - 아코디언 헤더 요소
 */
function toggleAccordion(element) {
  const content = element.nextElementSibling;
  const icon = element.querySelector('[data-accordion="icon"]');
  
  // 아코디언 컨텐츠 토글
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    if (icon) icon.style.transform = 'rotate(0deg)';
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}