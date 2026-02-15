// Gestión del carrito con localStorage
let cart = [];

// Número de WhatsApp para cotizaciones (cámbialo)
const WA_PHONE = "573001234567"; // Formato internacional sin +

// Cargar carrito desde localStorage
function loadCart() {
    const stored = localStorage.getItem('oneplaymore_cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
    updateCartUI();
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('oneplaymore_cart', JSON.stringify(cart));
    updateCartUI();
}


// Agregar producto al carrito (VERSIÓN CORREGIDA)
function addToCart(product, quantity = 1, selectedOptions = {}) {
    // ✅ Asegurar que la imagen existe
    const productImage = product.images && product.images[0] 
        ? product.images[0] 
        : 'images/products/placeholder.jpg';

    const existingItem = cart.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: productImage,
            selectedOptions: selectedOptions,
            quantity: quantity
        });
    }

    if (typeof showToast === 'function') {
        showToast('✓ Producto añadido al carrito');
    }
    saveCart();
    showCartModal();
}



// Eliminar item del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Actualizar cantidad
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        saveCart();
    }
}

// Calcular subtotal
function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Actualizar contador del carrito y vista del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Tu carrito está vacío.</p>';
        } else {
cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
            <div class="cart-item-header">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString('es-CO')}</div>
            </div>
            ${Object.entries(item.selectedOptions).length > 0 ? 
                `<div class="cart-item-options">
                    ${Object.entries(item.selectedOptions).map(([key, val]) => `<span class="cart-option">${key}: ${val}</span>`).join('')}
                </div>` 
                : ''}
            <div class="cart-item-actions">
                <button class="cart-qty-btn" onclick="decrementCartItem(${index})">−</button>
                <span class="cart-qty">${item.quantity}</span>
                <button class="cart-qty-btn" onclick="incrementCartItem(${index})">+</button>
                <button class="cart-remove-btn" onclick="removeCartItem(${index})" title="Eliminar">✕</button>
            </div>
        </div>
    </div>
`).join('');
        }
    }

    // Actualizar subtotal en el carrito
    const subtotalSpan = document.getElementById('cartSubtotal');
    if (subtotalSpan) {
        subtotalSpan.textContent = `$${getCartSubtotal().toLocaleString('es-CO')}`;
    }
}

// Funciones auxiliares para botones (se llaman desde onclick)
window.incrementCartItem = function(index) {
    updateQuantity(index, cart[index].quantity + 1);
};

window.decrementCartItem = function(index) {
    updateQuantity(index, cart[index].quantity - 1);
};

window.removeCartItem = function(index) {
    removeFromCart(index);
};

// Generar mensaje para WhatsApp
function generateWhatsAppMessage() {
    if (cart.length === 0) return "Hola, quiero cotizar productos pero mi carrito está vacío.";
    
    let message = "¡Hola! Quiero cotizar los siguientes productos:\n\n";
    cart.forEach(item => {
        message += `• ${item.name}`;
        if (Object.keys(item.selectedOptions).length > 0) {
            message += ` (${Object.entries(item.selectedOptions).map(([k,v]) => `${k}:${v}`).join(', ')})`;
        }
        message += ` - Cant: ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
    });
    message += `\nSubtotal: $${getCartSubtotal().toLocaleString('es-CO')}\n`;
    message += "Por favor, confirma disponibilidad y costo de envío. ¡Gracias!";
    return encodeURIComponent(message);
}

// Abrir WhatsApp con cotización
function openWhatsAppQuote() {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${WA_PHONE}?text=${message}`, '_blank');
}

// Vaciar carrito (después de pedido exitoso)
function clearCart() {
    cart = [];
    saveCart();
}