const registerBtn = document.getElementById('registerBtn');
registerBtn.onclick = async function() {
    registerBtn.disabled = true;
    const originalBtnText = registerBtn.textContent;
    registerBtn.textContent = 'Signing Up...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('registerError');
    errorDiv.textContent = '';
    try {
        const res = await fetch('http://localhost:8080/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.status === 201) {
            window.location.href = 'sign-in.html';
        } else {
            errorDiv.textContent = data.message || 'Registration failed';
        }
    } catch (e) {
        errorDiv.textContent = 'Network error: ' + e.message;
    }
    registerBtn.disabled = false;
    registerBtn.textContent = originalBtnText;
};
