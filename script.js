let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];
let editingProduct = null;
let currentImgIndex = 0;

// --- 1. ĐỒNG BỘ DỮ LIỆU ---
async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        if (!res.ok) throw new Error("Lỗi tải dữ liệu");
        products = await res.json();
        renderProducts();
        if (!document.getElementById('adminModal').classList.contains('hidden')) {
            renderAdminList();
        }
    } catch (err) { console.error(err); }
}

// --- 2. HÀM ĐÓNG TẤT CẢ POPUP (FIX LỖI DẤU X) ---
function closeAllModals() {
    // Đóng Admin Modal
    const adminModal = document.getElementById('adminModal');
    if (adminModal) adminModal.classList.replace('flex', 'hidden');

    // Đóng Product Modal
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.replace('flex', 'hidden');

    // Đóng Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.replace('flex', 'hidden');

    // Reset trạng thái
    editingIndex = null;
    editingProduct = null;
    clearForm();
}

// --- 3. CHI TIẾT SẢN PHẨM & ZOOM ---
function openDetail(i) {
    const p = products[i];
    editingProduct = p;
    currentImgIndex = 0;

    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalPrice').innerText = new Intl.NumberFormat('vi-VN').format(p.price) + 'đ';
    document.getElementById('modalDesc').innerText = p.desc;

    updateModalImage();

    const thumbContainer = document.getElementById('modalThumbnails');
    thumbContainer.innerHTML = p.images.map((src, idx) => `
        <img src="${src}" onclick="selectThumb(${idx})" 
             class="w-16 h-16 object-cover border-2 rounded-lg cursor-pointer transition-all ${idx === 0 ? 'border-red-500 scale-105' : 'border-transparent opacity-60'}">
    `).join('');

    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

// Phóng to ảnh
document.getElementById('modalMainImg').onclick = function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = this.src;
    lightbox.classList.replace('hidden', 'flex');
};

function updateModalImage() {
    const imgElement = document.getElementById('modalMainImg');
    imgElement.style.opacity = '0';
    setTimeout(() => {
        imgElement.src = editingProduct.images[currentImgIndex];
        imgElement.style.opacity = '1';
        const thumbs = document.querySelectorAll('#modalThumbnails img');
        thumbs.forEach((t, idx) => {
            t.classList.toggle('border-red-500', idx === currentImgIndex);
            t.classList.toggle('scale-105', idx === currentImgIndex);
            t.classList.toggle('opacity-60', idx !== currentImgIndex);
        });
    }, 150);
}

// Điều hướng ảnh
function nextImage() {
    if(editingProduct?.images.length > 1) {
        currentImgIndex = (currentImgIndex + 1) % editingProduct.images.length;
        updateModalImage();
    }
}
function prevImage() {
    if(editingProduct?.images.length > 1) {
        currentImgIndex = (currentImgIndex - 1 + editingProduct.images.length) % editingProduct.images.length;
        updateModalImage();
    }
}

// --- 4. QUẢN TRỊ ADMIN ---
async function saveProduct() {
    const nameEl = document.getElementById('pName');
    const priceEl = document.getElementById('pPrice');
    const btn = document.getElementById('btnSave');

    if (!nameEl.value || !priceEl.value || currentImageList.length === 0) return alert("Thiếu thông tin!");

    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;

    try {
        const payload = {
            name: nameEl.value,
            price: priceEl.value.replace(/\D/g, ''),
            category: document.getElementById('pCat').value,
            desc: document.getElementById('pDesc').value,
            images: currentImageList
        };

        const res = await fetch('/api/save-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: editingIndex, product: payload, isDelete: false })
        });

        if (res.ok) {
            btn.innerText = "THÀNH CÔNG!";
            btn.style.backgroundColor = "#16a34a";
            await fetchProducts(); // Tải lại & cập nhật admin list luôn

            setTimeout(() => {
                clearForm();
                editingIndex = null;
                btn.innerText = "LƯU SẢN PHẨM";
                btn.style.backgroundColor = "";
                btn.disabled = false;
                nameEl.focus();
            }, 1000);
        }
    } catch (err) { alert("Lỗi hệ thống!"); btn.disabled = false; }
}

function renderAdminList() {
    const list = document.getElementById('adminManageList');
    if (!list) return;
    list.innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b items-center bg-white hover:bg-red-50 transition-colors">
            <div class="flex items-center gap-3">
                <img src="${p.images[0]}" class="w-10 h-10 object-cover rounded shadow-sm">
                <span class="text-[11px] font-bold text-gray-700 truncate w-32 uppercase">${p.name}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="editProduct(${i})" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-[9px] font-bold rounded">SỬA</button>
                <button onclick="deleteProduct(${i})" class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 text-[9px] font-bold rounded">XÓA</button>
            </div>
        </div>`).join('');
}

function editProduct(i) {
    editingIndex = i;
    const p = products[i];
    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pCat').value = p.category;
    document.getElementById('pDesc').value = p.desc;
    currentImageList = p.images;
    const preview = document.getElementById('previewContainer');
    preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="h-20 rounded-lg shadow-md">`).join('');
    preview.classList.remove('hidden');
    document.getElementById('pName').focus();
}

// --- 5. TIỆN ÍCH KHÁC ---
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div class="aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                <img src="${p.images[0]}" class="max-w-full max-h-full object-contain">
            </div>
            <div class="text-center">
                <h3 class="text-xs font-bold text-gray-800 h-8 line-clamp-2 uppercase leading-tight">${p.name}</h3>
                <p class="text-red-600 font-extrabold text-xl mt-2">${new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
            </div>
        </div>`).join('');
}

// Bàn phím
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeAllModals();
});

function closeProductModal() {
    document.getElementById('productModal').classList.replace('flex', 'hidden');
}
function closeAdminModal() {
    document.getElementById('adminModal').classList.replace('flex', 'hidden');
    clearForm(); // Reset form khi đóng
}

document.getElementById('modalMainImg').onclick = function() {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = this.src;
    lb.classList.replace('hidden', 'flex');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        closeAdminModal();
        closeLightbox();
    }
});
// Khởi chạy
fetchProducts();