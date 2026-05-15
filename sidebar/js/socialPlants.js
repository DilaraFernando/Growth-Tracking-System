lucide.createIcons();
if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}
const BACKEND = 'http://localhost:8080/api/v1';
let plants = [];
let posts = [];
let selectedPlantId = '';
const plantSelect = document.getElementById('plant-select');
const postsContainer = document.getElementById('posts-container');
const emptyState = document.getElementById('empty-state');
const newPostBtn = document.getElementById('new-post-btn');
const form = document.getElementById('create-form');
const publishBtn = document.getElementById('publish-btn');
const postError = document.getElementById('post-error');

function renderPosts() {
    postsContainer.innerHTML = '';
    if (!posts.length) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
                    <div class="post-body">
                        <div class="post-user">
                            <div class="post-avatar">${(auth.getToken()||'U').substring(0,2).toUpperCase()}</div>
                            <span class="user-name">You</span>
                        </div>
                        <p class="post-caption">${post.caption}</p>
                        <div style="color:var(--text-dim); font-size:0.92rem; margin-bottom:8px;">${post.createdAt ? post.createdAt.replace('T',' ').substring(0,16) : ''}</div>
                    </div>
                `;
        postsContainer.appendChild(card);
    });
}
function fetchPlants() {
    fetch(`${BACKEND}/plants`, { headers: auth.authHeaders() })
        .then(r => r.json())
        .then(json => {
            plants = json.data || json;
            plantSelect.innerHTML = '<option value="">Select Plant</option>' + plants.map(p => `<option value="${p.id}">${p.plantName}</option>`).join('');
        });
}
function fetchPosts(plantId) {
    postsContainer.innerHTML = '';
    emptyState.style.display = 'none';
    fetch(`${BACKEND}/plants/${plantId}/social-posts`, { headers: auth.authHeaders() })
        .then(r => r.json())
        .then(json => {
            posts = json.data || [];
            renderPosts();
        });
}

plantSelect.onchange = function() {
    selectedPlantId = plantSelect.value;
    if (selectedPlantId) {
        newPostBtn.disabled = false;
        fetchPosts(selectedPlantId);
    } else {
        newPostBtn.disabled = true;
        postsContainer.innerHTML = '';
        emptyState.style.display = 'none';
    }
    form.classList.remove('visible');
};

function toggleForm() {
    if (!selectedPlantId) return;
    form.classList.toggle('visible');
    postError.textContent = '';
}
window.toggleForm = toggleForm;

publishBtn.onclick = function() {
    if (!selectedPlantId) return;
    postError.textContent = '';
    publishBtn.disabled = true;
    fetch(`${BACKEND}/plants/${selectedPlantId}/social-posts/generate`, {
        method: 'POST',
        headers: auth.authHeaders()
    })
        .then(async r => {
            publishBtn.disabled = false;
            if (r.ok) {
                form.classList.remove('visible');
                fetchPosts(selectedPlantId);
            } else {
                const err = await r.json();
                postError.textContent = err.message || 'Error generating post';
            }
        });
};

fetchPlants();