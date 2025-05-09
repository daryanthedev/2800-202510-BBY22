// Make sure getWeather.js is compiled from getWeather.ts and available
import getWeather from './js/getWeather.js';

// Simple icon mapping (you can expand this)
const iconMap = {
  'Clear': 'Sunny.svg',
  'Clouds': 'Cloudy.svg',
  'Rain': 'Rainy.svg',
  'Snow': 'Snowy.svg',
  'Thunderstorm': 'Thunder.svg'
};

async function updateWeather() {
  try {
    const weather = await getWeather();
    
    // Update the DOM
    document.getElementById('weather-city').textContent = weather.location;
    document.getElementById('weather-temp').textContent = `${Math.round(weather.temp)}°C`;
    document.getElementById('weather-desc').textContent = weather.weather.description;
    
    // Set the icon
    const iconName = iconMap[weather.weather.main] || 'Cloudy.svg';
    document.getElementById('weather-icon').src = `/weather-icons/${iconName}`;
    
  } catch (error) {
    console.error('Error loading weather:', error);
    document.getElementById('weather-city').textContent = 'Weather unavailable';
    document.getElementById('weather-temp').textContent = '';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', updateWeather);