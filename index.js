const app = require('../PGPS/app');
const appWs = require('../PGPS/app-ws');
require('dotenv').config();


// Iniciando o servidor HTTP com Fastify
const startServer = async () => {
    try {
        await app.listen({ host: '0.0.0.0', port: process.env.PORT || 3000 });
        console.log('App Fastify is running');
        
        // Iniciar o servidor WebSocket
        const server = app.server;
        appWs(server);
        console.log(`App WebSocket Server is running! Port ${process.env.PORT}`);

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();