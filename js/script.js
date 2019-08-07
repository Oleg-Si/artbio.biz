const menu = document.querySelector('.menu');
const menuBtn = document.querySelector('.menu__btn');
const slideSpeed = 700;

menuBtn.addEventListener('click', (e) => {
  e.preventDefault();
  menu.classList.toggle('active');
});

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;

$(window).resize(() => {
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
});

if (screenWidth >= 1200 && screenHeight >= 680) {
  let currentSlide = 1;
  const slideCount = document.querySelector('.main').children.length;
  let scrollValue = 0;

  const nextSlide = (clearStatus) => {
    if (currentSlide < slideCount) {
      const height = screenHeight * currentSlide;
      $('body,html').animate({scrollTop: height}, slideSpeed);
      currentSlide++;
      scrollValue += screenHeight;
    };
    clearStatus();
  }
  const beforeSlide = () => {
    if (currentSlide > 1) {
      const height = scrollValue - screenHeight;
      $('body,html').animate({scrollTop: height}, slideSpeed);
      currentSlide--;
      scrollValue -= screenHeight;
    };
    clearStatus();
  }

  let status = 0;

  const clearStatus = () => {
    setTimeout(() => {
      status = 0;
    }, slideSpeed)
  }

  $('.main').bind('mousewheel DOMMouseScroll', function(event){
    event.preventDefault();
    if (status == 0) {
      if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        status = 1;
        beforeSlide(clearStatus);
      } else {
        status = 1;
        nextSlide(clearStatus);
      }
    }
  });
}

$(".menu__item").on("click","a", function (event) {
  event.preventDefault();

  $('.menu__item').removeClass('active');
  const id  = $(this).attr('href');
  const top = $(id).offset().top;
  $('body,html').animate({scrollTop: top}, slideSpeed);
  $(this).parent().addClass('active');
  menu.classList.remove('active');
});

/* ---------------------------------------------------------------------------- */

const products = document.querySelectorAll('.products__item');
const overlay = document.querySelector('.overlay');

products.forEach((el) => {
  const btn = el.querySelector('.products__content');
  btn.addEventListener('click', () => {
    overlay.classList.add('overlay--open');

    const card = el.querySelector('.products__card').cloneNode(true);
    card.classList.add('products__card--open');
    overlay.appendChild(card);
  })
})

overlay.addEventListener('click', () => {
  overlay.classList.remove('overlay--open');
  overlay.innerHTML = '';
})
