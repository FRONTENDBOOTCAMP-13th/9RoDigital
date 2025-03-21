//검색창 - 검색어 미입력 시 팝업창
document.getElementById('searchButton').addEventListener('click', function () {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput.value.trim()) {
    alert('검색어를 입력하세요.');
  }
});

//랭킹 - 랭킹 열기접기 버튼
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('ranking-toggle');
  const rankList = document.getElementById('rank-list');
  const chevronIcon = document.getElementById('chevron-icon');

  // Set initial state
  let isOpen = false;

  // First image shows collapsed state, so rankList should start hidden
  rankList.classList.add('hidden');

  toggleButton.addEventListener('click', function () {
    isOpen = !isOpen;

    if (isOpen) {
      // Show the rank list
      rankList.classList.remove('hidden');
      // Rotate chevron up
      chevronIcon.classList.add('rotate-180');
    } else {
      // Hide the rank list
      rankList.classList.add('hidden');
      // Rotate chevron back
      chevronIcon.classList.remove('rotate-180');
    }
  });
});

//네비게이션 - 누르면 이동합니다
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.p-8');

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    navLinks.forEach((item) => item.classList.remove('font-bold', 'border-b-2', 'border-gray-700'));
    link.classList.add('font-bold', 'border-b-2', 'border-gray-700');

    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});
