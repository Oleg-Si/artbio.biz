const menu = document.querySelector('.menu');
const menuBtn = document.querySelector('.menu__btn');

menuBtn.addEventListener('click', (e) => {
  e.preventDefault();
  menu.classList.toggle('acive');
})
