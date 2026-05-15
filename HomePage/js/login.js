const loginBtn = document.getElementById('loginBtn');

loginBtn.onclick = async function() {
    // Input fields validate
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const errorDiv = document.getElementById('loginError');

    if (!emailEl.value || !passwordEl.value) {
        errorDiv.textContent = 'Please enter both email and password.';
        return;
    }

    loginBtn.disabled = true;
    const originalBtnText = loginBtn.textContent;
    loginBtn.textContent = 'Signing In...';
    errorDiv.textContent = '';

    try {
        const res = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailEl.value,
                password: passwordEl.value
            })
        });

        const data = await res.json();


        if (res.ok && data.data?.accessToken) {
            localStorage.setItem('jwt_token', data.data.accessToken);
            localStorage.setItem('userName', emailEl.value.split('@')[0]);

            window.location.replace('dashboard.html');
        } else {
            errorDiv.textContent = data.message || 'Invalid email or password';
        }
    } catch (e) {
        errorDiv.textContent = 'Connection failed. Please check your server.';
        console.error('Login Error:', e);
    } finally {

        loginBtn.disabled = false;
        loginBtn.textContent = originalBtnText;
    }
};