function loadJourneyData(data) {
    data.forEach(item => {
        const milestone = document.getElementById(`m-${item.day}`);
        if (milestone) {
            milestone.classList.add('completed');
            const img = milestone.querySelector('.post-img');
            const icon = milestone.querySelector('i:not(.fa-check):not(.fa-heart)');

            if (item.img) {
                img.src = item.img;
                img.style.display = 'block';
                if (icon) icon.style.display = 'none';
            }
        }
    });
}
// --- Backend Mock Data Example ---
const myPlantJourney = [
    { day: 0, img: 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=200.' }, // before one week
    { day: 7, img: 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=200' }  // after one week
];
window.onload = () => {
    loadJourneyData(myPlantJourney);
};
