let products = [];
const ADMIN_PASSWORD = "123"; // Mật khẩu của bạn
let editingIndex = null;
let currentImageList = [];

// 1. LẤY DỮ LIỆU TỪ NETLIFY DATABASE KHI MỞ TRANG
async function fetchProducts() {
    try {
        const res = await fetch('/.netlify/functions/get-products');
        if (!res.ok) throw new Error("Không thể kết nối Database");
        products = await res.json();
        renderProducts();
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
    }
}

// 2. ĐỊNH DẠNG TIỀN TỆ (1000000 -> 1.000.000 ₫)
function formatCurrency(price) {
    let num = price.toString().replace(/\D/g, '');
    return num ? new Intl.NumberFormat('vi-VN').format(num) + ' ₫' : price;
}

// 3. NÉN ẢNH TỰ ĐỘNG (GIẢM TẢI CHO DATABASE)
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
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
        };
    });
}

// 4. XỬ LÝ CHỌN FILE TRONG ADMIN
document.getElementById('pFileInput')?.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    if (files.length) {
        document.getElementById('loadingImg').style.display = 'flex';
        currentImageList = await Promise.all(files.map(f => compressImage(f)));
        const preview = document.getElementById('previewContainer');
        preview.innerHTML = currentImageList.map(img => `<img src="${img}" class="w-full h-16 object-cover rounded">`).join('');
        preview.classList.remove('hidden');
        document.getElementById('loadingImg').style.display = 'none';
    }
});

// 5. LƯU SẢN PHẨM LÊN DATABASE
async function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const cat = document.getElementById('pCat').value;
    const desc = document.getElementById('pDesc').value;

    if (!name || !price || !currentImageList.length) return alert("Vui lòng điền đủ thông tin!");

    const btn = document.getElementById('btnSave');
    btn.innerText = "ĐANG LƯU...";
    btn.disabled = true;

    const payload = { name, price, category: cat, desc, images: currentImageList };

    try {
        const res = await fetch('/.netlify/functions/save-product', {
            method: 'POST',
            body: JSON.stringify({ index: editingIndex, product: payload })
        });

        if (res.ok) {
            alert("Đã lưu vào Database thành công!");
            await fetchProducts(); // Tải lại danh sách mới
            closeAdminModal();
        } else {
            throw new Error("Lỗi Server");
        }
    } catch (err) {
        alert("Lỗi khi lưu: " + err.message);
    } finally {
        btn.innerText = "LƯU SẢN PHẨM";
        btn.disabled = false;
    }
}

// 6. HIỂN THỊ DANH SÁCH (TRANG CHỦ)
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-2">
            <div class="img-container mb-3 border rounded"><img src="${p.images[0]}" class="w-full h-full object-contain"></div>
            <div class="text-center">
                <h3 class="text-xs text-gray-700 mb-2 line-clamp-2 h-8 uppercase font-medium">${p.name}</h3>
                <p class="text-red-600 font-bold text-lg">${formatCurrency(p.price)}</p>
            </div>
        </div>
    `).join('');
}

// 7. CHI TIẾT SẢN PHẨM
function openDetail(i) {
    const p = products[i];
    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalPrice').innerText = formatCurrency(p.price);
    document.getElementById('modalDesc').innerText = p.desc;

    const mainImg = document.getElementById('modalMainImg');
    const thumbContainer = document.getElementById('modalThumbnails');
    mainImg.src = p.images[0];

    thumbContainer.innerHTML = p.images.map((src, idx) => `
        <img src="${src}" onclick="changeMainImg('${src}', this)" class="thumb-img ${idx===0?'thumb-active':''}">
    `).join('');

    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

function changeMainImg(src, el) {
    document.getElementById('modalMainImg').src = src;
    document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('thumb-active'));
    el.classList.add('thumb-active');
}

// 8. CÁC HÀM QUẢN TRỊ
function accessAdmin() {
    if (prompt("Mật khẩu quản trị:") === ADMIN_PASSWORD) {
        renderAdminList();
        openAdminModal();
    } else alert("Sai mật khẩu!");
}

function renderAdminList() {
    document.getElementById('adminManageList').innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b bg-white items-center">
            <span class="text-[10px] uppercase font-bold truncate w-24">${p.name}</span>
            <div class="flex gap-2">
                <button onclick="openAdminModal(${i})" class="border px-2 py-1 text-[9px]">SỬA</button>
                <button onclick="deleteProduct(${i})" class="text-red-500 border border-red-500 px-2 py-1 text-[9px]">XÓA</button>
            </div>
        </div>
    `).join('');
}

async function deleteProduct(i) {
    if (confirm("Xác nhận xóa sản phẩm khỏi Database?")) {
        products.splice(i, 1);
        // Gửi mảng đã xóa lên cập nhật lại Database
        await fetch('/.netlify/functions/save-product', {
            method: 'POST',
            body: JSON.stringify({ index: null, product: null, resetList: products })
            // Lưu ý: Function save-product.js cần được cập nhật để xử lý resetList nếu muốn xóa
        });
        await fetchProducts();
        renderAdminList();
    }
}

function openAdminModal(i = null) {
    editingIndex = i;
    document.getElementById('adminModal').classList.replace('hidden', 'flex');
    if (i !== null) {
        const p = products[i];
        document.getElementById('pName').value = p.name;
        document.getElementById('pPrice').value = p.price;
        document.getElementById('pCat').value = p.category;
        document.getElementById('pDesc').value = p.desc;
        currentImageList = p.images;
        document.getElementById('previewContainer').classList.remove('hidden');
        document.getElementById('previewContainer').innerHTML = currentImageList.map(img => `<img src="${img}" class="w-full h-16 object-cover rounded">`).join('');
    } else {
        clearForm();
    }
}

function clearForm() {
    document.getElementById('pName').value = ""; document.getElementById('pPrice').value = "";
    document.getElementById('pDesc').value = ""; document.getElementById('previewContainer').classList.add('hidden');
    currentImageList = [];
}

function closeAdminModal() { document.getElementById('adminModal').classList.replace('flex', 'hidden'); }
function handleSearch(e) { renderProducts(products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()))); }

function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat').forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');
    renderProducts(cat === 'Tất cả' ? products : products.filter(p => p.category === cat));
}

// KHỞI CHẠY LẦN ĐẦU
fetchProducts();