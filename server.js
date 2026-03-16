const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allows your HTML file to fetch from this server
app.use(express.static('public')); // Serves your frontend files

app.get('/weather', async (req, res) => {
    // Expecting a query like /weather?ids=KJFK,KLAX
    const ids = req.query.ids; 

    if (!ids) {
        return res.status(400).json({ error: 'Please provide at least one ICAO ID.' });
    }

    const apiUrl = `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json&hours=168`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'ABQwxObs/1.0 (contact: todd.shoemake@noaa.gov)'
            }
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});