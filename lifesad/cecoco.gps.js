const axios = require("axios");
const featuresobjetct = require("./dados.json");
const DelayGPS = 10000;

const subscriber = '10000'; // All subscribers
const profile = 'admin'; // Admin profile

axios.defaults.baseURL = 'http://10.155.106.141:80';
axios.defaults.headers.common["User-Agent"] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59';


function atualizaGPS() {
    setInterval(getGPS, DelayGPS);
}

// Function to get GPS data
async function getGPS() {
    try {
        const response = await axios.get(`/gisviewer/rest/resourceposition/${subscriber}/${profile}/geojson`, {
            params: { rand: Math.random().toString() },
            headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' }
        });
        console.log("AQUIIIIIIIIII");
        console.log("GPS data:", featuresobjetct);
        handleGPSData(featuresobjetct);
    } catch (error) {
        console.error("Error getting GPS data:", error);
    }
}

// Function to handle GPS data
function handleGPSData(data) {
    if (!data || !data.features) {
        console.log("Empty GPS data received.");
        return;
    }
    data.features.forEach(element => {
        const { coordinates } = element.geometry;
        const { resourcename, datetime } = element.properties;
        const latitude = coordinates[0];
        const longitude = coordinates[1];
        coordinates[0] = longitude;
        coordinates[1] = latitude;

        const message = {
            lastDate: data.lastDate,
            datetime: datetime,
            resourcename: resourcename.substring(resourcename.indexOf("96"), resourcename.indexOf("96") + 7),
            coordinates: coordinates
        };
        
        console.log('GPS Data:', message);
    });
}

atualizaGPS();
module.exports = { atualizaGPS };