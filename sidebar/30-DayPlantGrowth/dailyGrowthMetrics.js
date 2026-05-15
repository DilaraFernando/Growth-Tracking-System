
function updateGrowthChart(growthData, labels) {
    const chartBox = document.getElementById('chart-box');
    const heightVal = document.getElementById('current-height-val');
    const growthDiff = document.getElementById('growth-diff');

    chartBox.innerHTML = '';

    const latestHeight = growthData[growthData.length - 1];
    const previousHeight = growthData[growthData.length - 2] || latestHeight;
    const diff = (latestHeight - previousHeight).toFixed(1);

    heightVal.innerText = `${latestHeight.toFixed(1)} cm`;
    growthDiff.innerText = `+${diff} cm`;

    //  Bars height
    const maxHeight = Math.max(...growthData);

    growthData.forEach((height, index) => {
        const barHeightPercent = (height / maxHeight) * 100;
        const isLast = index === growthData.length - 1;

        const barGroup = document.createElement('div');
        barGroup.className = 'bar-group';

        barGroup.innerHTML = `
                <div class="bar ${isLast ? 'active' : ''}" style="height: 0%"></div>
                <span class="day-label">${labels[index]}</span>
            `;

        chartBox.appendChild(barGroup);

        //  small delay one after height  update  animation display
        setTimeout(() => {
            const barElement = barGroup.querySelector('.bar');
            if(barElement) {
                barElement.style.height = barHeightPercent + '%';
            }
        }, 50 * index);
    });
}
// Backend data
const backendData = [8.4, 10.2, 11.8, 14.5];
const dayLabels = ['15 Mar', '16 Mar', '17 Mar', '18 Mar'];

//  update
window.onload = () => {
    updateGrowthChart(backendData, dayLabels);
};