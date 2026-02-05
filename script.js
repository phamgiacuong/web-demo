const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];

// Định dạng tiền
function formatCurrency(price) {
    let num = price.toString().replace(/\D/g, '');
    return num ? new Intl.NumberFormat('vi-VN').format(num) + ' ₫' : price;
}

// Gọi API lấy danh sách sản phẩm từ Netlify Blobs
async function fetchProducts() {
    const res = await fetch('/.netlify/functions/get-products');
    const data = await res.json();
    window.products = data || [];
    renderProducts();
}

async function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const cat = document.getElementById('pCat').value;
    const desc = document.getElementById('pDesc').value;
    const img = document.getElementById('imgPreview').src;

    const btn = document.getElementById('btnSave');
    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;

    const payload = { 
        name, price, category: cat, desc, 
        images: editingIndex !== null ? window.products[editingIndex].images : currentImageList 
    };
    if (img && !img.includes('http')) payload.images = [img];

    await fetch('/.netlify/functions/save-product', {
        method: 'POST',
        body: JSON.stringify({ index: editingIndex, product: payload })
    });

    await fetchProducts();
    closeAdminModal();
    btn.disabled = false;
    btn.innerText = "LƯU SẢN PHẨM";
}

function renderProducts(data = window.products) {
    const list = document.getElementById('productList');
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-2">
            <div class="img-container mb-3 border"><img src="${p.images[0]}" class="w-full h-full object-contain"></div>
            <div class="text-center">
                <h3 class="text-xs text-gray-700 mb-2 line-clamp-2 h-8 uppercase">${p.name}</h3>
                <p class="text-red-600 font-bold text-lg">${formatCurrency(p.price)}</p>
            </div>
        </div>
    `).join('');
}

// Khởi tạo
fetchProducts();