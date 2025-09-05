const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app); // HTTP server

const PORT = process.env.PORT || 10000;

// Serve HTML, JS e CSS
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket server ligado ao mesmo HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Jogador conectado via WebSocket!');

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        // Lógica de salas e ações aqui
    });

    ws.on('close', () => console.log('Jogador desconectou'));
});

// Inicia servidor
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));




