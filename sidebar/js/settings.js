if (!auth.isLoggedIn()) {
    window.location.href = 'sign-in.html';
}
const displayName = document.getElementById('displayName');
const tz = document.getElementById('timezone');
const loc = document.getElementById('locale');
const unitsEl = document.getElementById('units');
const darkMode = document.getElementById('darkMode');
const notify = document.getElementById('notifyByEmail');
const pushNotifications = document.getElementById('pushNotifications');
const msg = document.getElementById('msg');
const saveBtn = document.getElementById('saveBtn');

function loadSettings(){
    fetch('http://localhost:8080/api/v1/user/settings', { headers: auth.authHeaders() })
        .then(r=>{ if(r.status===401||r.status===403){ window.location.href='sign-in.html'; throw new Error('unauth'); } return r.json() })
        .then(json=>{
            const data = json.data || {};
            displayName.value = data.displayName || '';
            tz.value = data.timezone || '';
            loc.value = data.locale || '';
            unitsEl.value = data.units || 'metric';
            darkMode.checked = !!data.darkMode;
            notify.checked = !!data.notifyByEmail;
            pushNotifications.checked = !!data.pushNotifications;
        })
        .catch(e=>{ if(e.message==='unauth') return; msg.innerText='Failed to load settings'; });
}
saveBtn.onclick = function(){
    const payload = {
        displayName: displayName.value || null,
        timezone: tz.value || null,
        locale: loc.value || null,
        units: unitsEl.value || null,
        darkMode: darkMode.checked,
        notifyByEmail: notify.checked,
        pushNotifications: pushNotifications.checked
    };
    fetch('http://localhost:8080/api/v1/user/settings', { method: 'PUT', headers: auth.authHeaders(), body: JSON.stringify(payload) })
        .then(r=>{ if(r.status===401||r.status===403){ window.location.href='sign-in.html'; throw new Error('unauth'); } return r.json() })
        .then(json=>{ msg.innerText='Settings saved'; setTimeout(()=>msg.innerText='',2000) })
        .catch(e=>{ if(e.message==='unauth') return; msg.innerText='Failed to save settings'; });
}

loadSettings();

if (window.lucide) lucide.createIcons();
// Ensure sidebar icons render
try { if (auth && auth.isLoggedIn && !auth.isLoggedIn()) { window.location.href = 'sign-in.html'; } } catch(e) {}