const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const {loginCecoco, getLocationData } = require('./cecoco/cecoco.connection');

// Configurando CORS
fastify.register(cors, { origin: process.env.CORS_ORIGIN || '*' });

// Configurando Helmet para segurança
fastify.register(helmet);

// Exportando a instância do Fastify
module.exports = fastify;