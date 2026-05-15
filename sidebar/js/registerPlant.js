lucide.createIcons();

if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}

document.getElementById('plantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        plantName: document.getElementById('plantName').value,
        plantType: document.getElementById('plantType').value,
        plantedDate: document.getElementById('plantedDate').value,
        status: document.getElementById('status').value
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/plants/register', {
            method: 'POST',
            headers: auth.authHeaders(),
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('successMsg').style.display = 'block';
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        } else {
            alert('Registration failed. Please check your data.');
        }
    } catch (err) {
        console.error(err);
    }
});

// Set default date to today
document.getElementById('plantedDate').valueAsDate = new Date();