const qs = require('qs');
require('dotenv').config();

// Constantes de login utilizando variáveis de ambiente
const secProfile = qs.stringify({
    j_username: process.env.USERNAME,
    j_password: process.env.PWD
});

const loginAccount = qs.stringify({
    j_username: process.env.USERNAME,
    j_password: process.env.PWD,
    j_subscriber: '10000',
    j_profile_name: process.env.PROFILE,
    j_organism_id: process.env.ORGANISMID,
    j_organism_name: process.env.ORGANISMNAME,
    j_language: 'pt',
    j_desktop_login: '0'
});

const dataProfile = qs.stringify({
    idsubscriber: '10000',
    username: process.env.USERNAME,
    pwd: process.env.PWD
});

module.exports = { secProfile, loginAccount, dataProfile };
