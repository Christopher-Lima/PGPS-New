const axios = require("axios");
const qs = require('qs');
const CecocoError = require('../errors/appError');
const config = require('./cecocoConfig');

axios.defaults.baseURL = config.baseURL;
axios.defaults.headers.common["User-Agent"] = config.userAgent;

async function executeStep(stepFunction, stepName) {
    try {
        await stepFunction();
        console.log(`${stepName} successful`);
    } catch (error) {
        throw new CecocoError(`Error in ${stepName}: ${error.message}`, error.response?.status || 500);
    }
}

async function passo0() {
    const response = await axios.get('/gisviewer/main/cecoco/');
    axios.defaults.headers.common["Cookie"] = response.headers['set-cookie'].toString();
}

async function passo1() {
    await axios.post('/gisviewer/rest/login/profiles', qs.stringify({
        idsubscriber: config.subscriber,
        username: config.username,
        pwd: config.password
    }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

async function passo2() {
    await axios.post('/gisviewer/login/cecoco/', qs.stringify({
        j_username: config.username,
        j_password: config.password,
        j_subscriber: config.subscriber,
        j_profile_name: config.profile,
        j_organism_id: config.id_0,
        j_organism_name: config.organism_name,
        j_language: config.language,
        j_desktop_login: config.id_0
    }), {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

async function passo3() {
    await axios.post('/gisviewer/j_security_check', qs.stringify({
        j_username: config.username,
        j_password: config.password
    }), {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

async function LoginSteps(retry = true) {
    try {
        console.log("Starting login steps...");
        await executeStep(passo0, "Step 0");
        await executeStep(passo1, "Step 1");
        await executeStep(passo2, "Step 2");
        await executeStep(passo3, "Step 3");
        console.log("Login steps completed successfully.");
    } catch (error) {
        handleError(error);
        if (retry) {
            console.log("Retrying login steps in 5 seconds...");
            setTimeout(() => LoginSteps(false), 5000);
        } else {
            console.error("Reconnection failed. Exiting application.");
            process.exit(1);
        }
    }
}

function handleError(error) {
    console.error("Error message:", error.message);
    console.error("Status code:", error.statusCode);
    console.error("Stack trace:", error.stack);
    if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
    }
}

module.exports = { LoginSteps, handleError };