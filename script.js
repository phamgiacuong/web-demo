let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];
let editingProduct = null;
let currentImgIndex = 0;

// 1. TẢI DỮ LIỆU TỪ NEON DATABASE
async function fetchProducts() {
    try {
        const res = await fetch('/.netlify/functions/get-products');
        if (!res.ok) throw new Error("Lỗi kết nối database");
        products = await res.json();
        renderProducts();
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
    }
}

// 2. HIỂN THỊ DANH SÁCH SẢN PHẨM (TRANG CHỦ)
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
                <p class="text-red-600 font-bold text-lg mt-2">${new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
            </div>
        </div>`).join('');
}

// 3. CHI TIẾT SẢN PHẨM (CÓ MŨI TÊN ĐIỀU HƯỚNG)
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
             class="w-16 h-16 object-cover border-2 rounded cursor-pointer hover:border-red-500 transition-all ${idx === 0 ? 'border-red-500' : 'border-transparent'}">
    `).join('');

    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

function updateModalImage() {
    const imgElement = document.getElementById('modalMainImg');
    imgElement.style.opacity = '0.3';
    setTimeout(() => {
        imgElement.src = editingProduct.images[currentImgIndex];
        imgElement.style.opacity = '1';
        // Cập nhật border cho ảnh nhỏ
        const thumbs = document.querySelectorAll('#modalThumbnails img');
        thumbs.forEach((t, idx) => t.classList.toggle('border-red-500', idx === currentImgIndex));
    }, 100);
}

function selectThumb(idx) {
    currentImgIndex = idx;
    updateModalImage();
}

function nextImage() {
    if (currentImgIndex < editingProduct.images.length - 1) {
        currentImgIndex++;
        updateModalImage();
    } else {
        currentImgIndex = 0; // Vòng lặp về đầu
        updateModalImage();
    }
}

function prevImage() {
    if (currentImgIndex > 0) {
        currentImgIndex--;
        updateModalImage();
    } else {
        currentImgIndex = editingProduct.images.length - 1; // Vòng lặp về cuối
        updateModalImage();
    }
}

// 4. QUẢN TRỊ: LƯU SẢN PHẨM (NHẬP TIẾP LIÊN TỤC)
async function saveProduct() {
    const nameEl = document.getElementById('pName');
    const priceEl = document.getElementById('pPrice');
    const catEl = document.getElementById('pCat');
    const descEl = document.getElementById('pDesc');

    if (!nameEl.value || !priceEl.value || !currentImageList.length) {
        return alert("Vui lòng điền đủ Tên, Giá và chọn ít nhất 1 Ảnh!");
    }

    const btn = document.getElementById('btnSave');
    const originalText = btn.innerText;
    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;

    const payload = {
        name: nameEl.value,
        price: priceEl.value.replace(/\D/g, ''),
        category: catEl.value,
        desc: descEl.value,
        images: currentImageList
    };

    try {
        const res = await fetch('/.netlify/functions/save-product', {
            method: 'POST',
            body: JSON.stringify({ index: editingIndex, product: payload, isDelete: false })
        });

        if (res.ok) {
            btn.innerText = "THÀNH CÔNG!";
            btn.style.backgroundColor = "#16a34a"; // Màu xanh lá

            await fetchProducts(); // Tải lại danh sách ngầm

            // Đợi 1 giây rồi xóa form để nhập tiếp
            setTimeout(() => {
                clearForm();
                editingIndex = null;
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.disabled = false;
                nameEl.focus(); // Nhảy con trỏ về ô tên để nhập món tiếp theo
            }, 1000);
        }
    } catch (err) {
        alert("Lỗi lưu sản phẩm. Vui lòng thử lại!");
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

// 5. QUẢN TRỊ: XÓA SẢN PHẨM
async function deleteProduct(i) {
    if (confirm("Xác nhận xóa sản phẩm này khỏi Database?")) {
        try {
            const res = await fetch('/.netlify/functions/save-product', {
                method: 'POST',
                body: JSON.stringify({ index: i, product: null, isDelete: true })
            });
            if (res.ok) {
                await fetchProducts();
                renderAdminList();
            }
        } catch (err) {
            alert("Lỗi khi xóa!");
        }
    }
}

// 6. XỬ LÝ ẢNH (NÉN & PREVIEW)
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
        preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="w-full h-20 object-cover rounded shadow-sm">`).join('');
        preview.classList.remove('hidden');
        document.getElementById('loadingImg').style.display = 'none';
    }
});

// 7. CÁC HÀM TIỆN ÍCH KHÁC
function accessAdmin() {
    if (prompt("Mật khẩu quản trị:") === ADMIN_PASSWORD) {
        renderAdminList();
        document.getElementById('adminModal').classList.replace('hidden', 'flex');
    } else alert("Sai mật khẩu!");
}

function renderAdminList() {
    const list = document.getElementById('adminManageList');
    list.innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b bg-white items-center hover:bg-gray-50">
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
    preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="w-full h-20 object-cover rounded">`).join('');
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

// LẮNG NGHE BÀN PHÍM TOÀN CỤC
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('productModal');
    // Chỉ hoạt động khi Modal đang hiển thị (không bị ẩn)
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
            nextImage(); // Nhấn mũi tên phải
        } else if (e.key === 'ArrowLeft') {
            prevImage(); // Nhấn mũi tên trái
        } else if (e.key === 'Escape') {
            modal.classList.replace('flex', 'hidden'); // Nhấn Esc để đóng
        }
    }
});

// KHỞI CHẠY
fetchProducts();