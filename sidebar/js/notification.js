lucide.createIcons();

if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}
async function fetchNotifications() {
    try {
    } catch (err) {
        console.error(err);
    }
}
function clearAll() {
    document.querySelectorAll('.notification-card').forEach(card => card.classList.remove('status-unread'));
    alert('All notifications marked as read.');
}
fetchNotifications();

