lucide.createIcons();
if (!auth.isLoggedIn()) { window.location.href = "sign-in.html"; }

// Fetch Individual Plant Data
const urlParams = new URLSearchParams(window.location.search);
const plantId = urlParams.get('id');

async function fetchDetail() {
    if(!plantId) return;
    try {
        const response = await fetch(`http://localhost:8080/api/v1/plants/${plantId}`, {
            headers: auth.authHeaders()
        });
        const json = await response.json();
        const plant = json.data;
        if(plant) {
            document.getElementById('detail-plantName-title').innerText = plant.plantName ? plant.plantName : 'Plant Details';
            document.getElementById('detail-plantName').innerText = plant.plantName || '-';
            document.getElementById('detail-plantType').innerText = plant.plantType || '-';
            document.getElementById('detail-plantedDate').innerText = plant.plantedDate || '-';
            document.getElementById('detail-currentDay').innerText = plant.currentDay != null ? plant.currentDay : '-';
            document.getElementById('detail-currentStage').innerText = plant.currentStage || '-';
            document.getElementById('detail-status').innerText = plant.status || '-';
        }
    } catch (err) {
        console.error(err);
    }
}
fetchDetail();

// Fetch all user's plants for sidebar
async function fetchSidebarPlants() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/plants', {
            headers: auth.authHeaders()
        });
        const json = await response.json();
        const plants = json.data || [];
        const list = document.getElementById('sidebar-plants-list');
        list.innerHTML = '';
        if (plants.length === 0) {
            const li = document.createElement('li');
            li.style.color = 'var(--text-dim)';
            li.style.fontSize = '0.98rem';
            li.innerText = 'No plants found';
            list.appendChild(li);
        } else {
            plants.forEach(plant => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `plant-detail.html?id=${plant.id}`;
                a.innerText = plant.plantName || 'Unnamed Plant';
                a.style.textDecoration = 'none';
                a.style.color = 'var(--text-main)';
                a.style.fontWeight = '600';
                a.style.padding = '4px 0';
                if (plant.id == plantId) {
                    a.style.color = 'var(--primary)';
                }
                li.appendChild(a);
                list.appendChild(li);
            });
        }
    } catch (err) {
    }
}
fetchSidebarPlants();