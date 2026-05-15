function updateCompletionRate(percent) {
    // UI select
    const valueDisplay = document.getElementById('percentage-value');
    const fillBar = document.getElementById('progress-fill');

    // Progress line weight(width)
    fillBar.style.width = percent + '%';

    // numbers update  (with Animation)
    let current = 0;
    const interval = setInterval(() => {
        if (current >= percent) {
            clearInterval(interval);
            valueDisplay.innerText = `${percent}%`;
        } else {
            current++;
            valueDisplay.innerText = `${current}%`;
        }
    }, 10);
}
// Backend data Call
// example: 92% and"Tomato T-01"
setTimeout(() => {
    updateCompletionRate(92);
}, 500);