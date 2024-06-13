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

module.exports = { getGPSData };