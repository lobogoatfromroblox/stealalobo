const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });

let players = [];

server.on('connection', (ws) => {
    players.push(ws);

    ws.on('message', (message) => {
        // Envia pra todos os outros jogadores
        players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(message);
            }
        });
    });

    ws.on('close', () => {
        players = players.filter(p => p !== ws);
    });
});

console.log(`Servidor rodando na porta ${PORT}`);
