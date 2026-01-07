const apiUrl = '/api/weather';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const loading = document.getElementById('loading');
const weatherContent = document.getElementById('weather-content');
const errorMessage = document.getElementById('error-message');
const appBackground = document.querySelector('.app-background');

// Event Listeners
searchBtn.addEventListener('click', () => handleSearch());
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
}

async function fetchWeather(city) {
    showLoading();

    try {
        const response = await fetch(`${apiUrl}?city=${city}`);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError();
        console.error(error);
    }
}

function updateUI(data) {
    const current = data.current;
    const location = data.location;
    const aqi = current.air_quality;

    // Main Info
    document.getElementById('location-text').textContent = `${location.name}, ${location.country}`;
    document.getElementById('temp-value').textContent = Math.round(current.temp_c);
    document.getElementById('condition-text').textContent = current.condition.text;
    document.getElementById('weather-icon').src = `https:${current.condition.icon}`;
    document.getElementById('last-updated').textContent = current.last_updated;

    // Details
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('wind').textContent = current.wind_kph;
    document.getElementById('feels-like').textContent = Math.round(current.feelslike_c);
    document.getElementById('uv').textContent = current.uv;
    document.getElementById('pressure').textContent = current.pressure_mb;
    document.getElementById('visibility').textContent = current.vis_km;

    // AQI
    if (aqi) {
        document.getElementById('pm2_5').textContent = aqi.pm2_5.toFixed(1);
        document.getElementById('pm10').textContent = aqi.pm10.toFixed(1);
        document.getElementById('co').textContent = aqi.co.toFixed(1);
        document.getElementById('no2').textContent = aqi.no2.toFixed(1);

        const epaIndex = aqi['us-epa-index'];
        document.getElementById('us-epa-index').textContent = epaIndex;

        const aqiStatusElement = document.getElementById('aqi-status');
        const statusInfo = getAQIStatus(epaIndex);
        aqiStatusElement.textContent = statusInfo.text;
        aqiStatusElement.style.color = statusInfo.color;
    }

    // Dynamic Background Theme (Day/Night)
    updateBackground(current.is_day);

    showContent();
}

function getAQIStatus(index) {
    switch (index) {
        case 1: return { text: 'Good', color: '#4ade80' };
        case 2: return { text: 'Moderate', color: '#facc15' };
        case 3: return { text: 'Unhealthy for Sensitive Groups', color: '#fb923c' };
        case 4: return { text: 'Unhealthy', color: '#f87171' };
        case 5: return { text: 'Very Unhealthy', color: '#a78bfa' };
        case 6: return { text: 'Hazardous', color: '#881337' };
        default: return { text: 'Unknown', color: '#fff' };
    }
}

function updateBackground(isDay) {
    if (isDay === 1) {
        // Day gradient
        appBackground.style.background = 'linear-gradient(125deg, #38bdf8 0%, #3b82f6 50%, #1e40af 100%)';
    } else {
        // Night gradient
        appBackground.style.background = 'linear-gradient(125deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)';
    }
}

function showLoading() {
    loading.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function showContent() {
    loading.classList.add('hidden');
    weatherContent.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError() {
    loading.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}
