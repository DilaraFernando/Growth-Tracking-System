async function handleShare() {
    const btn = document.querySelector('.btn-share');
    const originalContent = btn.innerHTML;

    const day = document.getElementById('display-day').innerText;
    const height = document.getElementById('post-h').innerText;
    const health = document.getElementById('post-s').innerText;
    const leaves = document.getElementById('post-l').innerText;

    const previewElement = document.querySelector(".post-preview");

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        const canvas = await html2canvas(previewElement, {
            useCORS: true,
            backgroundColor: null
        });

        const imageData = canvas.toDataURL("image/png");

        const payload = {
            dayTag: day,
            height: height,
            health: health,
            leaves: leaves,
            imageBase64: imageData // <--- Must match DTO field name
        };

        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8080/api/journey/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Shared Successfully!';
            btn.style.background = '#28a745';

            console.log("Journey shared successfully!");
        } else {
            if (response.status === 403) {
                throw new Error("Access Denied: Please login again.");
            }
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Failed to share");
        }

    } catch (error) {
        console.error("Sharing Error:", error);


        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed to Share';
        btn.style.background = '#dc3545';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = "";
            btn.disabled = false;
        }, 3000);
    }
}

function updateSocialPreview(data) {
    if (!data) return;

    if (document.getElementById('display-day'))
        document.getElementById('display-day').innerText = `DAY ${data.day}`;

    if (document.getElementById('post-h'))
        document.getElementById('post-h').innerText = data.height + (data.height.toString().includes('cm') ? '' : ' cm');

    if (document.getElementById('post-s'))
        document.getElementById('post-s').innerText = data.health + (data.health.toString().includes('%') ? '' : '%');

    if (document.getElementById('post-l'))
        document.getElementById('post-l').innerText = data.leaves;
}

window.onload = () => {
    const initialData = {
        day: "07",
        height: 14.2,
        health: 98,
        leaves: 12
    };
    updateSocialPreview(initialData);
};