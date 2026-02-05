let products = [];
const ADMIN_PASSWORD = "123";
let editingIndex = null;
let currentImageList = [];

async function fetchProducts() {
    try {
        const res = await fetch('/.netlify/functions/get-products');
        products = await res.json();
        renderProducts();
    } catch (err) { console.error("Lỗi tải data:", err); }
}

async function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const cat = document.getElementById('pCat').value;
    const desc = document.getElementById('pDesc').value;

    if (!name || !price || !currentImageList.length) return alert("Thiếu thông tin!");

    const btn = document.getElementById('btnSave');
    btn.innerText = "ĐANG LƯU..."; btn.disabled = true;

    const payload = { name, price, category: cat, desc, images: currentImageList };

    try {
        const res = await fetch('/.netlify/functions/save-product', {
            method: 'POST',
            body: JSON.stringify({ index: editingIndex, product: payload, isDelete: false })
        });
        if (res.ok) {
            await fetchProducts();
            closeAdminModal();
        }
    } catch (err) { alert("Lỗi lưu sản phẩm"); }
    finally { btn.innerText = "LƯU SẢN PHẨM"; btn.disabled = false; }
}

async function deleteProduct(i) {
    if (confirm("Xác nhận xóa sản phẩm này?")) {
        try {
            const res = await fetch('/.netlify/functions/save-product', {
                method: 'POST',
                body: JSON.stringify({ index: i, product: null, isDelete: true })
            });
            if (res.ok) {
                alert("Đã xóa!");
                await fetchProducts();
                renderAdminList();
            }
        } catch (err) { alert("Lỗi khi xóa"); }
    }
}

// Các hàm Render, Modal... giữ nguyên như các bản trước
function renderProducts(data = products) {
    const list = document.getElementById('productList');
    list.innerHTML = data.map((p, i) => `
        <div onclick="openDetail(${i})" class="product-card cursor-pointer group p-2">
            <div class="img-container mb-3 border rounded"><img src="${p.images[0]}" class="w-full h-full object-contain"></div>
            <div class="text-center">
                <h3 class="text-xs text-gray-700 mb-2 line-clamp-2 h-8 uppercase font-medium">${p.name}</h3>
                <p class="text-red-600 font-bold text-lg">${new Intl.NumberFormat('vi-VN').format(p.price.toString().replace(/\D/g, ''))} ₫</p>
            </div>
        </div>`).join('');
}

function openDetail(i) {
    const p = products[i];
    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalPrice').innerText = new Intl.NumberFormat('vi-VN').format(p.price.toString().replace(/\D/g, '')) + ' ₫';
    document.getElementById('modalDesc').innerText = p.desc;
    document.getElementById('modalMainImg').src = p.images[0];
    document.getElementById('modalThumbnails').innerHTML = p.images.map((src, idx) => `<img src="${src}" onclick="document.getElementById('modalMainImg').src='${src}'" class="thumb-img">`).join('');
    document.getElementById('productModal').classList.replace('hidden', 'flex');
}

function accessAdmin() { if (prompt("Mật khẩu:") === ADMIN_PASSWORD) { renderAdminList(); openAdminModal(); } }
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
    } else { clearForm(); }
}
function renderAdminList() {
    document.getElementById('adminManageList').innerHTML = products.map((p, i) => `
        <div class="flex justify-between p-3 border-b bg-white items-center">
            <span class="text-[10px] uppercase font-bold truncate w-24">${p.name}</span>
            <div class="flex gap-2"><button onclick="openAdminModal(${i})" class="border px-2 py-1 text-[9px]">SỬA</button><button onclick="deleteProduct(${i})" class="text-red-500 border border-red-500 px-2 py-1 text-[9px]">XÓA</button></div>
        </div>`).join('');
}
function closeAdminModal() { document.getElementById('adminModal').classList.replace('flex', 'hidden'); }
function clearForm() {
    document.getElementById('pName').value = ""; document.getElementById('pPrice').value = "";
    document.getElementById('pDesc').value = ""; document.getElementById('previewContainer').classList.add('hidden');
    currentImageList = [];
}
function handleSearch(e) { renderProducts(products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()))); }
function filterByCategory(cat, el) {
    document.querySelectorAll('.tab-cat').forEach(t => t.classList.remove('tab-active'));
    el.classList.add('tab-active');
    renderProducts(cat === 'Tất cả' ? products : products.filter(p => p.category === cat));
}

// Nén ảnh
async function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image(); img.src = e.target.result;
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
document.getElementById('pFileInput')?.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    if (files.length) {
        document.getElementById('loadingImg').style.display = 'flex';
        currentImageList = await Promise.all(files.map(f => compressImage(f)));
        document.getElementById('previewContainer').innerHTML = currentImageList.map(img => `<img src="${img}" class="w-full h-16 object-cover rounded">`).join('');
        document.getElementById('previewContainer').classList.remove('hidden');
        document.getElementById('loadingImg').style.display = 'none';
    }
});

fetchProducts();