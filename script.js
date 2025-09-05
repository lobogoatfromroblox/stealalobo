// =================================================
// CONFIGURAÇÃO DO SERVIDOR
// =================================================
const WS_SERVER = 'wss://steal-a-lobo.onrender.com';
const socket = new WebSocket(WS_SERVER);

let PLAYER_ID = null; // será definido após login/criação
let CURRENT_ROOM = null; 

// =================================================
// CONEXÃO E STATUS
// =================================================
socket.addEventListener('open', () => {
    console.log('Conectado ao servidor!');
    const statusEl = document.getElementById('connectionStatus');
    if(statusEl) statusEl.textContent = '🟢 Conectado ao servidor!';
});

socket.addEventListener('close', () => {
    const statusEl = document.getElementById('connectionStatus');
    if(statusEl) statusEl.textContent = '🔴 Conexão perdida!';
});

// =================================================
// ENVIO DE AÇÕES
// =================================================
function sendAction(actionType, actionData) {
    if(!PLAYER_ID || !CURRENT_ROOM) return;

    const payload = {
        playerId: PLAYER_ID,
        roomCode: CURRENT_ROOM,
        type: actionType,
        data: actionData
    };
    socket.send(JSON.stringify(payload));
}

// =================================================
// RECEBENDO AÇÕES
// =================================================
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    handleMultiplayerData(data);
});

// =================================================
// FUNÇÃO PARA PROCESSAR AÇÕES DE OUTROS JOGADORES
// =================================================
function handleMultiplayerData(data) {
    switch(data.type) {
        case 'collect':
            console.log(`Jogador ${data.playerId} coletou da esteira`, data.data);
            break;

        case 'attack':
            console.log(`Jogador ${data.playerId} atacou:`, data.data);
            break;

        case 'buyCrate':
            console.log(`Jogador ${data.playerId} comprou crate:`, data.data.crateType);
            break;

        case 'lockBase':
            console.log(`Jogador ${data.playerId} trancou a base!`);
            break;

        case 'updateInventory':
            if(data.playerId === PLAYER_ID) updateInventoryUI(data.data);
            break;

        case 'updatePlayersList':
            updatePlayersList(data.data);
            break;

        default:
            console.log('Ação recebida:', data);
    }
}

// =================================================
// LOGIN / CRIAÇÃO DE CONTA
// =================================================
function createAccount(username, password) {
    socket.send(JSON.stringify({
        type: 'createAccount',
        data: { username, password }
    }));
}

function login(username, password) {
    socket.send(JSON.stringify({
        type: 'login',
        data: { username, password }
    }));
}

// Chamadas do servidor devem definir PLAYER_ID e atualizar UI
function handleLoginSuccess(playerId) {
    PLAYER_ID = playerId;
    document.getElementById('currentPlayer').textContent = playerId;
}

// =================================================
// SALAS
// =================================================
function createRoom(roomCode) {
    CURRENT_ROOM = roomCode;
    socket.send(JSON.stringify({ type: 'createRoom', roomCode }));
    document.getElementById('currentRoom').textContent = roomCode;
}

function joinRoom(roomCode) {
    CURRENT_ROOM = roomCode;
    socket.send(JSON.stringify({ type: 'joinRoom', roomCode }));
    document.getElementById('currentRoom').textContent = roomCode;
}

// =================================================
// AÇÕES DO JOGADOR (integração com funções originais)
// =================================================
function collectFromBelt() {
    originalCollectFromBelt(); // sua função já existente
    sendAction('collect', { beltItems: getBeltItemsData() });
}

function attackRandomPlayer() {
    originalAttackRandomPlayer();
    sendAction('attack', { targetPlayerId: getRandomPlayerId() });
}

function buyCrate(crateType) {
    originalBuyCrate(crateType);
    sendAction('buyCrate', { crateType });
}

function lockMyBase() {
    originalLockMyBase();
    sendAction('lockBase', {});
}

// =================================================
// FUNÇÕES AUXILIARES
// =================================================
function getBeltItemsData() {
    const items = [];
    document.querySelectorAll('#beltItems .item').forEach(item => {
        items.push({ id: item.id, name: item.dataset.name });
    });
    return items;
}

function getRandomPlayerId() {
    const list = Array.from(document.querySelectorAll('#playersList .player'));
    if(list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)].dataset.playerId;
}

function updateInventoryUI(inventoryData) {
    const grid = document.getElementById('inventoryGrid');
    if(!grid) return;
    grid.innerHTML = '';
    inventoryData.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('inventory-item');
        div.textContent = item.name;
        grid.appendChild(div);
    });
}

function updatePlayersList(players) {
    const listEl = document.getElementById('playersList');
    if(!listEl) return;
    listEl.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('player');
        div.dataset.playerId = p.playerId;
        div.textContent = p.playerName;
        listEl.appendChild(div);
    });
    document.getElementById('onlineCount').textContent = players.length;
}

// =================================================
// INICIALIZAÇÃO
// =================================================
console.log('Multiplayer iniciado!');
