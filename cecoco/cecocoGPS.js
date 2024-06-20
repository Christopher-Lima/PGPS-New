const axios = require("axios");
const { handleError } = require('./cecocoAuth');
const config = require('./cecocoConfig');

// Função para obter dados de GPS do servidor
async function getGPS() {
    try {
        const response = await axios.get(`/gisviewer/rest/resourceposition/${config.subscriber}/${config.profile}/geojson`, {
            params: { rand: Math.random().toString() },
            headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' }
        });
        console.log("GPS data retrieved successfully.");
        console.log("GPS data:", response.data);
        getGPSData(response.data);
    } catch (error) {
        handleError(error);
    }
}

// Função para atualizar dados de GPS periodicamente
function atualizaGPS() {
    async function update() {
        await getGPS();
        setTimeout(update, config.gpsUpdateInterval); // Chama a função novamente após o intervalo configurado
    }
    update(); // Inicia a primeira chamada imediatamente
}

// Função para processar e filtrar os dados de GPS
function getGPSData(data) {
    if (!data || !data.features) {
        console.log("Empty GPS data received.");
        return;
    }
    const filteredFeatures = data.features.filter(element => {
        const resourcename = element.properties.resourcename;
        return resourcename.includes("960") || resourcename.includes("962") || resourcename.includes("963");
    });
    
    filteredFeatures.forEach(element => {
        const { coordinates } = element.geometry;
        const { resourcename, datetime } = element.properties;
        const latitude = coordinates[0];
        const longitude = coordinates[1];
        coordinates[0] = longitude;
        coordinates[1] = latitude;

        const message = {
            resourcename: resourcename,
            lastDate: data.lastDate,
            datetime: datetime,
            coordinates: coordinates
        };
        console.log('GPS Data:', message);
    });
}

module.exports = { atualizaGPS, getGPS, getGPSData };
