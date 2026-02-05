let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];
let editingProduct = null;
let currentImgIndex = 0;

// 1. TẢI DỮ LIỆU & TỰ ĐỘNG TẠO BẢNG
async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        if (!res.ok) throw new Error("Lỗi kết nối API");
        products = await res.json();
        renderProducts();

        // Cập nhật danh sách admin nếu đang mở
        const adminModal = document.getElementById('adminModal');
        if (adminModal && !adminModal.classList.contains('hidden')) {
            renderAdminList();
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

// 2. HIỂN THỊ TRANG CHỦ (GIỮ TEXT GỐC)
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    if (!list) return;
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-3 bg-white rounded-lg shadow-sm border border-gray-100 animate-slide-up">
            <div class="aspect-square mb-3 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                <img src="${p.images[0]}" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="text-center">
                <h3 class="text-xs font-semibold text-gray-700 h-8 line-clamp-2 uppercase leading-tight">${p.name}</h3>
                <p class="text-red-600 font-bold text-lg mt-2">${new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
            </div>
        </div>`).join('');
}

// 3. CHI TIẾT SẢN PHẨM & LIGHTBOX
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
             class="w-16 h-16 object-cover border-2 rounded cursor-pointer transition-all ${idx === 0 ? 'border-red-500 scale-105' : 'border-transparent opacity-60'}">
    `).join('');

    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

// Phóng to ảnh (Lightbox)
document.getElementById('modalMainImg').onclick = function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = this.src;
        lightbox.classList.replace('hidden', 'flex');
    }
};

function closeLightbox() {
    document.getElementById('lightbox').classList.replace('flex', 'hidden');
}

function updateModalImage() {
    const imgElement = document.getElementById('modalMainImg');
    if (!imgElement || !editingProduct) return;
    imgElement.style.opacity = '0.3';
    setTimeout(() => {
        imgElement.src = editingProduct.images[currentImgIndex];
        imgElement.style.opacity = '1';
        const thumbs = document.querySelectorAll('#modalThumbnails img');
        thumbs.forEach((t, idx) => {
            t.classList.toggle('border-red-500', idx === currentImgIndex);
            t.classList.toggle('opacity-60', idx !== currentImgIndex);
        });
    }, 100);
}

function selectThumb(idx) {
    currentImgIndex = idx;
    updateModalImage();
}

function nextImage() {
    if (editingProduct?.images.length > 1) {
        currentImgIndex = (currentImgIndex + 1) % editingProduct.images.length;
        updateModalImage();
    }
}

function prevImage() {
    if (editingProduct?.images.length > 1) {
        currentImgIndex = (currentImgIndex - 1 + editingProduct.images.length) % editingProduct.images.length;
        updateModalImage();
    }
}

// 4. QUẢN TRỊ ADMIN (FIX LỖI accessAdmin)
function accessAdmin() {
    const pass = prompt("Nhập mật khẩu quản trị:");
    if (pass === ADMIN_PASSWORD) {
        renderAdminList();
        document.getElementById('adminModal').classList.replace('hidden', 'flex');
    } else {
        alert("Sai mật khẩu!");
    }
}

async function saveProduct() {
    const nameEl = document.getElementById('pName');
    const priceEl = document.getElementById('pPrice');
    const btn = document.getElementById('btnSave');

    if (!nameEl.value || !priceEl.value || currentImageList.length === 0) return alert("Vui lòng điền đủ thông tin!");

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
            await fetchProducts();
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

// HÀM ĐÓNG MODAL (FIX LỖI DẤU X)
function closeAdminModal() {
    document.getElementById('adminModal').classList.replace('flex', 'hidden');
    editingIndex = null;
    clearForm();
}

function closeProductModal() {
    document.getElementById('productModal').classList.replace('flex', 'hidden');
}

// 5. CÁC TIỆN ÍCH
function renderAdminList() {
    const list = document.getElementById('adminManageList');
    if (!list) return;
    list.innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b items-center bg-white hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-2">
                <img src="${p.images[0]}" class="w-8 h-8 object-cover rounded">
                <span class="text-[10px] uppercase font-bold truncate w-32">${p.name}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="editProduct(${i})" class="bg-gray-100 px-3 py-1 text-[9px] font-bold rounded hover:bg-gray-200">SỬA</button>
                <button onclick="deleteProduct(${i})" class="text-red-500 border border-red-500 px-3 py-1 text-[9px] font-bold rounded">XÓA</button>
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
    preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="h-20 rounded shadow">`).join('');
    preview.classList.remove('hidden');
    document.getElementById('pName').focus();
}

async function deleteProduct(i) {
    if (!confirm("Xác nhận xóa sản phẩm?")) return;
    try {
        await fetch('/api/save-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: i, product: null, isDelete: true })
        });
        await fetchProducts();
    } catch (err) { alert("Lỗi khi xóa!"); }
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

// XỬ LÝ ẢNH & BÀN PHÍM
async function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600;
                let width = img.width, height = img.height;
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
}

document.getElementById('pFileInput')?.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    if (files.length) {
        document.getElementById('loadingImg').classList.remove('hidden');
        currentImageList = await Promise.all(files.map(f => compressImage(f)));
        const preview = document.getElementById('previewContainer');
        preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="h-20 rounded shadow">`).join('');
        preview.classList.remove('hidden');
        document.getElementById('loadingImg').classList.add('hidden');
    }
});

function clearForm() {
    document.getElementById('pName').value = "";
    document.getElementById('pPrice').value = "";
    document.getElementById('pDesc').value = "";
    document.getElementById('previewContainer').innerHTML = "";
    document.getElementById('previewContainer').classList.add('hidden');
    document.getElementById('pFileInput').value = "";
    currentImageList = [];
}

document.addEventListener('keydown', (e) => {
    const pModal = document.getElementById('productModal');
    if (pModal && !pModal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') { closeProductModal(); closeLightbox(); }
    }
    if (e.key === 'Escape') closeAdminModal();
});

// KHỞI CHẠY
fetchProducts();