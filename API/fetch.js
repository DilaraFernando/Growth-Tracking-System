const BASE_URL = 'http://localhost:8080/api/v1';

function getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
export async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = getHeaders();
    const opts = { ...options, headers: { ...headers, ...(options.headers || {}) } };
    const response = await fetch(url, opts);
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || response.statusText);
    }
    return response.json();
}