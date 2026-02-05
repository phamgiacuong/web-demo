/* ================== CONFIG ================== */
const API_URL = '/api/get-products'; // 🔴 đổi nếu API bạn khác

/* ================== STATE ================== */
let products = [];
let uploadedImages = [];
let editingIndex = null;
let currentCategory = 'Tất cả';
let keyword = '';
let lastDeleted = null;

/* ================== LOAD DATA ================== */
async function loadProductsFromAPI() {
    try {
        const res = await fetch(API_URL);
        const apiProducts = await res.json();

        // Nếu chưa có localStorage → dùng API làm nguồn gốc
        if (!localStorage.getItem('products')) {
            products = apiProducts.map(p => ({
                ...p,
                status: p.status || 'published',
                versions: []
            }));
            localStorage.setItem('products', JSON.stringify(products));
        } else {
            products = JSON.parse(localStorage.getItem('products'));
        }

        renderProducts();
        renderAdminList();
    } catch (e) {
        console.error('❌ Không load được API get-product', e);
    }
}

/* ================== RENDER USER ================== */
function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = '';

    products
        .filter(p => p.status !== 'deleted' && p.status !== 'draft')
        .filter(p => currentCategory === 'Tất cả' || p.category === currentCategory)
        .filter(p => p.name.toLowerCase().includes(keyword))
        .forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.onclick = () => openProductModal(p);

            div.innerHTML = `
                <div class="product-img">
                    <img src="${p.images?.[0] || ''}">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="price">${p.price}</div>
                </div>
            `;
            list.appendChild(div);
        });
}

/* ================== FILTER ================== */
function filterByCategory(category, el) {
    document
        .querySelectorAll('.collection-bar button')
        .forEach(btn => btn.classList.remove('active'));

    el.classList.add('active');
    currentCategory = category;
    renderProducts();
}

function handleSearch(e) {
    keyword = e.target.value.toLowerCase();
    renderProducts();
}

/* ================== PRODUCT MODAL ================== */
function openProductModal(p) {
    modalMainImg.src = p.images?.[0] || '';
    modalName.innerText = p.name;
    modalPrice.innerText = p.price;
    modalDesc.innerText = p.desc || '';

    modalThumbnails.innerHTML = '';
    (p.images || []).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.onclick = () => modalMainImg.src = src;
        modalThumbnails.appendChild(img);
    });

    productModal.classList.remove('hidden');
}

function closeProductModal() {
    productModal.classList.add('hidden');
}

/* ================== ADMIN SHORTCUT ================== */
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        if (!confirm('Mở chế độ quản trị?')) return;
        adminModal.classList.toggle('hidden');
        loadDraft();
        renderAdminList();
    }
});

function closeAdmin() {
    adminModal.classList.add('hidden');
}

/* ================== ADMIN LIST ================== */
function renderAdminList() {
    adminList.innerHTML = '';

    products.forEach((p, index) => {
        if (p.status === 'deleted') return;

        const div = document.createElement('div');
        div.className = 'admin-item';

        div.innerHTML = `
            <img src="${p.images?.[0] || ''}">
            <div>
                <b>${p.name}</b><br>
                <small>${p.price}</small>
            </div>
            <div class="admin-actions">
                <button onclick="editAdminProduct(${index})">✏</button>
                <button onclick="previewProduct(${index})">👁</button>
                <button class="delete" onclick="deleteAdminProduct(${index})">🗑</button>
            </div>
        `;

        adminList.appendChild(div);
    });
}

/* ================== ADMIN CRUD ================== */
function saveAdminProduct() {
    const product = {
        name: aName.value,
        price: aPrice.value,
        category: aCat.value,
        desc: aDesc.value,
        images: uploadedImages,
        status: aStatus.value,
        versions: []
    };

    if (editingIndex !== null) {
        product.versions = [
            ...(products[editingIndex].versions || []),
            { time: Date.now(), data: products[editingIndex] }
        ];
        products[editingIndex] = product;
    } else {
        products.push(product);
    }

    localStorage.setItem('products', JSON.stringify(products));
    editingIndex = null;

    renderProducts();
    renderAdminList();
}

function editAdminProduct(index) {
    const p = products[index];
    editingIndex = index;

    aName.value = p.name;
    aPrice.value = p.price;
    aCat.value = p.category;
    aDesc.value = p.desc;
    aStatus.value = p.status;

    uploadedImages = [...(p.images || [])];
    renderPreview();
}

function deleteAdminProduct(index) {
    lastDeleted = { ...products[index], index };
    products[index].status = 'deleted';

    localStorage.setItem('products', JSON.stringify(products));
    undoToast.classList.remove('hidden');

    renderProducts();
    renderAdminList();
}

function undoDelete() {
    if (!lastDeleted) return;
    products[lastDeleted.index] = lastDeleted;

    localStorage.setItem('products', JSON.stringify(products));
    undoToast.classList.add('hidden');

    renderProducts();
    renderAdminList();
}

function previewProduct(index) {
    openProductModal(products[index]);
}

/* ================== IMAGE UPLOAD ================== */
aFile.onchange = () => {
    uploadedImages = [];
    [...aFile.files].forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            uploadedImages.push(e.target.result);
            renderPreview();
        };
        reader.readAsDataURL(file);
    });
};

function renderPreview() {
    imgPreview.innerHTML = '';
    uploadedImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        imgPreview.appendChild(img);
    });
}

/* ================== DRAFT AUTO SAVE ================== */
function loadDraft() {
    const d = JSON.parse(localStorage.getItem('adminDraft') || '{}');
    aName.value = d.name || '';
    aPrice.value = d.price || '';
    aDesc.value = d.desc || '';
}

['aName', 'aPrice', 'aDesc'].forEach(id => {
    document.getElementById(id).oninput = () => {
        localStorage.setItem('adminDraft', JSON.stringify({
            name: aName.value,
            price: aPrice.value,
            desc: aDesc.value
        }));
    };
});

/* ================== INIT ================== */
loadProductsFromAPI();