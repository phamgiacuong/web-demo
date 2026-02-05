/* ===================== CONFIG ===================== */
const API_GET = "/api/get-products";
const API_SAVE = "/api/save-product";

/* ===================== STATE ===================== */
let products = [];
let currentCategory = "Tất cả";
let editingProduct = null;

/* ===================== LOAD ===================== */
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    try {
        const res = await fetch(API_GET);
        products = await res.json();
        renderProducts();
        renderAdminList();
    } catch (e) {
        console.error("Không load được sản phẩm", e);
    }
}

/* ===================== RENDER GRID ===================== */
function renderProducts() {
    const el = document.getElementById("productList");
    el.innerHTML = "";

    const filtered = products.filter(p =>
        currentCategory === "Tất cả" || p.category === currentCategory
    );

    filtered.forEach(p => {
        el.innerHTML += `
        <div class="product-card" onclick="openProduct(${p.id})">
            <div class="product-img">
                <img src="${p.images?.[0] || ''}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${formatPrice(p.price)}</div>
            </div>
        </div>
        `;
    });
}

/* ===================== SEARCH / FILTER ===================== */
function handleSearch(e) {
    const key = e.target.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
        card.style.display =
            card.innerText.toLowerCase().includes(key) ? "" : "none";
    });
}

function filterByCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll(".categories button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts();
}

/* ===================== PRODUCT MODAL ===================== */
function openProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("modalName").innerText = p.name;
    document.getElementById("modalPrice").innerText = formatPrice(p.price);
    document.getElementById("modalDesc").innerText = p.description || "";

    const main = document.getElementById("modalMainImg");
    const thumbs = document.getElementById("modalThumbnails");
    thumbs.innerHTML = "";

    if (p.images?.length) {
        main.src = p.images[0];
        p.images.forEach(img => {
            const t = document.createElement("img");
            t.src = img;
            t.onclick = () => main.src = img;
            thumbs.appendChild(t);
        });
    }

    document.getElementById("productModal").classList.remove("hidden");
}

function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden");
}

/* ===================== ADMIN ===================== */
function openAdmin() {
    document.getElementById("adminModal").classList.remove("hidden");
    clearAdminForm();
}

function closeAdmin() {
    document.getElementById("adminModal").classList.add("hidden");
}

/* ===== ADMIN LIST ===== */
function renderAdminList() {
    const el = document.getElementById("adminList");
    if (!el) return;

    el.innerHTML = "";
    products.forEach(p => {
        el.innerHTML += `
        <div class="admin-item">
            <img src="${p.images?.[0] || ''}">
            <div class="info">
                <b>${p.name}</b>
                <small>${formatPrice(p.price)}</small>
            </div>
            <div class="actions">
                <button onclick="editProduct(${p.id})">✏️</button>
                <button onclick="deleteProduct(${p.id})">🗑️</button>
            </div>
        </div>
        `;
    });
}

/* ===== EDIT ===== */
function editProduct(id) {
    const p = products.find remember x => x.id === id);
    if (!p) return;

    editingProduct = p;
    openAdmin();

    aName.value = p.name;
    aPrice.value = p.price;
    aCat.value = p.category;
    aDesc.value = p.description || "";

    renderImagePreview(p.images || []);
}

/* ===== DELETE ===== */
async function deleteProduct(id) {
    if (!confirm("Xoá sản phẩm?")) return;

    products = products.filter(p => p.id !== id);
    await saveAll();
}

/* ===== SAVE ===== */
async function saveAdminProduct() {
    const data = {
        id: editingProduct?.id || Date.now(),
        name: aName.value,
        price: aPrice.value,
        category: aCat.value,
        description: aDesc.value,
        images: await readImages()
    };

    if (editingProduct) {
        const i = products.findIndex(p => p.id === editingProduct.id);
        products[i] = data;
    } else {
        products.unshift(data);
    }

    await saveAll();
    closeAdmin();
}

async function saveAll() {
    await fetch(API_SAVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products)
    });
    editingProduct = null;
    renderProducts();
    renderAdminList();
}

/* ===================== IMAGE ===================== */
function renderImagePreview(images) {
    imgPreview.innerHTML = "";
    images.forEach(img => {
        const i = document.createElement("img");
        i.src = img;
        imgPreview.appendChild(i);
    });
}

function readImages() {
    return new Promise(resolve => {
        if (!aFile.files.length) {
            resolve(editingProduct?.images || []);
            return;
        }

        const files = Array.from(aFile.files);
        Promise.all(files.map(f => {
            return new Promise(r => {
                const fr = new FileReader();
                fr.onload = () => r(fr.result);
                fr.readAsDataURL(f);
            });
        })).then(resolve);
    });
}

/* ===================== UTIL ===================== */
function formatPrice(p) {
    return Number(p).toLocaleString("vi-VN") + " ₫";
}