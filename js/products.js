// Carga y renderizado de productos desde JSON
let allProducts = [];

async function loadProducts() {
    try {
        // Mostrar loader
        document.getElementById('productsGrid').innerHTML = `<div class="pack-loader">
            <div class="pack"><div class="pack-front"></div><div class="pack-back"></div></div>
            <p>Abriendo sobre...</p>
        </div>`;

        const response = await fetch('data/products.json');
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('productsGrid').innerHTML = '<p>Error al cargar productos. Intenta recargar.</p>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

    // 1. Renderizar las tarjetas
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.images && product.images[0] ? product.images[0] : 'images/products/placeholder.jpg'}" 
     alt="${product.name}" 
     class="product-img" 
     loading="lazy"
     onerror="this.src='images/products/placeholder.jpg'; this.onerror=null;">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toLocaleString('es-CO')}</p>
                <button class="quick-view-btn" data-product-id="${product.id}">Vista rápida</button>
            </div>
        </div>
    `).join('');

    // 2. Evento para la tarjeta completa (abre modal completo)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn')) return;
            const productId = card.dataset.productId;
            const product = allProducts.find(p => p.id === productId);
            if (product) openProductModal(product);
        });
    });

    // 3. Evento específico para el botón "Vista rápida"
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            const product = allProducts.find(p => p.id === productId);
            if (product) openQuickView(product);
        });
    });

    // 4. INICIAR ANIMACIONES DE SCROLL (AQUÍ YA EXISTEN LAS TARJETAS)
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
}

// Obtener producto por ID
function getProductById(id) {
    return allProducts.find(p => p.id === id);
}