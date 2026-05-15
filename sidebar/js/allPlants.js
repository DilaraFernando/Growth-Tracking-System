lucide.createIcons();
if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}
const BACKEND = 'http://localhost:8080/api/v1';
const grid = document.getElementById('plants-grid');
const emptyMsg = document.getElementById('empty-msg');
fetch(`${BACKEND}/plants`, { headers: auth.authHeaders() })
    .then(r => r.json())
    .then(json => {
        const plants = json.data || [];
        if (!plants.length) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';
        plants.forEach(plant => {
            const card = document.createElement('div');
            card.className = 'plant-card';
            card.style.cursor = 'pointer';
            card.onclick = () => {
                window.location.href = `plant-detail.html?id=${plant.id}`;
            };
            card.innerHTML = `
                        <div class="plant-title">${plant.plantName}</div>
                        <div class="plant-type">Type: ${plant.plantType}</div>
                        <div class="plant-status">Status: ${plant.status || 'N/A'}</div>
                        <div class="plant-date">Planted: ${plant.plantedDate || ''}</div>
                        <div style="font-size:0.93rem; color:#64748b;">Stage: ${plant.currentStage || ''}</div>
                    `;
            grid.appendChild(card);
        });
    });