/* ================== GLOBAL ================== */

let products = [];
let filteredProducts = [];
let currentProduct = null;
let currentImgIndex = 0;

/* ADMIN */
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let adminImages = [];
const MAX_IMAGES = 8;

/* ================== FETCH PRODUCTS ================== */

async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        products = await res.json();
        filteredProducts = [...products];
        renderProducts(filteredProducts);
        renderAdminList();
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

/* ================== RENDER LIST ================== */

function renderProducts(list) {
    const el = document.getElementById('productList');
    if (!el) return;

    el.innerHTML = list.map((p, i) => `
    <div class="product-card" onclick="openDetail(${products.indexOf(p)})">
      <img src="${p.images[0]}" class="product-img">
      <h3 class="product-name">${p.name}</h3>
      <p class="product-price">
        ${new Intl.NumberFormat('vi-VN').format(p.price)}đ
      </p>
    </div>
  `).join('');
}

/* ================== SEARCH ================== */

function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();

    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );

    renderProducts(filteredProducts);
}

/* ================== FILTER CATEGORY ================== */

function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat')
        .forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');

    filteredProducts =
        cat === 'Tất cả'
            ? [...products]
            : products.filter(p => p.category === cat);

    renderProducts(filteredProducts);
}

/* ================== PRODUCT MODAL ================== */

function openDetail(index) {
    currentProduct = products[index];
    currentImgIndex = 0;

    modalName.innerText = currentProduct.name;
    modalPrice.innerText =
        new Intl.NumberFormat('vi-VN').format(currentProduct.price) + 'đ';
    modalDesc.innerText = currentProduct.desc;

    modalMainImg.src = currentProduct.images[0];

    modalThumbnails.innerHTML = currentProduct.images.map((src, i) => `
    <img src="${src}"
         class="${i === 0 ? 'active' : ''}"
         onclick="selectThumb(${i})">
  `).join('');

    productModal.classList.remove('hidden');
}

function selectThumb(i) {
    currentImgIndex = i;
    modalMainImg.src = currentProduct.images[i];

    document.querySelectorAll('#modalThumbnails img')
        .forEach((img, idx) =>
            img.classList.toggle('active', idx === i)
        );
}

function nextImage() {
    currentImgIndex =
        (currentImgIndex + 1) % currentProduct.images.length;
    modalMainImg.src = currentProduct.images[currentImgIndex];
}

function prevImage() {
    currentImgIndex =
        (currentImgIndex - 1 + currentProduct.images.length)
        % currentProduct.images.length;
    modalMainImg.src = currentProduct.images[currentImgIndex];
}

function closeProductModal() {
    productModal.classList.add('hidden');
}

modalMainImg.onclick = () => {
    lightboxImg.src = modalMainImg.src;
    lightbox.classList.remove('hidden');
};

function closeLightbox() {
    lightbox.classList.add('hidden');
}

/* ================== ADMIN SECRET ================== */

function openAdmin() {
    const pass = prompt("Mật khẩu Admin:");
    if (pass === ADMIN_PASSWORD) {
        renderAdminList();
        adminModal.classList.remove('hidden');
    } else {
        alert("Sai mật khẩu!");
    }
}

function closeAdmin() {
    adminModal.classList.add('hidden');
    editingIndex = null;
    adminImages = [];
    renderPreview();
}

/* Ctrl + Shift + A */
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdmin();
    }
});

/* ================== ADMIN LIST ================== */

function renderAdminList() {
    if (!adminList) return;

    adminList.innerHTML = products.map((p, i) => `
    <div class="admin-item">
      <img src="${p.images[0]}">
      <div class="admin-item-name">${p.name}</div>
      <div class="admin-actions">
        <button class="edit" onclick="editProduct(${i})">Sửa</button>
        <button class="delete" onclick="deleteProduct(${i})">Xoá</button>
      </div>
    </div>
  `).join('');
}

/* ================== ADMIN EDIT ================== */

function editProduct(i) {
    const p = products[i];
    editingIndex = i;

    aName.value = p.name;
    aPrice.value = p.price;
    aCat.value = p.category;
    aDesc.value = p.desc;

    adminImages = [...p.images];
    renderPreview();
}

function addNewProduct() {
    editingIndex = null;
    aName.value = '';
    aPrice.value = '';
    aDesc.value = '';
    adminImages = [];
    renderPreview();
}

function saveAdminProduct() {
    if (!adminImages.length) {
        alert("Cần ít nhất 1 ảnh!");
        return;
    }

    const payload = {
        name: aName.value,
        price: Number(aPrice.value),
        category: aCat.value,
        desc: aDesc.value,
        images: adminImages
    };

    fetch('/api/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            index: editingIndex,
            product: payload,
            isDelete: false
        })
    }).then(fetchProducts);
}

function deleteProduct(i) {
    if (!confirm("Xoá sản phẩm này?")) return;

    fetch('/api/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            index: i,
            isDelete: true
        })
    }).then(fetchProducts);
}

/* ================== IMAGE UPLOAD ================== */

aFile.addEventListener('change', (e) => {
    [...e.target.files].forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (adminImages.length >= MAX_IMAGES) return;

        const reader = new FileReader();
        reader.onload = () => {
            adminImages.push(reader.result);
            renderPreview();
        };
        reader.readAsDataURL(file);
    });

    e.target.value = '';
});

function renderPreview() {
    imgPreview.innerHTML = adminImages.map((src, i) => `
    <div class="img-box">
      <img src="${src}">
      <button onclick="removeImg(${i})">×</button>
    </div>
  `).join('');
}

function removeImg(i) {
    adminImages.splice(i, 1);
    renderPreview();
}

/* ================== INIT ================== */

fetchProducts();