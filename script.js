/* ================= GLOBAL ================= */

let products = [];
let currentProduct = null;
let currentImgIndex = 0;

/* ADMIN */
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let adminImages = [];
const MAX_IMAGES = 8;

/* ================= FETCH PRODUCTS ================= */

async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        products = await res.json();
        renderProducts();
        if (!document.getElementById('adminModal')?.classList.contains('hidden')) {
            renderAdminList();
        }
    } catch (e) {
        console.error(e);
    }
}

/* ================= HOME RENDER ================= */

function renderProducts(list = products) {
    const el = document.getElementById('productList');
    if (!el) return;

    el.innerHTML = list.map((p, i) => `
    <div onclick="openDetail(${i})"
      class="product-card animate-pop"
      style="animation-delay:${i * 0.06}s">
      <div class="aspect-square mb-3 flex items-center justify-center">
        <img src="${p.images[0]}" class="object-contain max-h-full">
      </div>
      <h3 class="text-xs font-bold uppercase leading-tight">${p.name}</h3>
      <p class="product-price mt-2">
        ${new Intl.NumberFormat('vi-VN').format(p.price)}đ
      </p>
    </div>
  `).join('');
}

/* ================= PRODUCT DETAIL ================= */

function openDetail(i) {
    currentProduct = products[i];
    currentImgIndex = 0;

    modalName.innerText = currentProduct.name;
    modalPrice.innerText =
        new Intl.NumberFormat('vi-VN').format(currentProduct.price) + 'đ';
    modalDesc.innerText = currentProduct.desc;

    updateModalImage();

    modalThumbnails.innerHTML = currentProduct.images.map((src, idx) => `
    <img src="${src}"
      onclick="selectThumb(${idx})"
      class="${idx === 0 ? 'active' : ''}">
  `).join('');

    productModal.classList.remove('hidden');
}

function updateModalImage() {
    modalMainImg.style.opacity = '0.3';
    setTimeout(() => {
        modalMainImg.src = currentProduct.images[currentImgIndex];
        modalMainImg.style.opacity = '1';
    }, 120);
}

function selectThumb(i) {
    currentImgIndex = i;
    updateModalImage();
    document.querySelectorAll('#modalThumbnails img').forEach((el, idx) => {
        el.classList.toggle('active', idx === i);
    });
}

function nextImage() {
    currentImgIndex =
        (currentImgIndex + 1) % currentProduct.images.length;
    updateModalImage();
}

function prevImage() {
    currentImgIndex =
        (currentImgIndex - 1 + currentProduct.images.length) %
        currentProduct.images.length;
    updateModalImage();
}

modalMainImg.onclick = () => {
    lightboxImg.src = modalMainImg.src;
    lightbox.classList.remove('hidden');
};

function closeProductModal() {
    productModal.classList.add('hidden');
    currentProduct = null;
}

function closeLightbox() {
    lightbox.classList.add('hidden');
}

/* ================= SEARCH + FILTER ================= */

function handleSearch(e) {
    const v = e.target.value.toLowerCase();
    renderProducts(products.filter(p =>
        p.name.toLowerCase().includes(v)
    ));
}

function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat')
        .forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');

    renderProducts(
        cat === 'Tất cả'
            ? products
            : products.filter(p => p.category === cat)
    );
}

/* ================= ADMIN SECRET ================= */

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

    if (e.key === 'Escape') {
        closeProductModal();
        closeLightbox();
        closeAdmin();
    }
});

/* ================= ADMIN LIST ================= */

function renderAdminList() {
    adminList.innerHTML = products.map((p, i) => `
    <div class="admin-item" draggable="true" data-index="${i}">
      <img src="${p.images[0]}">
      <div class="admin-item-name">${p.name}</div>
      <div class="admin-actions">
        <button class="edit" onclick="editProduct(${i})">Sửa</button>
        <button class="delete" onclick="deleteProduct(${i})">Xoá</button>
      </div>
    </div>
  `).join('');
}

/* ================= ADMIN EDIT / ADD ================= */

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

function saveAdminProduct() {
    if (!adminImages.length) {
        alert("Cần ít nhất 1 ảnh!");
        return;
    }

    const payload = {
        name: aName.value,
        price: aPrice.value,
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
    }).then(() => {
        fetchProducts();
        editingIndex = null;
        adminImages = [];
        renderPreview();
    });
}

function addNewProduct() {
    editingIndex = null;
    adminImages = [];
    renderPreview();
}

/* ================= ADMIN DELETE (OPTIMISTIC) ================= */

function deleteProduct(i) {
    if (!confirm("Xoá sản phẩm này?")) return;

    products.splice(i, 1);
    renderAdminList();
    renderProducts();

    fetch('/api/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            index: i,
            isDelete: true
        })
    });
}

/* ================= IMAGE UPLOAD (MULTI) ================= */

aFile.addEventListener('change', (e) => {
    [...e.target.files].forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (adminImages.length >= MAX_IMAGES) {
            alert(`Tối đa ${MAX_IMAGES} ảnh`);
            return;
        }

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

    if (typeof imgCount !== 'undefined') {
        imgCount.innerText = adminImages.length;
    }
}

function removeImg(i) {
    adminImages.splice(i, 1);
    renderPreview();
}

/* ================= INIT ================= */

fetchProducts();