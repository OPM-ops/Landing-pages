document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    renderHeroSection();
    await loadCategories();     
    await loadCarousel();
    loadCart();
    setupFooterLinks();         
});


// Cargar banners del carrusel
async function loadCarousel() {
    try {
        const response = await fetch('data/banners.json');
        const banners = await response.json();
        renderCarousel(banners);
        initCarousel();
    } catch (error) {
        console.error('Error cargando banners:', error);
    }
}

function renderCarousel(banners) {
    const container = document.getElementById('carouselContainer');
    const dotsContainer = document.getElementById('carouselDots');
    
    container.innerHTML = banners.map((banner, index) => `
        <div class="carousel-slide" style="background-image: url('${banner.image}');">
            <div class="carousel-content">
                <h3>${banner.title}</h3>
                <p>${banner.subtitle}</p>
                <a href="${banner.link}" class="btn-carousel" target="${banner.link.startsWith('http') ? '_blank' : ''}">${banner.buttonText}</a>
            </div>
        </div>
    `).join('');
    
    dotsContainer.innerHTML = banners.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('');
}

// Lógica del carrusel
let currentSlide = 0;
let slideInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!slides.length) return;
    
    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentSlide = index;
        document.querySelector('.carousel-container').style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetInterval();
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            showSlide(parseInt(this.dataset.index));
            resetInterval();
        });
    });
    
    // Auto-slide cada 5 segundos
    slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }
}

// Manejar clics en los enlaces del footer (VERSIÓN CON IDS)
function setupFooterLinks() {
  console.log('🔗 Configurando enlaces del footer...');

  // 1. PRODUCTOS → Filtrar TODOS
  const productosLink = document.getElementById('footer-productos-link');
  if (productosLink) {
    console.log('✅ Enlace Productos encontrado');
    productosLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🟣 Clic en Productos - ejecutando filtro "all"');
      
      // Activar botón "Todos" en el menú
      const nav = document.querySelector('.main-nav');
      if (nav) {
        nav.querySelectorAll('.category-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.category === 'all') {
            btn.classList.add('active');
          }
        });
      }

      // Llamar al filtro global
      if (typeof window.filterProductsByCategory === 'function') {
        window.filterProductsByCategory('all');
      } else {
        console.error('❌ filterProductsByCategory no está definida');
      }
    });
  } else {
    console.error('❌ No se encontró el enlace con ID footer-productos-link');
  }

  // 2. OFERTAS → Filtrar bestSeller
  const ofertasLink = document.getElementById('footer-ofertas-link');
  if (ofertasLink) {
    ofertasLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🔥 Clic en Ofertas');
      
      const nav = document.querySelector('.main-nav');
      if (nav) {
        nav.querySelectorAll('.category-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.category === 'ofertas') {
            btn.classList.add('active');
          }
        });
      }

      if (typeof window.filterProductsByCategory === 'function') {
        window.filterProductsByCategory('ofertas');
      }
    });
  }

  // 3. NOVEDADES → Filtrar new
  const novedadesLink = document.getElementById('footer-novedades-link');
  if (novedadesLink) {
    novedadesLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('✨ Clic en Novedades');
      
      const nav = document.querySelector('.main-nav');
      if (nav) {
        nav.querySelectorAll('.category-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.category === 'novedades') {
            btn.classList.add('active');
          }
        });
      }

      if (typeof window.filterProductsByCategory === 'function') {
        window.filterProductsByCategory('novedades');
      }
    });
  }

  // 4. CONTACTO → Scroll al footer
  const contactoLink = document.getElementById('footer-contacto-link');
  if (contactoLink) {
    contactoLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('📞 Clic en Contacto');
      const footer = document.querySelector('.site-footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}