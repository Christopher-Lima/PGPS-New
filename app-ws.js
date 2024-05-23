const WebSocket = require('ws');

function broadcast(jsonObject){
    if(!this.clients) return;
    this.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

/**
 * Tratamento de erros no WebSocket.
 * @param {WebSocket} ws - A conexão WebSocket.
 * @param {Error} err - O erro ocorrido.
 */
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

/**
 * Tratamento de mensagens recebidas no WebSocket.
 * @param {WebSocket} ws - A conexão WebSocket.
 * @param {string} data - Os dados recebidos.
 */
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send('recebido!');
}

/**
 * Configura eventos para novas conexões WebSocket.
 * @param {WebSocket} ws - A nova conexão WebSocket.
 * @param {http.IncomingMessage} req - O pedido HTTP associado à conexão.
 */
function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', err => onError(ws, err));
    console.log('onConnection');
}

/**
 * Inicializa um servidor WebSocket.
 * @param {http.Server} server - O servidor HTTP ao qual o WebSocket será anexado.
 */
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
    
    setInterval(async () => {
        const locationData = await getLocationData();
        if (locationData) {
            wss.broadcast(locationData);
        }
    }, 10000);
};
