// src/services/weatherService.js

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeatherByCity(city, unit, apiKey) {
  const response = await fetch(`${API_BASE_URL}?q=${city}&appid=${apiKey}&units=${unit}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch weather');
  }
  return response.json();
}

export async function fetchWeatherByCoords(lat, lon, unit, apiKey) {
  const response = await fetch(`${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch weather');
  }
  return response.json();
}

export async function fetchForecastByCoords(lat, lon, unit, apiKey) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${unit}&appid=${apiKey}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch forecast');
  }
  return response.json();
}
