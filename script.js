let products = JSON.parse(localStorage.getItem('products')) || [];
let uploadedImages = [];
let editingIndex = null;
let currentCategory = 'Tất cả';
let keyword = '';
let lastDeleted = null;

/* RENDER */
function renderProducts(){
    const list = document.getElementById('productList');
    list.innerHTML='';
    products
        .filter(p=>p.status!=='deleted' && p.status!=='draft')
        .filter(p=>currentCategory==='Tất cả'||p.category===currentCategory)
        .filter(p=>p.name.toLowerCase().includes(keyword))
        .forEach(p=>{
            const d=document.createElement('div');
            d.className='product-card';
            d.onclick=()=>openProductModal(p);
            d.innerHTML=`
              <div class="product-img"><img src="${p.images?.[0]||''}"></div>
              <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price}</div>
              </div>`;
            list.appendChild(d);
        });
}

function filterByCategory(cat,el){
    document.querySelectorAll('.collection-bar button').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
    currentCategory=cat;
    renderProducts();
}

function handleSearch(e){
    keyword=e.target.value.toLowerCase();
    renderProducts();
}

/* MODAL */
function openProductModal(p){
    modalMainImg.src=p.images?.[0]||'';
    modalName.innerText=p.name;
    modalPrice.innerText=p.price;
    modalDesc.innerText=p.desc||'';
    modalThumbnails.innerHTML='';
    (p.images||[]).forEach(src=>{
        const i=document.createElement('img');
        i.src=src;
        i.onclick=()=>modalMainImg.src=src;
        modalThumbnails.appendChild(i);
    });
    productModal.classList.remove('hidden');
}
function closeProductModal(){productModal.classList.add('hidden')}

/* ADMIN */
document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&e.shiftKey&&e.key==='A'){
        if(!confirm('Mở admin?'))return;
        adminModal.classList.toggle('hidden');
        loadDraft();
        renderAdminList();
    }
});
function closeAdmin(){adminModal.classList.add('hidden')}

function renderAdminList(){
    adminList.innerHTML='';
    products.forEach((p,i)=>{
        if(p.status==='deleted')return;
        const d=document.createElement('div');
        d.className='admin-item';
        d.innerHTML=`
          <img src="${p.images?.[0]||''}">
          <div><b>${p.name}</b><br><small>${p.price}</small></div>
          <div class="admin-actions">
            <button onclick="editAdminProduct(${i})">✏</button>
            <button onclick="previewProduct(${i})">👁</button>
            <button class="delete" onclick="deleteAdminProduct(${i})">🗑</button>
          </div>`;
        adminList.appendChild(d);
    });
}

function saveAdminProduct(){
    const p={
        name:aName.value,
        price:aPrice.value,
        category:aCat.value,
        desc:aDesc.value,
        images:uploadedImages,
        status:aStatus.value,
        versions:[...(editingIndex!==null?products[editingIndex].versions||[]:[]),{time:Date.now()}]
    };
    editingIndex!==null?products[editingIndex]=p:products.push(p);
    localStorage.setItem('products',JSON.stringify(products));
    renderProducts();renderAdminList();
}

function editAdminProduct(i){
    const p=products[i];
    editingIndex=i;
    aName.value=p.name;
    aPrice.value=p.price;
    aCat.value=p.category;
    aDesc.value=p.desc;
    aStatus.value=p.status;
    uploadedImages=[...(p.images||[])];
    renderPreview();
}

function deleteAdminProduct(i){
    lastDeleted={...products[i],index:i};
    products[i].status='deleted';
    localStorage.setItem('products',JSON.stringify(products));
    renderProducts();renderAdminList();
    undoToast.classList.remove('hidden');
}

function undoDelete(){
    products[lastDeleted.index]=lastDeleted;
    localStorage.setItem('products',JSON.stringify(products));
    undoToast.classList.add('hidden');
    renderProducts();renderAdminList();
}

function previewProduct(i){openProductModal(products[i])}

/* UPLOAD */
aFile.onchange=()=>{
    uploadedImages=[];
    [...aFile.files].forEach(f=>{
        const r=new FileReader();
        r.onload=e=>{uploadedImages.push(e.target.result);renderPreview()};
        r.readAsDataURL(f);
    });
}
function renderPreview(){
    imgPreview.innerHTML='';
    uploadedImages.forEach(src=>{
        const i=document.createElement('img');
        i.src=src;i.draggable=true;
        imgPreview.appendChild(i);
    });
}

/* DRAFT */
function loadDraft(){
    const d=JSON.parse(localStorage.getItem('adminDraft')||'{}');
    aName.value=d.name||'';aPrice.value=d.price||'';aDesc.value=d.desc||'';
}
['aName','aPrice','aDesc'].forEach(id=>{
    document.getElementById(id).oninput=()=>{
        localStorage.setItem('adminDraft',JSON.stringify({
            name:aName.value,price:aPrice.value,desc:aDesc.value
        }));
    }
});

renderProducts();