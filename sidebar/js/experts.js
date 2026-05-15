lucide.createIcons();
if (!auth.isLoggedIn()) { window.location.href = "sign-in.html"; }

function openChat(name) {
    document.getElementById('chatExpertName').textContent = name;
    document.getElementById('chatOverlay').style.display = 'flex';
}

function closeChat() {
    document.getElementById('chatOverlay').style.display = 'none';
}