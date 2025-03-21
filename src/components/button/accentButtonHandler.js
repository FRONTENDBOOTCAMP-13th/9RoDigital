/**
 * 여러 버튼 그룹의 액센트 버튼 기능을 하는 모듈 JS입니다.
 * 각 그룹에서는 한 번에 하나의 버튼만 active 가능합니다.
 */
const initAccentButtons = function () {
  // 페이지 로딩이 끝났는지 확인해서 이벤트 추가 방법 결정
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtonGroups);
  } else {
    setupButtonGroups();
  }
};

/**
 * 버튼 클릭 이벤트 핸들러
 * @param {NodeList} accentButtons - 버튼 그룹 내 모든 액센트 버튼들
 * @param {HTMLElement} clickedButton - 클릭된 버튼 요소
 */
function handleButtonClick(accentButtons, clickedButton) {
  // 그룹의 모든 버튼을 확인
  accentButtons.forEach((btn) => {
    // 지금 클릭한 버튼인지 확인
    const isClickedButton = btn === clickedButton;
    // 이미 활성화된 버튼인지 확인 (불필요한 DOM 변경 방지용)
    const isCurrentlyActive = btn.classList.contains('button-active');

    // 클릭한 버튼이 아직 활성화되지 않았으면 활성화
    if (isClickedButton && !isCurrentlyActive) {
      btn.classList.remove('button-inactive');
      btn.classList.add('button-active');
      btn.setAttribute('aria-selected', 'true');
    }
    // 클릭하지 않은 버튼이 활성화되어 있으면 비활성화
    else if (!isClickedButton && isCurrentlyActive) {
      btn.classList.remove('button-active');
      btn.classList.add('button-inactive');
      btn.setAttribute('aria-selected', 'false');
    }
  });
}

/**
 * 페이지에 있는 모든 버튼 그룹에 클릭 이벤트를 추가합니다.
 * 버튼 그룹은 data-group 속성을 가지고 있어야 합니다.
 */
function setupButtonGroups() {
  const buttonGroups = document.querySelectorAll('[data-group]');

  buttonGroups.forEach((group) => {
    const accentButtons = group.querySelectorAll('.accent-btn');

    accentButtons.forEach((button) => {
      // 클로저를 사용하여 핸들러 함수에 필요한 값들을 전달
      button.addEventListener('click', () => {
        handleButtonClick(accentButtons, button);
      });
    });
  });
}

export default initAccentButtons;