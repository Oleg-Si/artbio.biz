$(document).ready(() => {
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

  const slides = document.querySelectorAll('.main > section');
  const slidesArr = Array.from(slides);
  const cleanSlideStatus = () => {
    slides.forEach((el) => {
      el.classList.remove('active');
    })
  }

  slidesArr.some((el, i) => {
    if (el.classList.contains('active')) {
      const offset = el.getAttribute('data-offset');
      $('body,html').animate({scrollTop: offset}, slideSpeed);
      return el;
    }
  });

  if (screenWidth >= 1200 && screenHeight >= 680) {

    slides.forEach((el, i) => {
      el.setAttribute('data-offset', screenHeight * i);
    });

    const slideCount = slides.length;

    const changeMenu = (slideId) => {
      $('.menu__item').removeClass('active');
      const menuItems = menu.querySelectorAll('.menu__item');
      const menuItemsArr = Array.from(menuItems);
      menuItemsArr.some((el) => {
        const link = el.firstChild.getAttribute('data-link');
        if (link == slideId) {
          el.classList.add('active');
        }
      })
    }

    const nextSlide = (clearStatus) => {
      slidesArr.some((el, i) => {
        if (el.classList.contains('active')) {
          const nextSlide = el.nextElementSibling;
          if (nextSlide != null) {
            const offset = nextSlide.getAttribute('data-offset');
            const nextSlideId = nextSlide.getAttribute('id');
            changeMenu(nextSlideId);
            cleanSlideStatus();
            $('body,html').animate({scrollTop: offset}, slideSpeed);
            nextSlide.classList.add('active');
          }
          return el;
        }
      });
      clearStatus();
    }
    const beforeSlide = () => {
      slidesArr.some((el, i) => {
        if (el.classList.contains('active')) {
          const prevSlide = el.previousElementSibling;
          if (prevSlide != null) {
            const offset = prevSlide.getAttribute('data-offset');
            const prevSlideId = prevSlide.getAttribute('id');
            changeMenu(prevSlideId);
            cleanSlideStatus();
            $('body,html').animate({scrollTop: offset}, slideSpeed);
            prevSlide.classList.add('active')
          }
          return el;
        }
      });
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
    const link = $(this).parent().attr('data-link');
    const top = $(id).offset().top;

    cleanSlideStatus();
    document.getElementById(link).classList.add('active'); 

    $('body,html').animate({scrollTop: top}, slideSpeed);
    $(this).parent().addClass('active');
    menu.classList.remove('active');
  });

  /* ---------------------------------------------------------------------------- */

  const products = document.querySelectorAll('.products__item');
  const overlay = document.querySelector('.overlay');

  const cleanOverlay = () => {
    overlay.classList.remove('overlay--open');
    overlay.innerHTML = '';
  }

  products.forEach((el) => {
    el.addEventListener('click', () => {
      overlay.classList.add('overlay--open');

      const card = el.querySelector('.products__card').cloneNode(true);
      card.classList.add('products__card--open');
      card.querySelector('.products__card_btn-close').addEventListener('click', () => {
        cleanOverlay();
      })
      card.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      overlay.appendChild(card);
    })
  })

  overlay.addEventListener('click', () => {
    cleanOverlay();
  });

  new WOW({mobile: false}).init();

  if (screenWidth >= 1200) {
    WOW.prototype.addBox = function(element) {
      this.boxes.push(element);
    };

    var wow = new WOW();
    wow.init();

    $('.wow').on('scrollSpy:exit', function() {
      $(this).css({
        'visibility': 'hidden',
        'animation-name': 'none'
      }).removeClass('animated');
      wow.addBox(this);
    }).scrollSpy();
  }
})
