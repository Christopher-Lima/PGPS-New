const axios = require("axios");
const qs = require('qs');
const { getGPSData } = require('./cecoco.gps')

const subscriber = '10000';
const username = 'administrador';
const password = 'teltronic';
const profile = 'admin';
const language = 'pt';
const organism_name = 'Police';
const id_0 = '0';

axios.defaults.baseURL = 'http://10.155.106.141:80';
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59';

// Axios requests to perform login steps
async function LoginSteps() {
    try {
        await passo0();
        await passo1();
        await passo2();
        await passo3();
        await atualizaGPS();
    } catch (error) {
        console.error("Error during login steps:", error);
    }
}

async function passo0() {
    try {
        const response = await axios.get('/gisviewer/main/cecoco/');
        console.log("Step 0 response status:", response.status);
        axios.defaults.headers.common["Cookie"] = response.headers['set-cookie'].toString();
    } catch (error) {
        console.error("Error in step 0:", error);
    }
}

async function passo1() {
    try {
        const response = await axios.post('/gisviewer/rest/login/profiles', qs.stringify({
            idsubscriber: subscriber,
            username: username,
            pwd: password
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        console.log("Step 1 response status:", response.status);
    } catch (error) {
        console.error("Error in step 1:", error);
    }
}

async function passo2() {
    try {
        const response = await axios.post('/gisviewer/login/cecoco/', qs.stringify({
            j_username: username,
            j_password: password,
            j_subscriber: subscriber,
            j_profile_name: profile,
            j_organism_id: id_0,
            j_organism_name: organism_name,
            j_language: language,
            j_desktop_login: id_0
        }), {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("Step 2 response status:", response.status);
    } catch (error) {
        console.error("Error in step 2:", error);
    }
}

async function passo3() {
    try {
        const response = await axios.post('/gisviewer/j_security_check', qs.stringify({
            j_username: username,
            j_password: password
        }), {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("Step 3 response status:", response.status);
    } catch (error) {
        console.error("Error in step 3:", error);
    }
}

function atualizaGPS() {
    setInterval(getGPS, 10000); // Delay para atualização dos dados
}

async function getGPS() {
    try {
        const response = await axios.get(`/gisviewer/rest/resourceposition/${subscriber}/${profile}/geojson`, {
            params: { rand: Math.random().toString() },
            headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' }
        });
        console.log("GPS data:", response.data);
        getGPSData(response.data);
    } catch (error) {
        console.error("Error getting GPS data:", error);
    }
}

module.exports = { LoginSteps };