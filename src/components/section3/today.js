function updateDate() {
  const date = new Date();
  const weekDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = weekDays[date.getDay()];

  const formattedDate = `${month}월 ${day}일 ${weekDay} 업데이트`;
  const updateElement = document.getElementById('update-day');
  if (updateElement) {
    updateElement.textContent = formattedDate;
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
  updateDate();
});
