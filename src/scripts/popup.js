// 쿠키 가져오기
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// 쿠키 설정하기
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function () {
  // 이미 오늘 다시 보지 않기 설정이 되어 있다면 팝업을 띄우지 않음
  if (getCookie('hidePopup') !== 'true') {
    const overlay = document.createElement('div');
    overlay.style = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.5); z-index: 999;
        `;

    const popup = document.createElement('div');
    popup.style = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            padding: 20px; background-color: white; border: 1px solid #333;
            border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center; z-index: 1000;
        `;
    popup.innerHTML = `
            <p>본 사이트는 상업적 이용을 목적으로 한 것이 아니며,<br> 순수하게 포트폴리오 용도로 제작된 것입니다. <br> 아래의 ‘닫기’ 버튼을 클릭하시는 경우, 상기 안내 사항에 동의하신 것으로 간주하겠습니다.</p>
            <div style="display: flex; justify-content: center; align-items: center;  margin-top: 4px;">
              <label style="display: block; cursor: pointer;">
                <input type="checkbox" style="margin-right: 5px;" id="noShowToday">
                  오늘 다시 보지 않기
              </label>
              <button style="
                  margin-left: 12px; padding: 4px 12px; border-radius: 4px; border: none;
                  background-color: #333; color: white; cursor: pointer;
              ">닫기</button>
            </div>
        `;

    const closeButton = popup.querySelector('button');
    const noShowToday = popup.querySelector('#noShowToday');

    closeButton.addEventListener('click', () => {
      if (noShowToday.checked) {
        setCookie('hidePopup', 'true', 1); // 하루 동안 유지
      }
      overlay.remove();
      popup.remove();
    });

    document.body.append(overlay, popup);
  }
});
