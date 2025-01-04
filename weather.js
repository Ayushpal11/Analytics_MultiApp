async function checkWeather({ latitude, longitude }) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`)
        const data = await response.json();

        if (data) {
            return data
        } else {
            console.error('No results found');
        }
    } catch (error) {
        console.log(error);
    }
}

async function getCoordinates(placeName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const location = data[0];
            console.log(`Latitude: ${location.lat}, Longitude: ${location.lon}`);
            const res = await checkWeather({ latitude: location.lat, longitude: location.lon })
            // const keys = keyify(res)
            const FileSystem = require("fs");
            FileSystem.writeFile('file.json', JSON.stringify(res), (error) => {
                if (error) throw error;
            });
        } else {
            console.error('No results found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getCoordinates('Vellore Institute of Technology, Vellore');

const keyify = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...keyify(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);
