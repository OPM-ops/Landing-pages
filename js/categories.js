// categories.js
let allCategories = [];

async function loadCategories() {
  try {
    const response = await fetch('data/categories.json');
    allCategories = await response.json();
    renderCategories(allCategories.filter(cat => cat.active));
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

function renderCategories(activeCategories) {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  // Limpiar y dejar solo el botón "Todos"
  nav.innerHTML = `<button class="category-btn active" data-category="all">Todos</button>`;


// Agregar botón de Ofertas
const ofertasBtn = document.createElement('button');
ofertasBtn.className = 'category-btn';
ofertasBtn.dataset.category = 'ofertas';
ofertasBtn.innerHTML = '🔥 Ofertas';
nav.appendChild(ofertasBtn);

// Agregar botón de Novedades
const novedadesBtn = document.createElement('button');
novedadesBtn.className = 'category-btn';
novedadesBtn.dataset.category = 'novedades';
novedadesBtn.innerHTML = '✨ Novedades';
nav.appendChild(novedadesBtn);


  // Agregar categorías activas
  activeCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.dataset.category = cat.id;
    btn.innerHTML = cat.name; // sin icono, más limpio
    nav.appendChild(btn);
  });

  // Event listeners
  nav.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      nav.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterProductsByCategory(this.dataset.category);
    });
  });
}

function filterProductsByCategory(categoryId) {
  if (typeof allProducts === 'undefined') return;
  
  let filtered = [];
  
  if (categoryId === 'all') {
    filtered = allProducts;
  } else if (categoryId === 'ofertas') {
    filtered = allProducts.filter(p => p.bestSeller === true);
  } else if (categoryId === 'novedades') {
    filtered = allProducts.filter(p => p.new === true);
  } else {
    filtered = allProducts.filter(p => p.categoryId === categoryId);
  }
  
  renderProducts(filtered);
  scrollToProducts();
  
  if (typeof refreshAnimations === 'function') {
    refreshAnimations();
  }
}


// Función para hacer scroll suave a la sección de productos
function scrollToProducts() {
  const productsSection = document.querySelector('.products-section');
  if (productsSection) {
    productsSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

window.filterProductsByCategory = filterProductsByCategory;
