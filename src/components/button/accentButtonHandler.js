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
 * 페이지에 있는 모든 버튼 그룹에 클릭 이벤트를 추가합니다.
 * 버튼 그룹은 data-group 속성을 가지고 있어야 합니다.
 */
function setupButtonGroups() {
  const buttonGroups = document.querySelectorAll('[data-group]');
  buttonGroups.forEach((group) => {
    const accentButtons = group.querySelectorAll('.accent-btn');
    accentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // 그룹의 모든 버튼을 확인
        accentButtons.forEach((btn) => {
          // 지금 클릭한 버튼인지 확인
          const isClickedButton = btn === button;
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
      });
    });
  });
}

export default initAccentButtons;
