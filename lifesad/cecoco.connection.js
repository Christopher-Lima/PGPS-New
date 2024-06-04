const axios = require("axios");
const { atualizaGPS } = require('./cecoco.gps');
const qs = require('qs');

const subscriber = '10000'; // All subscribers
const username = 'administrador'; // Admin user
const password = 'teltronic'; // Admin password
const profile = 'admin'; // Admin profile

axios.defaults.baseURL = 'http://10.155.106.141:80';
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59';

// Axios requests to perform login steps
async function performLoginSteps() {
    try {
        await passo0();
        await passo1();
        await passo2();
        await passo3();
        await passo4();
        await passo5();
        await passo6();
        await passo7();
        await passo8();
        await passo9();
        await passo10();
        await passo11();
        atualizaGPS();
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
        const response = await axios.get(`/gisviewer/rest/login/organism/get/id/name/${subscriber}/${username}/${password}/${profile}`);
        console.log("Step 2 response status:", response.status);
    } catch (error) {
        console.error("Error in step 2:", error);
    }
}

async function passo3() {
    try {
        const response = await axios.post('/gisviewer/login/cecoco/', qs.stringify({
            j_username: username,
            j_password: password,
            j_subscriber: subscriber,
            j_profile_name: profile,
            j_organism_id: '0',
            j_organism_name: 'Police',
            j_language: 'pt',
            j_desktop_login: '0'
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

async function passo4() {
    try {
        const response = await axios.get('/gisviewer/main/cecoco/');
        console.log("Step 4 response status:", response.status);
    } catch (error) {
        console.error("Error in step 4:", error);
    }
}

async function passo5() {
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
        console.log("Step 5 response status:", response.status);
    } catch (error) {
        console.error("Error in step 5:", error);
    }
}

async function passo6() {
    try {
        const response = await axios.get('/gisviewer/main/cecoco/');
        console.log("Step 6 response status:", response.status);
    } catch (error) {
        console.error("Error in step 6:", error);
    }
}

async function passo7() {
    try {
        const response = await axios.get(`/gisviewer/rest/admin/servicetypes/${subscriber}/${profile}/${username}?rand=${Math.random()}`);
        console.log("Step 7 response status:", response.status);
        console.log("Service types data:", response.data);
    } catch (error) {
        console.error("Error in step 7:", error);
    }
}

async function passo8() {
    try {
        const response = await axios.get(`/gisviewer/rest/admin/resourcegroups/${subscriber}/${profile}?rand=${Math.random()}`);
        console.log("Step 8 response status:", response.status);
        console.log("Resource groups data:", response.data);
    } catch (error) {
        console.error("Error in step 8:", error);
    }
}

async function passo9() {
    try {
        const response = await axios.get(`/gisviewer/rest/admin/resourcetypes/${subscriber}/${profile}?rand=${Math.random()}`);
        console.log("Step 9 response status:", response.status);
        console.log("Resource types data:", response.data);
    } catch (error) {
        console.error("Error in step 9:", error);
    }
}

async function passo10() {
    try {
        const response = await axios.get(`/gisviewer/rest/admin/organisms/${subscriber}/0?rand=${Math.random()}`);
        console.log("Step 10 response status:", response.status);
        console.log("Organisms data:", response.data);
    } catch (error) {
        console.error("Error in step 10:", error);
    }
}

async function passo11() {
    try {
        const response = await axios.get(`/gisviewer/rest/admin/ips/${subscriber}?rand=${Math.random()}`);
        console.log("Step 11 response status:", response.status);
        console.log("IPs data:", response.data);
    } catch (error) {
        console.error("Error in step 11:", error);
    }
}

performLoginSteps();
