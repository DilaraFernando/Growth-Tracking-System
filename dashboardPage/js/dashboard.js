lucide.createIcons();

// Set Today's Date
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('current-date').innerText = new Date().toLocaleDateString(undefined, dateOptions);

// Auth Check (Make sure 'auth' object is defined in your auth.js)
if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}
// Dashboard Data Fetching
async function fetchDashboard() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/plants', {
            headers: auth.authHeaders()
        });
        const json = await response.json();
        const plants = json.data || [];
        renderInventory(plants);
        updateStats(plants);
        initChart(); // new Chart load
    } catch (err) {
        console.error('Fetch error:', err);
        const plantList = document.getElementById('plant-list');
        if(plantList) {
            plantList.innerHTML = `<div style="color:var(--danger); text-align:center; padding:20px;">Failed to load garden data.</div>`;
        }
    }
}
function renderInventory(plants) {
    const container = document.getElementById('plant-list');
    if (!container) return;

    if (plants.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-dim);">No plants yet. Start growing today!</div>`;
        return;
    }
    container.innerHTML = plants.slice(0, 4).map(plant => {
        const statusClass = plant.status === 'HEALTHY' ? 'status-healthy' : 'status-thirst';
        return `
            <div class="plant-item" onclick="window.location.href='plant-detail.html?id=${plant.id}'">
                <div class="plant-info">
                    <div class="plant-img"><i data-lucide="leaf"></i></div>
                    <div class="plant-details">
                        <div>${plant.plantName}</div>
                        <div>${plant.plantType}</div>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">${plant.status}</span>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}
function updateStats(plants) {
    const moistureEl = document.getElementById('moisture-val');
    const attentionEl = document.getElementById('attention-val');

    if(moistureEl) moistureEl.innerText = '68%';
    if(attentionEl) attentionEl.innerText = plants.filter(p => p.status !== 'HEALTHY').length;

    // Set user info
    const userName = localStorage.getItem('userName') || 'Garden Owner';
    const nameEl = document.getElementById('user-display-name');
    const initialEl = document.getElementById('user-initials');

    if(nameEl) nameEl.innerText = userName;
    if(initialEl) initialEl.innerText = userName.charAt(0).toUpperCase();
}

// initChart Function
function initChart() {
    const ctx = document.getElementById('growthLineChart');

    if (!ctx) {
        console.error("ID 'growthLineChart' සහිත Canvas එක සොයාගත නොහැක.");
        return;
    }

    //  Chart
    if (window.myGrowthChart) {
        window.myGrowthChart.destroy();
    }

    window.myGrowthChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Growth (cm)',
                data: [1.2, 1.8, 2.5, 3.2, 4.0, 5.2, 5.8], // මෙතනට ඔබේ දත්ත ලබා දෙන්න
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4, // Line එක curve කිරීමට
                pointRadius: 4,
                pointBackgroundColor: '#2e7d32'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Live Simulations
setInterval(() => {
    const el = document.getElementById('moisture-val');
    if(el) {
        const val = 65 + Math.floor(Math.random() * 8);
        el.innerText = `${val}%`;
        el.style.color = 'var(--primary)';
        setTimeout(() => el.style.color = 'var(--text-main)', 600);
    }
}, 8000);

fetchDashboard();