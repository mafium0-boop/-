
document.addEventListener('DOMContentLoaded', () => {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    
    const featured = products.slice(0, 3);
    
    let html = '';
    featured.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">${product.price.toLocaleString()} ₽</span>
                        <button class="btn-small btn-add-to-cart" onclick="addToCart(${product.id})">
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    featuredContainer.innerHTML = html;
});