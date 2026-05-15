const CONFIG = { API_BASE_URL: 'http://localhost:8080' };

lucide.createIcons();

if (!auth.isLoggedIn()) {
    window.location.href = "sign-in.html";
}

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

const welcomeMessage = "Hello! I am your plant expert assistant. Ask me anything about plant care, growth stages, fertilizers, or soil advice.";
appendMessage(welcomeMessage, 'ai');

function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    if (type === 'ai') {
        msgDiv.innerHTML = `<div class="ai-icon"><i data-lucide="bot" style="width:16px;height:16px;"></i></div><div>${text}</div>`;
    } else {
        msgDiv.textContent = text;
    }
    chatMessages.appendChild(msgDiv);
    lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    typingIndicator.classList.add('show');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.classList.remove('show');
}

function showError(text) {
    const errDiv = document.createElement('div');
    errDiv.className = 'message error-message';
    errDiv.textContent = text;
    chatMessages.appendChild(errDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';
    sendBtn.disabled = true;
    appendMessage(text, 'user');
    showTyping();

    try {
        const response = await fetch(CONFIG.API_BASE_URL + '/api/v1/chat/ask', {
            method: 'POST',
            headers: auth.authHeaders(),
            body: JSON.stringify({ message: text })
        });

        hideTyping();
        sendBtn.disabled = false;

        if (!response.ok) {
            showError('Sorry, something went wrong. Try again.');
            return;
        }

        const json = await response.json();
        appendMessage(json.data.reply, 'ai');
    } catch (err) {
        hideTyping();
        sendBtn.disabled = false;
        showError('Sorry, something went wrong. Try again.');
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});