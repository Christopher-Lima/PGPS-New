const axios = require('axios');
const { secProfile, loginAccount, dataProfile } = require('./cecoco.data');
require('dotenv').config();

axios.defaults.baseURL = 'http://10.155.106.141:80/gisviewer';

// Header comum para reutilização
const commonHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
};

// Obtendo os Cokies de Sessão
async function getSessionCookies() {
    try {
        const response = await axios.get('/main/cecoco/');
        axios.defaults.headers.common["Cookie"] = response.headers['set-cookie'].toString();
        console.log("Sessão iniciada, cookies obtidos");
    } catch (error) {
        console.error("Erro ao obter cookies de sessão:", error.message);
    }
}

// Login na Cecoco
async function login() {
    await getSessionCookies();

    const requests = [
        {
            url: 'j_security_check',
            method: 'post',
            data: secProfile,
            headers: commonHeaders,
            successMessage: 'Sucesso! Segurança checada.',
            errorMessage: 'Erro! Falha ao checar segurança.'
        },
        {
            url: 'rest/login/profiles',
            method: 'post',
            data: dataProfile,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            successMessage: 'Sucesso! Login no perfil realizado.',
            errorMessage: 'Erro! Falha no login do perfil.'
        },
        {
            url: 'login/cecoco/',
            method: 'post',
            data: loginAccount,
            headers: commonHeaders,
            successMessage: 'Sucesso! Cecoco funcionando.',
            errorMessage: 'Erro! Falha ao fazer login na Cecoco.'
        },
        {
            url: '/main/cecoco/',
            method: 'get',
            headers: commonHeaders,
            successMessage: 'Sucesso! Conexão com a Cecoco confirmada.',
            errorMessage: 'Erro! Falha na confirmação da conexão com a Cecoco.'
        }
    ];

    for (const request of requests) {
        try {
            const response = await axios({
                method: request.method,
                url: request.url,
                data: request.data,
                headers: request.headers
            });
            if (response.status === 200) {
                console.log(request.successMessage);
            } else {
                console.log(`${request.errorMessage}:`, response.status, response.statusText);
            }
        } catch (error) {
            console.error(`Erro ao fazer ${request.errorMessage.toLowerCase()}:`, error.message);
        }
    }
}

async function getLocationData() {
    login();

    try {
        const response = await axios.get(`/gisviewer/rest/resourceposition/10000/admin/geojson`);
        if (response.status === 200) {
            console.log('Sucesso! Dados de localização obtidos.');
            console.log(response.data);
            return response.data;
        } else {
            console.log(`Erro ao obter dados de localização: ${response.status} ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error(`Erro ao obter dados de localização:`, error.message);
        return null;
    }
}


getLocationData();
module.exports = { login, getLocationData };