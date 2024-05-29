const axios = require('axios');
const { secProfile, loginAccount, dataProfile } = require('./cecoco.data');
require('dotenv').config();

axios.defaults.baseURL = 'http://10.155.106.141:80/gisviewer';
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59';

// Header comum para reutilização
const commonHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
};

// Obtendo os Cookies de Sessão
async function getSessionCookies() {
    try {
        const response = await axios.get('/main/cecoco/');
        axios.defaults.headers.common["Cookie"] = response.headers['set-cookie'].join('; ');
        console.log("Sessão iniciada, cookies obtidos:", axios.defaults.headers.common["Cookie"]);
    } catch (error) {
        console.error("Erro ao obter cookies de sessão:", error.message);
    }
}

// Login na Cecoco
async function login() {
    await getSessionCookies();

    const requests = [
        {
            url: 'rest/login/profiles',
            method: 'post',
            data: dataProfile,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            successMessage: 'Sucesso! Login no perfil realizado.',
            errorMessage: 'Erro! Falha no login do perfil.'
        },
        {
            url: `rest/login/organism/get/id/name/${process.env.SUBSCRIBER}/${process.env.USERNAME}/${process.env.PASSWORD}/${process.env.PROFILE}`,
            method: 'get',
            successMessage: 'Sucesso! Organismo obtido.',
            errorMessage: 'Erro! Falha ao obter organismo.'
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
        },
        {
            url: 'j_security_check',
            method: 'post',
            data: secProfile,
            headers: commonHeaders,
            successMessage: 'Sucesso! Segurança checada.',
            errorMessage: 'Erro! Falha ao checar segurança.'
        },
        {
            url: '/main/cecoco/',
            method: 'get',
            headers: commonHeaders,
            successMessage: 'Sucesso! Conexão com a Cecoco confirmada.',
            errorMessage: 'Erro! Falha na confirmação da conexão com a Cecoco.'
        },
        {
            url: `rest/admin/servicetypes/${process.env.SUBSCRIBER}/${process.env.PROFILE}/${process.env.USERNAME}?rand=${Math.random()}`,
            method: 'get',
            successMessage: 'Sucesso! Tipos de serviço obtidos.',
            errorMessage: 'Erro! Falha ao obter tipos de serviço.'
        },
        {
            url: `rest/admin/resourcegroups/${process.env.SUBSCRIBER}/${process.env.PROFILE}?rand=${Math.random()}`,
            method: 'get',
            successMessage: 'Sucesso! Grupos de recursos obtidos.',
            errorMessage: 'Erro! Falha ao obter grupos de recursos.'
        },
        {
            url: `rest/admin/resourcetypes/${process.env.SUBSCRIBER}/${process.env.PROFILE}?rand=${Math.random()}`,
            method: 'get',
            successMessage: 'Sucesso! Tipos de recursos obtidos.',
            errorMessage: 'Erro! Falha ao obter tipos de recursos.'
        },
        {
            url: `rest/admin/organisms/${process.env.SUBSCRIBER}/0?rand=${Math.random()}`,
            method: 'get',
            successMessage: 'Sucesso! Organismos obtidos.',
            errorMessage: 'Erro! Falha ao obter organismos.'
        },
        {
            url: `rest/admin/ips/${process.env.SUBSCRIBER}?rand=${Math.random()}`,
            method: 'get',
            successMessage: 'Sucesso! IPs obtidos.',
            errorMessage: 'Erro! Falha ao obter IPs.'
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
                console.log(request.successMessage, response.status);
            } else {
                console.log(`${request.errorMessage}:`, response.status, response.statusText);
            }
        } catch (error) {
            console.error(`Erro ao fazer ${request.errorMessage.toLowerCase()}:`, error.message);
        }
    }
}

module.exports = { login };