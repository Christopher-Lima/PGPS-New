const { LoginSteps } = require('./cecocoAuth');
const { atualizaGPS } = require('./cecocoGPS');

async function initialize() {
    await LoginSteps();
    atualizaGPS();
}

initialize();