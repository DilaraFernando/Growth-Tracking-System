function updatePlantAnalysis(data) {
    // 1. Text and Counts Update
    document.getElementById('plant-id-display').innerText = `Analyzing Plant: ${data.name}`;
    document.getElementById('leaf-status').innerText = data.leafCondition;
    document.getElementById('stem-height').innerText = `${data.height} cm`;
    document.getElementById('root-status').innerText = data.rootHealth;

    // 2. Footer Stats Update
    document.getElementById('count-leaves').innerText = data.totalLeaves;
    document.getElementById('count-health').innerText = `${data.healthScore}%`;
    document.getElementById('count-days').innerText = `Day ${data.age}`;

    // 3. Health  UI colors change (Conditional Styling)
    const healthSpan = document.getElementById('count-health');
    if (data.healthScore < 70) {
        healthSpan.style.color = '#ef4444'; // red color
    } else {
        healthSpan.style.color = '#2e7d32'; // green color
    }
}

// --- (Testing Purpose) ---
// Backend data
const mockDataFromBackend = {
    name: "Chili C-05",
    leafCondition: "Vibrant",
    height: 18.2,
    rootHealth: "Strong",
    totalLeaves: 22,
    healthScore: 92,
    age: 21
};

// UI Update  Function  Call
updatePlantAnalysis(mockDataFromBackend);