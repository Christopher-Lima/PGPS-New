const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const {loginCecoco, getLocationData } = require('./cecoco/cecoco.connection');

// Configurando CORS
fastify.register(cors, { origin: process.env.CORS_ORIGIN || '*' });

// Configurando Helmet para segurança
fastify.register(helmet);

// Rota para login -- IGNORE DEPOIS
fastify.post('/login', async (request, reply) => {
    try {
        await loginCecoco();
        const locationData = await getLocationData();
        reply.send({ message: 'Login realizado e dados de localização obtidos', locationData });
    } catch (error) {
        reply.status(500).send({ error: 'Falha no login ou obtenção de dados de localização' });
    }
});

// Exportando a instância do Fastify
module.exports = fastify;