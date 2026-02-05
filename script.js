let products = [];
let currentImgIndex = 0;
let currentProduct = null;

async function fetchProducts() {
    const res = await fetch('/api/get-products');
    products = await res.json();
    renderProducts();
}

function renderProducts(list = products) {
    const el = document.getElementById('productList');
    el.innerHTML = list.map((p, i) => `
    <div onclick="openDetail(${i})"
      class="product-card animate-pop"
      style="animation-delay:${i * 0.06}s">
      <div class="aspect-square mb-3 flex items-center justify-center">
        <img src="${p.images[0]}" class="object-contain">
      </div>
      <h3 class="text-xs font-bold uppercase">${p.name}</h3>
      <p class="product-price mt-2">
        ${new Intl.NumberFormat('vi-VN').format(p.price)}đ
      </p>
    </div>
  `).join('');
}

function openDetail(i) {
    currentProduct = products[i];
    currentImgIndex = 0;

    modalName.innerText = currentProduct.name;
    modalPrice.innerText = new Intl.NumberFormat('vi-VN').format(currentProduct.price) + 'đ';
    modalDesc.innerText = currentProduct.desc;
    modalMainImg.src = currentProduct.images[0];

    modalThumbnails.innerHTML = currentProduct.images.map((img, idx) =>
        `<img src="${img}" onclick="selectImg(${idx})" class="${idx===0?'active':''}">`
    ).join('');

    productModal.classList.remove('hidden');
}

function selectImg(i) {
    currentImgIndex = i;
    modalMainImg.src = currentProduct.images[i];
    document.querySelectorAll('.thumbs img').forEach((el, idx) =>
        el.classList.toggle('active', idx === i)
    );
}

function nextImage() {
    selectImg((currentImgIndex + 1) % currentProduct.images.length);
}
function prevImage() {
    selectImg((currentImgIndex - 1 + currentProduct.images.length) % currentProduct.images.length);
}

modalMainImg.onclick = () => {
    lightboxImg.src = modalMainImg.src;
    lightbox.classList.remove('hidden');
};

function closeLightbox() {
    lightbox.classList.add('hidden');
}
function closeProductModal() {
    productModal.classList.add('hidden');
}

function handleSearch(e) {
    const v = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(v)));
}

function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat').forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');
    renderProducts(cat === 'Tất cả' ? products : products.filter(p => p.category === cat));
}
/* ================= ADMIN BASIC ================= */

const ADMIN_PASSWORD = "123";

function accessAdmin() {
    const pass = prompt("Nhập mật khẩu quản trị:");
    if (pass === ADMIN_PASSWORD) {
        alert("Admin mode (demo) 🚀\nBạn có thể mở modal quản lý ở đây.");
        // TODO: mở admin modal nếu bạn muốn
    } else {
        alert("Sai mật khẩu!");
    }
}
fetchProducts();