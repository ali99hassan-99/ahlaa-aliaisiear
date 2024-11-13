let cart = [];

function addToCart(id, name, price, image) {
    const item = { id, name, price, image, quantity: 1 };
    cart.push(item);
    updateCart();
    showNotification(`${name} تم إضافته إلى السلة`);
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${item.name} - السعر: ${item.price} دينار</p>
            <label>الكمية: <input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></label>
            <button onclick="removeFromCart(${index})">حذف</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    cartCount.textContent = cart.length;
    totalPriceElement.textContent = `المجموع: ${totalPrice} دينار`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQuantity(index, quantity) {
    if (quantity > 0) {
        cart[index].quantity = parseInt(quantity);
        updateCart();
    }
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

function openCheckoutForm() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('final-total').textContent = `المجموع: ${totalPrice} دينار`;
}

function closeCheckoutForm() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

function confirmOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (name && phone && address) {
        const orderData = {
            name: name,
            phone: phone,
            address: address,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0)
        };

        // إرسال البيانات إلى Google Apps Script باستخدام الرابط الذي نشرته
        fetch('https://script.google.com/macros/s/AKfycbwwxR8NI4xBlxWEX9WxByO9gFWxQLu1HQEMxGc_JZqZ-jKqFumkF6vRyZZ6RBVTljiO9Q/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`تم تأكيد الطلب من ${name}\nرقم الهاتف: ${phone}\nالعنوان: ${address}`);
                cart = [];
                updateCart();
                closeCheckoutForm();
            } else {
                alert('حدث خطأ في معالجة طلبك. من فضلك حاول مرة أخرى.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء إرسال الطلب. من فضلك حاول مرة أخرى.');
        });
    } else {
        alert('من فضلك أكمل جميع الحقول');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
