function searchOnMap() {
    const val = document.getElementById('mapSearch').value.toLowerCase().trim();
    document.querySelectorAll('.plant-cell').forEach(c => c.classList.remove('found'));

    if(!val) return;

    document.querySelectorAll('.plant-cell').forEach(cell => {
        const id = cell.getAttribute('data-id');
        if(id && id.toLowerCase().includes(val)) {
            cell.classList.add('found');
        }
    });
}