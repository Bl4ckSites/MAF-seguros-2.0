document.addEventListener('DOMContentLoaded', function () {
  // ===== SIMULADOR FORM =====
  const simuladorForm = document.getElementById('simuladorForm');
  
  if (simuladorForm) {
    simuladorForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Coletar dados do formulário
      const formData = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        tipoPlano: document.getElementById('tipoPlano').value
      };
      
      // Criar mensagem personalizada para WhatsApp
      const mensagem = `Olá! Meu nome é ${formData.nome}.%0A%0A` +
                       `Gostaria de receber um estudo de custos para plano de saúde.%0A%0A` +
                       `📋 Dados:%0A` +
                       `• Tipo de plano: ${formData.tipoPlano}%0A` +
                       `• Telefone: ${formData.telefone}%0A` +
                       `• Email: ${formData.email}`;
      
      // Número do WhatsApp
      const whatsappNumber = '5521964305535';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensagem}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappURL, '_blank');
      
      // Limpar formulário
      simuladorForm.reset();
      
      // Mostrar mensagem de sucesso (opcional)
      alert('Redirecionando para o WhatsApp...');
    });
  }
  
  // ===== MÁSCARA PARA TELEFONE =====
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      }
      
      e.target.value = value;
    });
  }
  
  // ===== ANIMAÇÃO AO SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos para animação
  document.querySelectorAll('.plano-card, .seguradora-card, .beneficio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Adicionar classe animated via CSS
  const style = document.createElement('style');
  style.textContent = `
    .plano-card.animated,
    .seguradora-card.animated,
    .beneficio-item.animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});