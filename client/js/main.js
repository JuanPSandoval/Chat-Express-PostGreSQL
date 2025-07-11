import {io} from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';
// Referencias a ventanas y botones
const mainMenu = document.getElementById('mainMenu');
const joinGroupForm = document.getElementById('joinGroupForm');
const createGroupForm = document.getElementById('createGroupForm');
const chatContainer = document.getElementById('chatContainer');

const btnJoinGroup = document.getElementById('btnJoinGroup');
const btnCreateGroup = document.getElementById('btnCreateGroup');
const btnBackJoin = document.getElementById('btnBackJoin');
const btnBackCreate = document.getElementById('btnBackCreate');

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

let socket;
let currentGroupId = null;
let username = null;

// Mostrar/ocultar ventanas
btnJoinGroup.onclick = () => {
    mainMenu.style.display = 'none';
    joinGroupForm.style.display = 'flex';
};
btnCreateGroup.onclick = () => {
    mainMenu.style.display = 'none';
    createGroupForm.style.display = 'flex';
};
btnBackJoin.onclick = () => {
    joinGroupForm.style.display = 'none';
    mainMenu.style.display = 'flex';
    document.getElementById('joinGroupError').textContent = '';
};
btnBackCreate.onclick = () => {
    createGroupForm.style.display = 'none';
    mainMenu.style.display = 'flex';
    document.getElementById('createGroupError').textContent = '';
};

const getusername = async () => {
    return "user12345"
};

// Inicializar socket y listeners de chat
async function ensureSocket() {
    if (socket) return;
    username = await getusername();
    console.log("Username generado antes de crear socket:", username);
    socket = io({ auth: { username, serverOffset: 0 } });
    setupChatListeners();
}

// Crear grupo
document.getElementById('btnCreateGroupSend').onclick = async () => {
    const id = document.getElementById('createGroupId').value.trim();
    const name = document.getElementById('createGroupName').value.trim();
    const password = document.getElementById('createGroupPassword').value.trim();
    const errorDiv = document.getElementById('createGroupError');
    errorDiv.textContent = '';

    if (!id || !name || !password) {
        errorDiv.textContent = 'Completa todos los campos';
        return;
    }

    await ensureSocket();

    socket.emit('create group', { id, name, password });
    socket.once('group created', (data) => {
        createGroupForm.style.display = 'none';
        chatContainer.style.display = 'flex';
        currentGroupId = id;
        document.querySelector('.chat-header').textContent = `💬 ${name}`;
        chatMessages.innerHTML = '';
    });
    socket.once('group error', (msg) => {
        errorDiv.textContent = msg;
    });
};

// Unirse a grupo
document.getElementById('btnJoinGroupSend').onclick = async () => {
    const id = document.getElementById('joinGroupId').value.trim();
    const password = document.getElementById('joinGroupPassword').value.trim();
    const errorDiv = document.getElementById('joinGroupError');
    errorDiv.textContent = '';

    if (!id || !password) {
        errorDiv.textContent = 'Completa todos los campos';
        return;
    }

    await ensureSocket();

    socket.emit('join group', { id, password });
    socket.once('group joined', (groupId) => {
        joinGroupForm.style.display = 'none';
        chatContainer.style.display = 'flex';
        currentGroupId = groupId;
        document.querySelector('.chat-header').textContent = `💬 ${groupId}`;
        chatMessages.innerHTML = '';
        // Pedir mensajes del grupo
        socket.emit('get group messages', groupId);
    });
    socket.once('group error', (msg) => {
        errorDiv.textContent = msg;
    });
};

// Lógica de chat
function setupChatListeners() {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (chatInput.value && currentGroupId) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            const userElement = document.createElement('div');
            userElement.textContent = username;
            userElement.style.fontSize = '0.8em';
            userElement.style.color = '#94a3b8';
            userElement.style.marginBottom = '2px';
            messageElement.appendChild(userElement);
            const textElement = document.createElement('div');
            textElement.textContent = chatInput.value;
            messageElement.appendChild(textElement);

            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            socket.emit('chat message', chatInput.value, currentGroupId);
            chatInput.value = '';
        }
    });

    socket.on('chat message', (msg, serverOffset, senderUsername) => {
        const messageElement = document.createElement('div');
        if (senderUsername === username) {
            messageElement.classList.add('message');
        } else {
            messageElement.classList.add('message', 'other');
        }
        const userElement = document.createElement('div');
        userElement.textContent = senderUsername;
        userElement.style.fontSize = '0.8em';
        userElement.style.color = '#94a3b8';
        userElement.style.marginBottom = '2px';
        messageElement.appendChild(userElement);
        const textElement = document.createElement('div');
        textElement.textContent = msg;
        messageElement.appendChild(textElement);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        socket.auth.serverOffset = serverOffset;
    });
    }