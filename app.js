document.addEventListener('DOMContentLoaded', function () {
  // ===== STICKY HEADER =====
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.pageYOffset > 80);
  });

  // ===== HERO CAROUSEL =====
  const heroSlides = document.querySelectorAll('.carousel-slide');
  if (heroSlides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000); // Troca a cada 5 segundos
  }

  // ===== IMAGE CAROUSEL (Página de Seguros) =====
  const carouselImgs = document.querySelectorAll('.carousel-img');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  if (carouselImgs.length > 0) {
    let currentImg = 0;
    const showImage = (index) => {
      carouselImgs.forEach(img => img.classList.remove('active'));
      carouselDots.forEach(dot => dot.classList.remove('active'));
      carouselImgs[index].classList.add('active');
      carouselDots[index].classList.add('active');
      currentImg = index;
    };
    
    // Auto-play
    setInterval(() => {
      let next = (currentImg + 1) % carouselImgs.length;
      showImage(next);
    }, 4000);

    // Clique nos dots
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showImage(index));
    });
  }

  // ===== MENU MOBILE =====
  const toggle = document.getElementById('menu-toggle');
  const body = document.body;
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.toggle('nav-open');
      this.classList.toggle('open');
    });
  }

  dropdownToggles.forEach(function (toggler) {
    toggler.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        const parentDropdown = this.closest('.dropdown');
        if (parentDropdown) parentDropdown.classList.toggle('active');
      }
    });
  });

  document.querySelectorAll('.nav-list a, .dropdown-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        body.classList.remove('nav-open');
        if (toggle) toggle.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768 && body.classList.contains('nav-open')) {
      if (!e.target.closest('.main-nav') && !e.target.closest('.hamburger')) {
        body.classList.remove('nav-open');
        if (toggle) toggle.classList.remove('open');
      }
    }
  });

  // ===== CONTADOR DE ESTATÍSTICAS =====
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.ceil(current)) + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
            }
          };
          updateCounter();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.animate-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));
});