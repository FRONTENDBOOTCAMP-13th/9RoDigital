export function sidePopup() {
  // 팝업 요소 생성
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.className = `
    hidden lg:flex fixed top-1/2 left-4 transform -translate-y-1/2 z-50
    bg-white rounded-2xl shadow-lg p-6 w-50
  `;

  // 내부 콘텐츠 설정
  popup.innerHTML = `
    <div class="text-center w-full">
      <h2 class="text-xl font-bold mb-2">안내</h2>
      <p class="text-sm text-gray-700 mb-4">
        본 사이트는 상업적 이용을 목적으로 한 것이 아니며,
        순수하게 포트폴리오 용도로 제작된 것입니다.
      </p>
      <button id="closePopup" class="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition">
        닫기
      </button>
    </div>
  `;

  // body에 추가
  document.body.appendChild(popup);

  // 닫기 버튼 이벤트
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closePopup') {
      popup.style.display = 'none';
    }
  });
}
