const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const airports = JSON.parse(data);
        const topAirports = [];
        // Only get major airports (type: large_airport or medium_airport) and with IATA code
        for (const key in airports) {
            const a = airports[key];
            if (a.iata && typeof a.iata === 'string' && a.iata.trim() !== '') {
                topAirports.push({
                    code: a.iata,
                    name: a.name,
                    city: a.city,
                    country: a.country,
                });
            }
        }
        fs.writeFileSync('./public/airports.json', JSON.stringify(topAirports));
        console.log('Downloaded and filtered', topAirports.length, 'airports.');
    });
});
