// Control de modales: producto, carrito, checkout
let currentProduct = null;

// Abrir modal de producto (VERSIÓN CORREGIDA)
function openProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('productModal');
    const body = document.getElementById('productModalBody');
    
    let attributesHTML = '';
    if (product.attributes && product.attributes.length > 0) {
        attributesHTML = product.attributes.map(attr => `
            <div class="attribute-selector">
                <label>${attr.name}:</label>
                <select id="attr-${attr.name}" class="product-attribute">
                    ${attr.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            </div>
        `).join('');
    }

    // ✅ GALERÍA CON ONERROR SEGURO
    const firstImage = product.images && product.images[0] ? product.images[0] : 'images/products/placeholder.jpg';
let galleryHTML = `<div class="product-image-container">
                    <img src="${firstImage}" 
                         alt="${product.name.replace(/"/g, '&quot;')}" 
                         class="main-image" 
                         id="mainProductImage"
                         onerror="this.onerror=null; this.src='images/products/placeholder.jpg';">
                   </div>`;

    
    if (product.images && product.images.length > 1) {
        galleryHTML += `<div class="thumbnail-list">`;
        product.images.forEach((img, idx) => {
            galleryHTML += `<img src="${img}" alt="thumb" class="thumbnail ${idx === 0 ? 'active' : ''}" 
                            onerror="this.onerror=null; this.src='images/products/placeholder.jpg';"
                            onclick="document.getElementById('mainProductImage').src='${img}'; document.querySelectorAll('.thumbnail').forEach(t=>t.classList.remove('active')); this.classList.add('active');">`;
        });
        galleryHTML += `</div>`;
    }

    // ✅ ESCAPAMOS LA DESCRIPCIÓN PARA EVITAR ERRORES
    const safeDescription = product.description.replace(/"/g, '&quot;').replace(/\n/g, ' ');

    body.innerHTML = `
        <div class="product-detail">
            <div class="product-gallery">
                ${galleryHTML}
            </div>
            <div class="product-detail-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-detail-price">$${product.price.toLocaleString('es-CO')}</p>
                <p>${safeDescription}</p>
                ${attributesHTML}
                <div class="quantity-selector">
                    <label>Cantidad:</label>
                    <input type="number" id="productQuantity" min="1" value="1">
                </div>
                <button id="addToCartFromModal" class="btn-add-cart">Añadir al carrito</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    
    // ✅ EVENTO DEL BOTÓN AÑADIR
    const addBtn = document.getElementById('addToCartFromModal');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('productQuantity').value, 10) || 1;
            const selectedOptions = {};
            if (product.attributes) {
                product.attributes.forEach(attr => {
                    const select = document.getElementById(`attr-${attr.name}`);
                    if (select) selectedOptions[attr.name] = select.value;
                });
            }
            addToCart(product, quantity, selectedOptions);
            
            if (typeof showToast === 'function') {
                showToast('✓ Producto añadido al carrito');
            }
        });
    }
}

// Abrir modal del carrito
function showCartModal() {
    updateCartUI();
    document.getElementById('cartModal').style.display = 'block';
}

// Abrir modal de checkout
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar el pedido.');
        return;
    }
    document.getElementById('checkoutModal').style.display = 'block';
    renderCheckoutStep1();
}

// Cerrar modales
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
    
    document.getElementById('cartIcon').addEventListener('click', showCartModal);
    document.getElementById('whatsappQuoteBtn').addEventListener('click', openWhatsAppQuote);
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);
});

// Vista rápida (VERSIÓN CORREGIDA)
function openQuickView(product) {
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'modal quick-view-modal';
    quickViewModal.innerHTML = `
        <div class="modal-content quick-view-content">
            <span class="close">&times;</span>
            <div class="quick-view-grid">
                <div class="quick-view-image-container">
                    <img src="${product.images && product.images[0] ? product.images[0] : 'images/products/placeholder.jpg'}" 
                         alt="${product.name.replace(/"/g, '&quot;')}" 
                         class="quick-view-img"
                         onerror="this.onerror=null; this.src='images/products/placeholder.jpg';">
                </div>
                <div class="quick-view-details">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-detail-price">$${product.price.toLocaleString('es-CO')}</p>
                    <p class="quick-view-description">${product.description.substring(0, 100)}...</p>
                    <button class="btn btn-primary quick-add-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(quickViewModal);
    quickViewModal.style.display = 'block';

    // Cerrar
    quickViewModal.querySelector('.close').addEventListener('click', () => {
        quickViewModal.remove();
    });
    
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.remove();
        }
    });

    // Botón añadir al carrito
    quickViewModal.querySelector('.quick-add-cart').addEventListener('click', () => {
        addToCart(product, 1, {});
        quickViewModal.remove();
        if (typeof showToast === 'function') {
            showToast('✓ Producto añadido al carrito');
        }
    });
}