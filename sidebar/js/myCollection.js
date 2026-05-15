lucide.createIcons();
if (!auth.isLoggedIn()) { window.location.href = "sign-in.html"; }

let collections = [];
let filteredCategory = 'ALL';
const grid = document.getElementById('plants-grid');
const emptyState = document.getElementById('empty-state');
const pills = document.querySelectorAll('.category-pill');
const addBtn = document.getElementById('add-collection-btn');
const formWrapper = document.getElementById('add-collection-form-wrapper');
const form = document.getElementById('add-collection-form');
const cancelBtn = document.getElementById('cancel-add-collection');
const errorSpan = document.getElementById('add-collection-error');

const BACKEND_URL = 'http://localhost:8080/api/v1/collections';
function renderCollections() {
    let data = filteredCategory === 'ALL' ? collections : collections.filter(c => c.category === filteredCategory);
    grid.innerHTML = '';
    if (data.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    data.forEach(c => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.innerHTML = `
                    <div style="position:relative; height:60px;">
                        <span style="position:absolute; top:20px; left:20px; background:var(--primary); color:#fff; padding:6px 18px; border-radius:50px; font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">${c.category}</span>
                    </div>
                    <div class="card-body" style="padding-top:12px;">
                        <h3 class="plant-name" style="margin-bottom:2px;">${c.name}</h3>
                        <div style="color:var(--text-dim); font-size:0.98rem; margin-bottom:8px;">${c.location ? c.location : ''}</div>
                        <div style="color:var(--text-dim); font-size:0.92rem; margin-bottom:16px;">Created: ${c.createdAt}</div>
                        <button class="btn-view" style="background:#fff; color:var(--primary); border:1.5px solid var(--primary); margin-bottom:8px;" onclick="deleteCollection(${c.id})">Delete</button>
                    </div>
                `;
        grid.appendChild(card);
    });
}
function fetchCollections() {
    fetch(BACKEND_URL, { headers: auth.authHeaders() })
        .then(r => r.json())
        .then(json => {
            collections = json.data || json;
            renderCollections();
        });
}
window.deleteCollection = function(id) {
    fetch(`${BACKEND_URL}/${id}`, { method: 'DELETE', headers: auth.authHeaders() })
        .then(r => {
            if (r.ok) {
                collections = collections.filter(c => c.id !== id);
                renderCollections();
            }
        });
}
pills.forEach(pill => {
    pill.onclick = function() {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filteredCategory = pill.getAttribute('data-category');
        renderCollections();
    }
});
addBtn.onclick = function() {
    formWrapper.style.display = 'block';
    addBtn.style.display = 'none';
    errorSpan.textContent = '';
}
cancelBtn.onclick = function() {
    formWrapper.style.display = 'none';
    addBtn.style.display = 'inline-block';
    form.reset();
    errorSpan.textContent = '';
}
form.onsubmit = function(e) {
    e.preventDefault();
    errorSpan.textContent = '';
    const name = form['name'].value.trim();
    const category = form['category'].value;
    const location = form['location'].value.trim();
    fetch(BACKEND_URL, {
        method: 'POST',
        headers: auth.authHeaders(),
        body: JSON.stringify({ name, category, location })
    })
        .then(async r => {
            if (r.status === 201) {
                formWrapper.style.display = 'none';
                addBtn.style.display = 'inline-block';
                form.reset();
                fetchCollections();
            } else {
                const err = await r.json();
                errorSpan.textContent = err.message || 'Error adding collection';
            }
        });
}
fetchCollections();