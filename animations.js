/* ==========================================================================
   ANIMATIONS.JS - Som de Clique, Animação de Cards e Menu Lateral
   NÃO duplica nenhuma funcionalidade do app.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  
  // ==========================================================================
  // 1. SOM DE CLIQUE (Web Audio API - sem arquivos externos)
  // ==========================================================================
  
  let audioContext = null;
  
  // Inicializar AudioContext apenas após primeira interação do usuário
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  
  // Tocar som de clique sutil
  function playClickSound() {
    if (!audioContext || audioContext.state !== 'running') return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Som curto e suave (tipo "click" moderno)
    oscillator.frequency.value = 900;
    oscillator.type = 'sine';
    
    // Volume bem baixo e duração curta
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  }
  
  // Tocar som de clique mais grave (para botões principais)
  function playPrimaryClickSound() {
    if (!audioContext || audioContext.state !== 'running') return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
  }
  
  // Ativar audioContext na primeira interação
  document.addEventListener('click', initAudioContext, { once: true });
  document.addEventListener('touchstart', initAudioContext, { once: true });
  
  // Adicionar som de clique em botões e links principais
  const clickElements = document.querySelectorAll(
    '.btn, .btn-plano, .btn-simular, .btn-whatsapp, .btn-outline, .btn-large, .btn-small'
  );
  
  clickElements.forEach(element => {
    element.addEventListener('click', function () {
      if (this.classList.contains('btn-whatsapp') || this.classList.contains('btn-plano')) {
        playPrimaryClickSound();
      } else {
        playClickSound();
      }
    });
  });
  
  // Som sutil em links do menu
  const menuLinks = document.querySelectorAll('.nav-list a, .dropdown-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function () {
      playClickSound();
    });
  });
  
  // ==========================================================================
  // 2. ANIMAÇÃO DE CARDS AO SCROLL (Intersection Observer)
  // ==========================================================================
  
  const animatedCards = document.querySelectorAll(
    '.animate-card-up, .animate-card-left, .animate-card-right, .animate-card-zoom, .animate-card-flip'
  );
  
  if (animatedCards.length > 0) {
    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Inicia a animação quando o card entra na viewport
          entry.target.style.animationPlayState = 'running';
          cardObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedCards.forEach(function (card) {
      // Pausa a animação até o card entrar na viewport
      card.style.animationPlayState = 'paused';
      cardObserver.observe(card);
    });
  }
  
  // ==========================================================================
  // 3. ANIMAÇÃO DO MENU LATERAL (MOBILE)
  // ==========================================================================
  
  const menuToggle = document.getElementById('menu-toggle');
  const body = document.body;
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      // Som ao abrir/fechar menu
      playClickSound();
    });
  }
  
  // ==========================================================================
  // 4. EFEITO RIPPLE EM BOTÕES (Material Design)
  // ==========================================================================
  
  const rippleButtons = document.querySelectorAll('.animate-ripple');
  
  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Adicionar keyframe do ripple dinamicamente
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);
  
  // ==========================================================================
  // 5. ANIMAÇÃO DE BADGES E DESTAQUES
  // ==========================================================================
  
  // Badges "Mais Popular", "EXCLUSIVO", etc.
  const badges = document.querySelectorAll('.plano-badge, .highlight');
  
  if (badges.length > 0) {
    const badgeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-bounce-in');
          badgeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    badges.forEach(badge => badgeObserver.observe(badge));
  }
  
  // ==========================================================================
  // 6. ANIMAÇÃO DO BOTÃO WHATSAPP FLOAT
  // ==========================================================================
  
  const waFloat = document.getElementById('wa-float');
  
  if (waFloat) {
    // Adicionar efeito de "atenção" periódico
    setInterval(function () {
      if (document.visibilityState === 'visible') {
        waFloat.classList.add('animate-tada');
        setTimeout(() => {
          waFloat.classList.remove('animate-tada');
        }, 1000);
      }
    }, 8000); // A cada 8 segundos
    
    // Som ao clicar no WhatsApp
    waFloat.addEventListener('click', function () {
      playPrimaryClickSound();
    });
  }
  
  // ==========================================================================
  // 7. ANIMAÇÃO DE FORMULÁRIO COM ERRO
  // ==========================================================================
  
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      const requiredFields = form.querySelectorAll('[required]');
      let hasError = false;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          hasError = true;
          field.classList.add('animate-shake');
          setTimeout(() => {
            field.classList.remove('animate-shake');
          }, 600);
        }
      });
      
      if (hasError) {
        e.preventDefault();
        playClickSound();
      }
    });
  });
  
  // ==========================================================================
  // 8. ANIMAÇÃO DE ENTRADA DA PÁGINA (Page Load)
  // ==========================================================================
  
  // Animar elementos com data-animate-on-load
  const loadAnimateElements = document.querySelectorAll('[data-animate-on-load]');
  
  loadAnimateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 * index);
  });
  
});