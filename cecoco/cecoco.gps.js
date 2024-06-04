const axios = require('axios');
const delay = 5000; // Intervalo das atualizações do GPS em milisegundos | 10 seg = 10000

const subscriber = '10000'; // All subscribers
const profile = 'admin'; // Admin profile


axios.defaults.baseURL = 'http://10.155.106.141:80';
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59';


async function getGPS() {
    setInterval(getData, delay);
};

async function getData() {

    try {
        const response = await axios.get(`rest/resourceposition/10000/admin/geojson`, {
            params: { rand: Math.random().toString() },
            headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' }
        });
        console.log("GPS data:", response.data);
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
            const { coordinates } = element.geometry;
            const { resourcename, datetime } = element.properties;
            const latitude = coordinates[0];
            const longitude = coordinates[1];
            coordinates[0] = longitude;
            coordinates[1] = latitude;

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

module.exports = { getGPS };