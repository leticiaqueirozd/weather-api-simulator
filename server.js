const express = require('express');
const app = express();
const port = 3001;

let redAlerts = [];

// Dados meteorológicos iniciais por bairro
let weatherData = {
    "Boa Viagem": {
        "temperature": 29.0,
        "humidity": 80,
        "precipitation": 10,
        "alert": "Normal"
    },
    "Casa Forte": {
        "temperature": 28.0,
        "humidity": 70,
        "precipitation": 15,
        "alert": "Normal"
    },
    "Boa Vista": {
        "temperature": 30.0,
        "humidity": 75,
        "precipitation": 5,
        "alert": "Normal"
    },
    "Pina": {
        "temperature": 27.5,
        "humidity": 85,
        "precipitation": 12,
        "alert": "Normal"
    },
    "Santo Amaro": {
        "temperature": 26.0,
        "humidity": 78,
        "precipitation": 20,
        "alert": "Amarelo"
    },
    "Torre": {
        "temperature": 25.5,
        "humidity": 65,
        "precipitation": 30,
        "alert": "Amarelo"
    },
    "Encruzilhada": {
        "temperature": 24.0,
        "humidity": 90,
        "precipitation": 45,
        "alert": "Vermelho"
    }
};

// Função para atualizar dados meteorológicos periodicamente
const updateWeatherData = () => {
    const neighborhoods = Object.keys(weatherData);
    neighborhoods.forEach(neighborhood => {
        weatherData[neighborhood].temperature = (Math.random() * 35).toFixed(1);
        weatherData[neighborhood].humidity = (Math.random() * 100).toFixed(1);
        weatherData[neighborhood].precipitation = (Math.random() * 50).toFixed(1);

        const precipitation = weatherData[neighborhood].precipitation;

        if (precipitation > 40) {
            weatherData[neighborhood].alert = 'Vermelho';
            // Salva automaticamente o alerta vermelho
            const newRedAlert = { location: neighborhood, details: `Alerta vermelho devido a precipitação de ${precipitation}mm`, timestamp: new Date() };
            redAlerts.push(newRedAlert);
            console.log('Novo alerta vermelho automático salvo:', newRedAlert);
        } else if (precipitation > 20) {
            weatherData[neighborhood].alert = 'Amarelo';
        } else {
            weatherData[neighborhood].alert = 'Normal';
        }
    });
};

// Atualizar dados meteorológicos a cada 1 minuto
setInterval(updateWeatherData, 1 * 60 * 1000);

// Middleware para tratar o corpo das requisições como JSON
app.use(express.json());

// Rota para obter dados meteorológicos por bairro
app.get('/weather/:neighborhood', (req, res) => {
    const neighborhood = req.params.neighborhood;
    if (weatherData[neighborhood]) {
        res.json(weatherData[neighborhood]);
    } else {
        res.status(404).send('Bairro não encontrado');
    }
});

// Rota para obter todos os alertas vermelhos
app.get('/red-alerts', (req, res) => {
    res.json(redAlerts);
});

// Rota para receber novos alertas vermelhos
app.post('/red-alerts', (req, res) => {
    const { location, details } = req.body;
    const newRedAlert = { location, details, timestamp: new Date() };
    redAlerts.push(newRedAlert);
    res.status(201).json({ message: 'Alerta vermelho salvo com sucesso!' });
});

app.listen(port, () => {
    console.log(`Servidor de simulação de API meteorológica rodando em http://localhost:${port}`);
});
