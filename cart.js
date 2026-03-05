const products = [
    {
        id: 1,
        name: 'Шапка «Зимняя сказка»',
        price: 2500,
        image: 'https://i127.fastpic.org/big/2026/0303/62/67706024ab7b665557c5acce5d8b4462.jpg ',
        description: 'Мягкая шапка из мериноса с помпоном'
    },
    {
        id: 2,
        name: 'Снуд «Облако»',
        price: 3200,
        image: 'https://i127.fastpic.org/big/2026/0303/31/39e5963fa71a7faa2431cfc19c606a31.webp ',
        description: 'Объемный снуд из альпаки'
    },
    {
        id: 3,
        name: 'Варежки «Уют»',
        price: 1900,
        image: 'https://i127.fastpic.org/big/2026/0303/01/a230f26da74f4a106e10849628c0ba01.webp ',
        description: 'Теплые варежки с норвежским узором'
    },
    {
        id: 4,
        name: 'Плед «Домашний»',
        price: 5900,
        image: 'https://i127.fastpic.org/big/2026/0303/9a/a6790a35fc2a9a0d9716bfc6401d609a.jpg ',
        description: 'Большой плед 150x200 см из мериноса'
    },
    {
        id: 5,
        name: 'Носки «Теплые»',
        price: 1200,
        image: 'https://i127.fastpic.org/big/2026/0303/aa/a0e89c5ccf07d31c512a9556b00df8aa.webp ',
        description: 'Домашние носки из деревенской шерсти'
    },
    {
        id: 6,
        name: 'Кардиган «Нежность»',
        price: 4500,
        image: 'https://i127.fastpic.org/big/2026/0303/d1/2f7949c61e370eb8c200d15ebf090fd1.webp',
        description: 'Уютный кардиган крупной вязки'
    }
];


let cart = [];
try {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
} catch(e) {
    cart = [];
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}


function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const counters = document.querySelectorAll('#cart-count-header');
    counters.forEach(counter => {
        if (counter) counter.textContent = count;
    });
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('Товар добавлен в корзину');
}


function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}


function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}


function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="cart-items">';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${(item.quantity || 1) - 1})">-</button>
                    <span class="quantity-input">${item.quantity || 1}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${(item.quantity || 1) + 1})">+</button>
                </div>
                <div class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
    });
    
    html += `</div>
        <div class="cart-total">
            <div class="total-line">
                <span>Итого:</span>
                <span>${total.toLocaleString()} ₽</span>
            </div>
            <button class="btn checkout-btn" onclick="checkout()">Оформить заказ</button>
        </div>
    `;
    
    cartContainer.innerHTML = html;
}


function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let message = 'Здравствуйте! Я хочу заказать:\n';
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity || 1} шт.) = ${(item.price * (item.quantity || 1)).toLocaleString()} ₽\n`;
    });
    message += `\nИтого: ${total.toLocaleString()} ₽`;
    
    window.open(`https://wa.me/79123456789?text=${encodeURIComponent(message)}`, '_blank');
}


function showNotification(text) {
    const notification = document.getElementById('notification');
    if (!notification) {
        const div = document.createElement('div');
        div.id = 'notification';
        div.className = 'notification';
        div.textContent = text;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.classList.add('show');
            setTimeout(() => {
                div.classList.remove('show');
                setTimeout(() => div.remove(), 300);
            }, 2000);
        }, 100);
    } else {
        notification.textContent = text;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-container')) {
        displayCart();
    }
});