let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];
let editingProduct = null;
let currentImgIndex = 0;

// --- HÀM TIỆN ÍCH ---

// Định dạng tiền tệ: 160000 -> 160.000đ
function formatPrice(p) {
    return new Intl.NumberFormat('vi-VN').format(p.toString().replace(/\D/g, '')) + 'đ';
}

// Hiển thị thông báo trạng thái trên nút Lưu
function showNotify(msg, isError = false) {
    const btn = document.getElementById('btnSave');
    if (btn) {
        const originalText = "LƯU SẢN PHẨM";
        btn.innerText = msg;
        btn.style.backgroundColor = isError ? "#dc2626" : "#16a34a"; // Đỏ nếu lỗi, Xanh nếu thành công
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
            btn.disabled = false;
        }, 2000);
    }
}

// --- CHỨC NĂNG CHÍNH ---

// 1. Tải dữ liệu từ API Vercel (Neon Database)
async function fetchProducts() {
    try {
        const res = await fetch('/api/get-products');
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Lỗi tải dữ liệu");
        }
        products = await res.json();
        renderProducts();
    } catch (err) {
        console.error("Fetch Error:", err);
        alert("KHÔNG THỂ TẢI DỮ LIỆU: " + err.message);
    }
}

// 2. Hiển thị danh sách sản phẩm ra màn hình chính
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    if (!list) return;
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div class="aspect-square mb-3 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                <img src="${p.images[0]}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform">
            </div>
            <div class="text-center">
                <h3 class="text-xs font-semibold text-gray-700 h-8 line-clamp-2 uppercase leading-tight">${p.name}</h3>
                <p class="text-red-600 font-bold text-lg mt-2">${formatPrice(p.price)}</p>
            </div>
        </div>`).join('');
}

// 3. Mở chi tiết sản phẩm (Kiểu Vitamin House)
function openDetail(i) {
    const p = products[i];
    editingProduct = p;
    currentImgIndex = 0;

    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalPrice').innerText = formatPrice(p.price);
    document.getElementById('modalDesc').innerText = p.desc;

    updateModalImage();

    // Render ảnh nhỏ (thumbnails)
    const thumbContainer = document.getElementById('modalThumbnails');
    thumbContainer.innerHTML = p.images.map((src, idx) => `
        <img src="${src}" onclick="selectThumb(${idx})" 
             class="w-16 h-16 object-cover border-2 rounded cursor-pointer hover:border-red-500 transition-all ${idx === 0 ? 'border-red-500' : 'border-transparent'}">
    `).join('');

    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

// --- ĐIỀU HƯỚNG ẢNH ---

function updateModalImage() {
    const imgElement = document.getElementById('modalMainImg');
    if (!imgElement || !editingProduct) return;

    imgElement.style.opacity = '0.3'; // Hiệu ứng chuyển ảnh mờ nhẹ
    setTimeout(() => {
        imgElement.src = editingProduct.images[currentImgIndex];
        imgElement.style.opacity = '1';
        // Cập nhật border cho ảnh nhỏ tương ứng
        const thumbs = document.querySelectorAll('#modalThumbnails img');
        thumbs.forEach((t, idx) => t.classList.toggle('border-red-500', idx === currentImgIndex));
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

// Lắng nghe phím mũi tên và Esc
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('productModal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeDetail();
    }
});

function closeDetail() {
    document.getElementById('productModal').classList.replace('flex', 'hidden');
    editingProduct = null;
}

// --- QUẢN TRỊ (ADMIN) ---

// Lưu sản phẩm (Thêm/Sửa - Nhập tiếp liên tục)
async function saveProduct() {
    const nameEl = document.getElementById('pName');
    const priceEl = document.getElementById('pPrice');
    const btn = document.getElementById('btnSave');

    if (!nameEl.value || !priceEl.value || currentImageList.length === 0) {
        return alert("Vui lòng điền đủ Tên, Giá và chọn ít nhất 1 Ảnh!");
    }

    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;

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

        const result = await res.json();

        if (res.ok) {
            showNotify("THÀNH CÔNG!");
            await fetchProducts(); // Cập nhật danh sách ngầm

            // Xóa form sau 1 giây để nhập tiếp
            setTimeout(() => {
                clearForm();
                editingIndex = null;
                nameEl.focus();
            }, 1000);
        } else {
            throw new Error(result.error || "Lỗi server");
        }
    } catch (err) {
        showNotify("LỖI: " + err.message, true);
    }
}

// Xóa sản phẩm
async function deleteProduct(i) {
    if (!confirm("Xác nhận xóa sản phẩm này khỏi hệ thống?")) return;

    try {
        const res = await fetch('/api/save-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: i, product: null, isDelete: true })
        });

        if (res.ok) {
            alert("Đã xóa xong!");
            await fetchProducts();
            renderAdminList();
        } else {
            const result = await res.json();
            throw new Error(result.error);
        }
    } catch (err) {
        alert("LỖI XÓA: " + err.message);
        await fetchProducts(); // Đồng bộ lại dữ liệu
    }
}

// --- XỬ LÝ ẢNH ---

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
        document.getElementById('loadingImg').style.display = 'flex';
        currentImageList = await Promise.all(files.map(f => compressImage(f)));
        const preview = document.getElementById('previewContainer');
        preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="h-20 rounded shadow-sm">`).join('');
        preview.classList.remove('hidden');
        document.getElementById('loadingImg').style.display = 'none';
    }
});

// --- TIỆN ÍCH KHÁC ---

function accessAdmin() {
    if (prompt("Nhập mật khẩu quản trị:") === ADMIN_PASSWORD) {
        renderAdminList();
        document.getElementById('adminModal').classList.replace('hidden', 'flex');
    } else alert("Sai mật khẩu!");
}

function renderAdminList() {
    const list = document.getElementById('adminManageList');
    list.innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b items-center bg-white hover:bg-gray-50">
            <div class="flex items-center gap-2">
                <img src="${p.images[0]}" class="w-8 h-8 object-cover rounded">
                <span class="text-[10px] uppercase font-bold truncate w-32">${p.name}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="editProduct(${i})" class="bg-gray-100 px-3 py-1 text-[9px] font-bold rounded">SỬA</button>
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
    preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="h-20 rounded">`).join('');
    preview.classList.remove('hidden');
}

function clearForm() {
    document.getElementById('pName').value = "";
    document.getElementById('pPrice').value = "";
    document.getElementById('pDesc').value = "";
    document.getElementById('previewContainer').innerHTML = "";
    document.getElementById('previewContainer').classList.add('hidden');
    document.getElementById('pFileInput').value = "";
    currentImageList = [];
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.replace('flex', 'hidden');
    editingIndex = null;
    clearForm();
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

// KHỞI ĐỘNG
fetchProducts();