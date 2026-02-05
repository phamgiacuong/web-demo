let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];
let editingProduct = null;
let currentImgIndex = 0;

// 1. TẢI DỮ LIỆU
async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        if (!res.ok) throw new Error("Lỗi API");
        products = await res.json();
        renderProducts();
        if (!document.getElementById('adminModal').classList.contains('hidden')) {
            renderAdminList();
        }
    } catch (err) { console.error(err); }
}

// 2. HIỂN THỊ TRANG CHỦ
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    if (!list) return;
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col animate-fade-up" style="animation-delay: ${i * 0.05}s">
            <div class="aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                <img src="${p.images[0]}" class="max-w-full max-h-full object-contain">
            </div>
            <div class="flex-grow flex flex-col justify-between">
                <h3 class="text-xs font-bold text-gray-700 h-8 line-clamp-2 uppercase leading-tight">${p.name}</h3>
                <p class="text-red-600 font-extrabold text-lg mt-3">${new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
            </div>
        </div>`).join('');
}

// 3. CHI TIẾT SẢN PHẨM & ZOOM
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
        <img src="${src}" onclick="selectThumb(${idx})" class="w-16 h-16 object-cover border-2 rounded-lg cursor-pointer transition-all ${idx === 0 ? 'border-red-600 scale-105 shadow-md' : 'border-transparent opacity-50'}">
    `).join('');
    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

// Phóng to ảnh (Lightbox)
document.getElementById('modalMainImg').onclick = function() {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = this.src;
    lb.classList.replace('hidden', 'flex');
}

function closeLightbox() { document.getElementById('lightbox').classList.replace('flex', 'hidden'); }

function updateModalImage() {
    const imgEl = document.getElementById('modalMainImg');
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
        imgEl.src = editingProduct.images[currentImgIndex];
        imgEl.style.opacity = '1';
        const thumbs = document.querySelectorAll('#modalThumbnails img');
        thumbs.forEach((t, idx) => {
            t.classList.toggle('border-red-600', idx === currentImgIndex);
            t.classList.toggle('scale-105', idx === currentImgIndex);
            t.classList.toggle('opacity-50', idx !== currentImgIndex);
            t.classList.toggle('shadow-md', idx === currentImgIndex);
        });
    }, 150);
}

function selectThumb(idx) { currentImgIndex = idx; updateModalImage(); }
function nextImage() { if(editingProduct?.images.length > 1) { currentImgIndex = (currentImgIndex + 1) % editingProduct.images.length; updateModalImage(); } }
function prevImage() { if(editingProduct?.images.length > 1) { currentImgIndex = (currentImgIndex - 1 + editingProduct.images.length) % editingProduct.images.length; updateModalImage(); } }

// 4. ADMIN & SỬA LỖI ĐÓNG
function accessAdmin() {
    if (prompt("Mật khẩu quản trị:") === ADMIN_PASSWORD) {
        renderAdminList();
        document.getElementById('adminModal').classList.replace('hidden', 'flex');
    } else alert("Sai mật khẩu!");
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.replace('flex', 'hidden');
    editingIndex = null; clearForm();
}

function closeProductModal() {
    document.getElementById('productModal').classList.replace('flex', 'hidden');
    editingProduct = null;
}

async function saveProduct() {
    const nameEl = document.getElementById('pName');
    const priceEl = document.getElementById('pPrice');
    const btn = document.getElementById('btnSave');
    if (!nameEl.value || !priceEl.value || currentImageList.length === 0) return alert("Vui lòng điền đủ thông tin!");

    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;
    document.getElementById('loadingImg').classList.replace('hidden', 'flex');

    const payload = {
        name: nameEl.value,
        price: priceEl.value.replace(/\D/g, ''),
        category: document.getElementById('pCat').value,
        desc: document.getElementById('pDesc').value,
        images: currentImageList
    };

    try {
        const res = await fetch('/api/save-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: editingIndex, product: payload, isDelete: false })
        });
        if (res.ok) {
            await fetchProducts();
            setTimeout(() => {
                clearForm();
                editingIndex = null;
                btn.innerText = "Lưu sản phẩm";
                btn.disabled = false;
                document.getElementById('loadingImg').classList.replace('flex', 'hidden');
                nameEl.focus();
            }, 800);
        }
    } catch (err) { alert("Lỗi lưu dữ liệu!"); btn.disabled = false; }
}

// 5. CÁC TIỆN ÍCH KHÁC
function renderAdminList() {
    const list = document.getElementById('adminManageList');
    list.innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b items-center bg-white hover:bg-red-50 transition-colors rounded-lg">
            <div class="flex items-center gap-2">
                <img src="${p.images[0]}" class="w-10 h-10 object-cover rounded-lg shadow-sm">
                <span class="text-[10px] uppercase font-bold truncate w-24 text-gray-600">${p.name}</span>
            </div>
            <div class="flex gap-1">
                <button onclick="editProduct(${i})" class="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-all"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button onclick="deleteProduct(${i})" class="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
        </div>`).join('');
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat').forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');
    renderProducts(cat === 'Tất cả' ? products : products.filter(p => p.category === cat));
}

// BÀN PHÍM & KHỞI CHẠY
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProductModal(); closeAdminModal(); closeLightbox(); }
    if (!document.getElementById('productModal').classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    }
});

fetchProducts();