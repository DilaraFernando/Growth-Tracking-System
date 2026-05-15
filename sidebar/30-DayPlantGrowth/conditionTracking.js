function updateConditionTracker(data) {
    // Soil Data Update
    document.getElementById('soil-moisture').innerText = data.soil.moisture + '%';
    document.getElementById('soil-ph').innerText = data.soil.ph;
    document.getElementById('soil-temp').innerText = data.soil.temp + '°C';
    document.getElementById('soil-humidity').innerText = data.soil.humidity + '%';

    // Leaf Growth Data Update
    document.getElementById('leaf-sprout-val').innerText = data.leaf.sprouts + ' New';
    document.getElementById('leaf-area-val').innerText = data.leaf.area + ' cm²';

    // Progress Bar Update (Based on growth goal)
    const progressPercent = (data.leaf.area / data.leaf.targetArea) * 100;
    document.getElementById('growth-progress').style.width = progressPercent + '%';

    // Date Update
    document.getElementById('current-date').innerText = data.lastUpdated;
}

// --- Backend Mock Data Example ---
const latestConditions = {
    lastUpdated: "March 23, 2026",
    soil: {
        moisture: 68,
        ph: 6.4,
        temp: 24,
        humidity: 45
    },
    leaf: {
        sprouts: 3,
        area: 42,      // Current area
        targetArea: 60 // Target area for the month
    }
};

// UI Update Call
setTimeout(() => {
    updateConditionTracker(latestConditions);
}, 800);