const axios = require('axios');
const { login } = require ('./cecoco.connection');
const delay = 5000; // Intervalo das atualizações do GPS em milisegundos | 10 seg = 10000

async function getGPS() {
    await login();

    setInterval(getData, delay);
};

async function getData() {

    try {
        const response = await axios.get(`rest/resourceposition/10000/admin/geojson`, { params: { rand: Math.random().toString() }, headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' }});
        gpsData(response.data);
    } catch (error) {
        console.error(`Erro ao obter dados de localização:`, error.message);
        return null;
    }
}

function gpsData(data) {
    if (!data || !data.features) {
        console.log("Os dados recebidos do GPS estão vazios");
        return;
    } else {
        data.features.forEach(element => {
            const {resourcename, datetime } = element.properties;
            const {coordinates } = element.geometry;

            const messageData = {
                resourcename: resourcename.substring(resourcename.indexOf("96"), resourcename.indexOf("96") + 7),
                coordinates: coordinates,
                datetime: datetime,
                lastDate: data.lastDate,
            }

            console.log("GPS Data: ", messageData);
        })
    }
};

getGPS();
module.exports = { getGPS };