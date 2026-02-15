function renderHeroSection() {
  console.log('renderHeroSection ejecutada');
  console.log('allProducts:', allProducts);
  const heroProduct = allProducts.find(p => p.hero === true);
  console.log('heroProduct encontrado:', heroProduct);
  if (!heroProduct) return;

  const heroHTML = `
    <section class="hero-section container">
      <div class="hero-grid">
        <div class="hero-image">
          <img src="${heroProduct.images[0]}" 
     alt="${heroProduct.name}" 
     onerror="this.src='images/products/placeholder.jpg'; this.onerror=null;">
        </div>
        <div class="hero-content">
          <span class="hero-label">EDICIÓN LIMITADA</span>
          <h2 class="hero-title">${heroProduct.name}</h2>
          <p class="hero-description">${heroProduct.description}</p>
          <p class="hero-price">$${heroProduct.price.toLocaleString('es-CO')}</p>
          <button class="hero-btn btn-primary" data-product-id="${heroProduct.id}">
            Ver producto
          </button>
        </div>
      </div>
    </section>
  `;

  // Insertar después del carrusel y antes de productos
  const carousel = document.querySelector('.carousel-section');
  carousel.insertAdjacentHTML('afterend', heroHTML);

  // Evento del botón
  document.querySelector('.hero-btn').addEventListener('click', () => {
    openProductModal(heroProduct);
  });
}