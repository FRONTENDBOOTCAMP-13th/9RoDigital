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

// 로컬 스토리지 키
const STORAGE_KEY = 'accordion_states';
const VISITED_KEY = 'accordion_visited';

// 캐싱을 위한 변수
let accordionHeaders = null;

/**
 * 아코디언 초기화 함수
 */
const initAccordions = function() {
  // 페이지 이동 여부를 확인하기 위한 플래그
  const navEntries = performance.getEntriesByType('navigation');
  const isPageReload = navEntries.some((nav) => nav.type === 'reload');
  const isBackForward = navEntries.some((nav) => nav.type === 'back_forward');

  // 페이지 로딩 상태에 따라 이벤트 등록
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupAccordions(isPageReload, isBackForward));
  } else {
    setupAccordions(isPageReload, isBackForward);
  }
}

/**
 * 페이지에 있는 모든 아코디언 요소에 이벤트를 추가합니다.
 * @param {boolean} isPageReload - 페이지 새로고침으로 방문한 경우 true
 * @param {boolean} isBackForward - 페이지 뒤로가기/앞으로가기로 방문한 경우 true
 */
function setupAccordions(isPageReload, isBackForward) {
  // 데이터 속성으로 모든 아코디언 헤더 선택 및 캐싱
  accordionHeaders = document.querySelectorAll(SELECTORS.HEADER);

  // 초기화 전략 선택
  if (isPageReload) {
    // 새로고침: 기본 상태로 리셋, 방문 기록 초기화
    clearVisitedRecords();
    resetToDefaultState();
  } else if (isBackForward) {
    // 뒤로가기: 저장된 상태 복원, 방문 기록 적용
    restoreAccordionStates();
    applyVisitedStyle();
  } else {
    // 첫 방문: 첫 번째 아코디언 열기 또는 저장된 상태 복원
    const openAccordions = document.querySelectorAll(`${SELECTORS.HEADER}[aria-expanded="true"]`);
    if (openAccordions.length === 0 && accordionHeaders.length > 0) {
      toggleAccordion(accordionHeaders[0]);
      saveAccordionStates();
    } else {
      restoreAccordionStates();
    }
  }

  // 이벤트 위임을 통한 클릭 이벤트 한 번만 등록
  document.removeEventListener('click', handleAccordionClick); // 중복 등록 방지
  document.addEventListener('click', handleAccordionClick);

  // 리사이즈 이벤트 처리
  setupResizeHandler();
}

/**
 * 아코디언 클릭 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 */
function handleAccordionClick(event) {
  const header = event.target.closest(SELECTORS.HEADER);
  if (header) {
    markAsVisited(header);
    toggleAccordion(header);
    saveAccordionStates();
  }
}

/**
 * 리사이즈 이벤트 핸들러 설정
 */
function setupResizeHandler() {
  // 디바운스를 위한 타이머
  let resizeTimer;
  window.removeEventListener('resize', handleResize); // 중복 등록 방지

  window.addEventListener('resize', handleResize);

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const openAccordions = document.querySelectorAll(`${SELECTORS.HEADER}[aria-expanded="true"]`);
      if (!openAccordions.length) return;

      requestAnimationFrame(() => {
        openAccordions.forEach((header) => {
          const content = header.nextElementSibling;
          if (content && content.style.maxHeight) {
            content.style.maxHeight = `${content.scrollHeight}px`;
          }
        });
      });
    }, 100); // 100ms 디바운스
  }
}

/**
 * 방문 기록을 초기화합니다
 */
function clearVisitedRecords() {
  localStorage.removeItem(VISITED_KEY);
}

/**
 * 아코디언을 방문 기록에 추가합니다
 * @param {HTMLElement} header - 아코디언 헤더 요소
 */
function markAsVisited(header) {
  try {
    const visitedJson = localStorage.getItem(VISITED_KEY) || '{}';
    const visited = JSON.parse(visitedJson);

    visited[getHeaderIdentifier(header)] = true;

    localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  } catch (error) {
    console.error('방문 기록 저장 중 오류:', error);
  }
}

/**
 * 아코디언 헤더 요소의 식별자를 가져옵니다
 * @param {HTMLElement} header - 아코디언 헤더 요소
 * @return {string} - 아코디언 식별자
 */
function getHeaderIdentifier(header) {
  // 캐싱된 식별자가 있으면 반환
  if (header.dataset.accordionId) {
    return header.dataset.accordionId;
  }

  // 식별자 생성 및 캐싱
  let identifier;
  const span = header.querySelector('span');

  if (span && span.textContent.trim()) {
    identifier = span.textContent.trim();
  } else if (header.textContent.trim()) {
    identifier = header.textContent.trim();
  } else {
    identifier = `accordion-${Array.from(accordionHeaders).indexOf(header)}`;
  }

  // 식별자를 data 속성에 캐싱
  header.dataset.accordionId = identifier;

  return identifier;
}

/**
 * 방문 기록에 따라 아코디언 스타일을 적용합니다
 */
function applyVisitedStyle() {
  try {
    const visitedJson = localStorage.getItem(VISITED_KEY);
    if (!visitedJson) return;

    const visited = JSON.parse(visitedJson);

    for (const header of accordionHeaders) {
      const headerText = getHeaderIdentifier(header);

      if (visited[headerText] && header.getAttribute('aria-expanded') !== 'true') {
        header.classList.add(CLASSES.INACTIVE);
      }
    }
  } catch (error) {
    console.error('방문 기록 적용 중 오류:', error);
  }
}

/**
 * 아코디언 요소의 열기/닫기를 토글합니다.
 * @param {HTMLElement} header - 아코디언 헤더 요소
 */
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  if (!content) return;

  header.getAttribute('aria-expanded') === 'true' ? closeAccordion(header) : openAccordion(header, content);
}

/**
 * 아코디언을 여는 함수
 * @param {HTMLElement} header - 아코디언 헤더
 * @param {HTMLElement} content - 아코디언 컨텐츠
 */
function openAccordion(header, content) {
  const icon = header.querySelector(SELECTORS.ICON);

  // 스타일 변경
  header.classList.remove(CLASSES.INACTIVE);
  header.style.backgroundColor = COLORS.ACTIVE;
  header.setAttribute('aria-expanded', 'true');
  content.setAttribute('aria-hidden', 'false');

  // 아이콘 회전
  if (icon) {
    icon.style.transform = 'rotate(180deg)';
    icon.style.transition = 'transform 0.3s ease';
  }

  // RAF로 최적화된 높이 설정
  requestAnimationFrame(() => {
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
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

  // 방문 기록에 따른 스타일 적용
  try {
    const visitedJson = localStorage.getItem(VISITED_KEY);
    if (visitedJson) {
      const visited = JSON.parse(visitedJson);
      const headerText = getHeaderIdentifier(header);

      // 방문한 적이 있으면 그레이 스타일 적용
      if (visited[headerText]) {
        header.classList.add(CLASSES.INACTIVE);
      } else {
        header.classList.remove(CLASSES.INACTIVE);
      }
    } else {
      header.classList.remove(CLASSES.INACTIVE);
    }
  } catch (error) {
    header.classList.remove(CLASSES.INACTIVE);
  }

  header.style.backgroundColor = '';
  header.setAttribute('aria-expanded', 'false');
  content.setAttribute('aria-hidden', 'true');
}

/**
 * 아코디언을 기본 상태로 초기화합니다 (첫 번째 아코디언만 열림)
 */
function resetToDefaultState() {
  if (!accordionHeaders.length) return;

  // 트랜지션을 일시적으로 비활성화하는 스타일
  const disableTransitions = createDisableTransitionsStyle();

  try {
    // 모든 아코디언 초기화
    accordionHeaders.forEach(resetAccordion);

    // 첫 번째 아코디언 열기
    const firstAccordion = accordionHeaders[0];
    openFirstAccordion(firstAccordion);

    // 상태 저장
    saveAccordionStates();
  } finally {
    // 트랜지션 다시 활성화
    setTimeout(() => {
      document.head.removeChild(disableTransitions);

      // 트랜지션 복원
      accordionHeaders.forEach(restoreTransitions);
    }, 100);
  }
}

/**
 * 트랜지션 비활성화 스타일을 생성하고 DOM에 추가
 * @return {HTMLElement} - 생성된 스타일 요소
 */
function createDisableTransitionsStyle() {
  const style = document.createElement('style');
  style.textContent = `
    [data-accordion="header"] + div {
      transition: none !important;
    }
    [data-accordion="header"] {
      transition: background-color 0s !important;
    }
  `;
  document.head.appendChild(style);
  return style;
}

/**
 * 단일 아코디언을 초기화 상태로 리셋
 * @param {HTMLElement} header - 아코디언 헤더
 */
function resetAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector(SELECTORS.ICON);

  header.classList.remove(CLASSES.INACTIVE);
  header.style.backgroundColor = '';
  header.setAttribute('aria-expanded', 'false');

  if (content) {
    content.style.maxHeight = null;
    content.setAttribute('aria-hidden', 'true');
  }

  if (icon) {
    icon.style.transform = 'rotate(0deg)';
    icon.style.transition = 'none';
  }
}

/**
 * 첫 번째 아코디언을 열린 상태로 설정
 * @param {HTMLElement} accordion - 첫 번째 아코디언 헤더
 */
function openFirstAccordion(accordion) {
  const content = accordion.nextElementSibling;
  const icon = accordion.querySelector(SELECTORS.ICON);

  if (!content) return;

  accordion.classList.remove(CLASSES.INACTIVE);
  accordion.style.backgroundColor = COLORS.ACTIVE;
  accordion.setAttribute('aria-expanded', 'true');
  content.setAttribute('aria-hidden', 'false');

  if (icon) {
    icon.style.transform = 'rotate(180deg)';
  }

  content.style.maxHeight = 'none';
  const height = content.scrollHeight;
  content.style.maxHeight = `${height}px`;

  markAsVisited(accordion);
}

/**
 * 트랜지션을 복원
 * @param {HTMLElement} header - 아코디언 헤더
 */
function restoreTransitions(header) {
  const icon = header.querySelector(SELECTORS.ICON);
  if (icon && header.getAttribute('aria-expanded') === 'true') {
    icon.style.transition = 'transform 0.3s ease';
  }
  if (header.getAttribute('aria-expanded') === 'true') {
    header.style.transition = 'background-color 0.3s ease';
  }
}

/**
 * 아코디언 상태를 로컬 스토리지에 저장
 */
function saveAccordionStates() {
  try {
    if (!accordionHeaders) return;

    const states = {};

    accordionHeaders.forEach((header) => {
      const headerText = getHeaderIdentifier(header);
      states[headerText] = header.getAttribute('aria-expanded') === 'true';
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch (error) {
    console.error('아코디언 상태 저장 중 오류:', error);
  }
}

/**
 * 로컬 스토리지에서 아코디언 상태를 복원
 */
function restoreAccordionStates() {
  try {
    const savedStates = localStorage.getItem(STORAGE_KEY);
    if (!savedStates || !accordionHeaders.length) return;

    const states = JSON.parse(savedStates);

    // 트랜지션 비활성화
    const disableTransitions = createDisableTransitionsStyle();

    try {
      // 모든 아코디언 초기화
      accordionHeaders.forEach(resetAccordion);

      // 저장된 상태에 따라 아코디언 열기
      accordionHeaders.forEach((header) => {
        const headerText = getHeaderIdentifier(header);
        if (states[headerText]) {
          openSavedAccordion(header);
        }
      });
    } finally {
      // 트랜지션 복원
      setTimeout(() => {
        document.head.removeChild(disableTransitions);
        accordionHeaders.forEach(restoreTransitions);
      }, 100);
    }
  } catch (error) {
    console.error('아코디언 상태 복원 중 오류:', error);
  }
}

/**
 * 저장된 상태의 아코디언을 열기
 * @param {HTMLElement} header - 아코디언 헤더
 */
function openSavedAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector(SELECTORS.ICON);

  if (!content) return;

  header.classList.remove(CLASSES.INACTIVE);
  header.style.backgroundColor = COLORS.ACTIVE;
  header.setAttribute('aria-expanded', 'true');
  content.setAttribute('aria-hidden', 'false');

  if (icon) {
    icon.style.transform = 'rotate(180deg)';
    icon.style.transition = 'none';
  }

  content.style.maxHeight = 'none';
  const height = content.scrollHeight;
  content.style.maxHeight = `${height}px`;

  markAsVisited(header);
}

// DOM 컨텐츠 로드 완료 후 높이 재계산
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(recalculateOpenAccordions, 300);
});

/**
 * 열린 아코디언의 높이를 재계산
 */
function recalculateOpenAccordions() {
  const openAccordions = document.querySelectorAll(`${SELECTORS.HEADER}[aria-expanded="true"]`);
  if (!openAccordions.length) return;

  openAccordions.forEach((header) => {
    const content = header.nextElementSibling;
    if (!content) return;

    // 새 높이 측정 및 적용
    content.style.maxHeight = 'none';
    const scrollHeight = content.scrollHeight;

    // 강제 리플로우 및 새 높이 설정
    requestAnimationFrame(() => {
      content.style.maxHeight = `${scrollHeight}px`;
    });
  });
}

export default initAccordions;