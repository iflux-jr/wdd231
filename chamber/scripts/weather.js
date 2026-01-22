// OpenWeatherMap API Configuration
const apiKey = 'b8a70ae19c023de72d34a77b3a81254d'; // From https://openweathermap.org/api
const city = 'Calabar';
const country = 'NG';
const units = 'metric'; // Use 'metric' for Celsius

// Calabar, Nigeria coordinates
const lat = 4.9757;
const lon = 8.3417;

async function getWeatherData() {
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
        );
        
        // 3-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
        );
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data unavailable');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayMockWeather(); // Fallback to mock data
    }
}

function displayCurrentWeather(data) {
    document.getElementById('current-temp').textContent = Math.round(data.main.temp);
    document.getElementById('weather-description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    document.getElementById('high-temp').textContent = Math.round(data.main.temp_max);
    document.getElementById('low-temp').textContent = Math.round(data.main.temp_min);
    document.getElementById('humidity').textContent = data.main.humidity;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    
    // Get unique days from forecast (every 8th item = 24 hours)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length && dailyForecasts.length < 3; i += 8) {
        dailyForecasts.push(data.list[i]);
    }
    
    // Day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = days[date.getDay()];
        
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div class="day">${index === 0 ? 'Today' : dayName}</div>
            <div class="temp">${Math.round(forecast.main.temp)}°F</div>
            <div class="desc">${forecast.weather[0].main}</div>
        `;
        
        forecastContainer.appendChild(dayElement);
    });
}

// Fallback mock data for when API fails
function displayMockWeather() {
    document.getElementById('current-temp').textContent = '75';
    document.getElementById('weather-description').textContent = 'Partly Cloudy';
    document.getElementById('high-temp').textContent = '85';
    document.getElementById('low-temp').textContent = '52';
    document.getElementById('humidity').textContent = '34';
    
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    
    const mockForecast = [
        { day: 'Today', temp: '90', desc: 'Sunny' },
        { day: 'Wed', temp: '89', desc: 'Cloudy' },
        { day: 'Thu', temp: '68', desc: 'Rain' }
    ];
    
    mockForecast.forEach(forecast => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div class="day">${forecast.day}</div>
            <div class="temp">${forecast.temp}°F</div>
            <div class="desc">${forecast.desc}</div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Get weather when page loads
document.addEventListener('DOMContentLoaded', getWeatherData);