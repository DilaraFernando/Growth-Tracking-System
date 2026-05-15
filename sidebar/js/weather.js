lucide.createIcons();
if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}

const DEFAULT_CITY = 'Kandy';
const locationCity = document.getElementById('location-city');
const tempEl = document.getElementById('weather-temp');
const humidityEl = document.getElementById('weather-humidity');
const windEl = document.getElementById('weather-wind');
const condEl = document.getElementById('weather-condition');
const adviceCard = document.getElementById('weather-advice-card');
const adviceTitle = document.getElementById('advice-title');
const adviceMsg = document.getElementById('advice-msg');

function fetchWeather(city) {
    fetch(`http://localhost:8080/api/v1/weather/current?city=${encodeURIComponent(city)}`)
        .then(r => r.json())
        .then(json => {
            const data = (json && json.data) || {};
            locationCity.innerText = data.city || city;
            tempEl.innerText = data.temperature ? Math.round(data.temperature) + '°C' : '--';
            humidityEl.innerText = data.humidity ? data.humidity + '%' : '--';
            windEl.innerText = data.windSpeed ? data.windSpeed + ' m/s' : '--';
            condEl.innerText = data.condition || '--';
        })
        .catch(() => {
            locationCity.innerText = city;
            tempEl.innerText = humidityEl.innerText = windEl.innerText = condEl.innerText = '--';
        });
}
fetchWeather(DEFAULT_CITY);

// --- Plant Dropdown Logic ---
const plantDropdown = document.getElementById('plant-dropdown');
let plantsList = [];
fetch('http://localhost:8080/api/v1/plants', { headers: auth.authHeaders() })
    .then(r => {
        if (r.status === 403 || r.status === 401) {
            // token missing/invalid — redirect to sign-in
            alert('Session expired or unauthorized. Please sign in again.');
            window.location.href = 'sign-in.html';
            throw new Error('unauthorized');
        }
        return r.json();
    })
    .then(json => {
        plantsList = json.data || [];
        plantDropdown.innerHTML = '';
        if (!plantsList.length) {
            plantDropdown.innerHTML = '<option value="">No plants found</option>';
            plantDropdown.disabled = true;
        } else {
            plantsList.forEach(plant => {
                const opt = document.createElement('option');
                opt.value = plant.id;
                opt.innerText = plant.plantName;
                plantDropdown.appendChild(opt);
            });
            plantDropdown.disabled = false;
        }
        renderPlants(plantsList);
    })
    .catch((err) => {
        if (err && err.message === 'unauthorized') return;
        plantDropdown.innerHTML = '<option value="">Failed to load plants</option>';
        plantDropdown.disabled = true;
    });

function renderPlants(plants) {
    const container = document.getElementById('plants-container');
    container.innerHTML = '';
    if (!plants || !plants.length) {
        container.innerHTML = '<div style="color:var(--text-dim);font-weight:700;">No plants available.</div>';
        return;
    }
    plants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '18px';
        card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;">
                        <div>
                            <div style="font-size:1rem;font-weight:800;color:var(--text-main);">${escapeHtml(plant.plantName || '')}</div>
                            <div style="font-size:0.9rem;color:var(--text-dim);margin-top:6px;">${escapeHtml(plant.species || '')}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:0.85rem;color:var(--text-dim);">Last water</div>
                            <div style="font-weight:700;margin-top:6px;">${plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : '—'}</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
                        <button class="plant-alert-single" data-id="${plant.id}" style="padding:8px 12px;border-radius:8px;border:none;background:var(--primary);color:#fff;font-weight:700;cursor:pointer;">Get Alert</button>
                        <div class="plant-alert-output" style="flex:1;color:var(--text-dim);font-weight:700;"></div>
                    </div>
                `;
        container.appendChild(card);
    });

    // attach listeners
    container.querySelectorAll('.plant-alert-single').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const output = btn.parentElement.querySelector('.plant-alert-output');
            if (!id) return;
            output.innerText = 'Loading...';
            fetch(`http://localhost:8080/api/v1/plants/${id}/alert`, { headers: auth.authHeaders() })
                .then(r => r.json())
                .then(json => {
                    const alert = json.data || json.message || 'No alert.';
                    output.innerText = alert;
                })
                .catch(() => {
                    output.innerText = 'Failed to fetch alert.';
                });
        });
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]);
    });
}

// --- Plant Alert Logic ---
const alertBtn = document.getElementById('plant-alert-btn');
const alertResult = document.getElementById('plant-alert-result');
alertBtn.onclick = function() {
    const plantId = plantDropdown.value;
    if (!plantId) {
        alertResult.innerHTML = '<span style="color:var(--danger);font-weight:600;">Please select a plant.</span>';
        return;
    }
    alertResult.innerHTML = 'Loading...';
    fetch(`http://localhost:8080/api/v1/plants/${plantId}/alert`, { headers: auth.authHeaders() })
        .then(r => r.json())
        .then(json => {
            const alert = json.data || json.message || 'No alert.';
            let color = 'var(--primary-light)';
            if (alert.toLowerCase().includes('danger') || alert.toLowerCase().includes('critical')) color = '#fee2e2';
            else if (alert.toLowerCase().includes('caution') || alert.toLowerCase().includes('warning')) color = '#fef9c3';
            else if (alert.toLowerCase().includes('safe') || alert.toLowerCase().includes('good')) color = '#dcfce7';
            alertResult.innerHTML = `<div style="background:${color};padding:18px 22px;border-radius:14px;font-weight:700;font-size:1.08rem;">${alert}</div>`;
        })
        .catch(() => {
            alertResult.innerHTML = '<span style="color:var(--danger);font-weight:600;">Failed to fetch alert.</span>';
        });
};