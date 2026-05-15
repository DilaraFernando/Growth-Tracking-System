function getToken() {
    return localStorage.getItem("jwt_token");
}

function isLoggedIn() {
    const token = getToken();
    return token !== null && token !== "";
}

function logout() {
    localStorage.removeItem("jwt_token");
    window.location.href = "../sign-in.html";
}

function authHeaders() {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }
    return headers;
}

function redirectIfAuthenticated() {
    if (isLoggedIn()) {
        window.location.href = '../../dashboard.html';
    }
}

function hideAuthLinks() {
    if (isLoggedIn()) {
        const signInLinks = document.querySelectorAll('.signin-btn, a[href*="sign-in"], a[href*="sign-up"]');
        signInLinks.forEach(link => link.style.display = 'none');
    }
}

window.auth = { getToken, isLoggedIn, logout, authHeaders, redirectIfAuthenticated, hideAuthLinks };
