const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server }); // server é o HTTP criado pelo express

const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos (CSS, JS, imagens)
app.use(express.static(__dirname));

// Retorna o index.html na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Jogador conectado!');

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        // lógica de salas, inventário, ações aqui
    });

    ws.on('close', () => console.log('Jogador desconectou'));
});

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));



