function updateLeafAnalysis(leafData) {
    const container = document.getElementById('leaf-container');
    const colorText = document.getElementById('leaf-color-text');
    const textureText = document.getElementById('leaf-texture-text');
    const sproutingText = document.getElementById('leaf-sprouting-text');
    const colorDot = document.getElementById('color-dot');

    // Data Replace
    colorText.innerText = leafData.color;
    textureText.innerText = leafData.texture;
    sproutingText.innerText = leafData.sprouts;

    // Color  Dot change colors
    if (leafData.color.toLowerCase().includes('yellow')) {
        colorDot.style.backgroundColor = '#eab308'; // Warning color
    } else if (leafData.color.toLowerCase().includes('brown')) {
        colorDot.style.backgroundColor = '#92400e'; // Danger color
    } else {
        colorDot.style.backgroundColor = '#2e7d32'; // Healthy Green
    }

    // Update animation add
    container.classList.add('update-flash');
    setTimeout(() => container.classList.remove('update-flash'), 1000);
}

// --- Backend Integration Example ---
// Backend  data  Call
const mockData = {
    color: "Healthy Green",
    texture: "Firm & Hydrated",
    sprouts: "2 new leaves sprouting"
};

// second 1 after data display
setTimeout(() => {
    updateLeafAnalysis(mockData);
}, 1000);
