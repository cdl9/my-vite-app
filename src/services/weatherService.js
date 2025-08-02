// src/services/weatherService.js

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather({ city, lat, lon, unit, apiKey }) {
  let url;

  if (lat && lon) {
    // Fetch by coordinates
    url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  } else if (city) {
    // Fetch by city name
    url = `${API_BASE_URL}?q=${city}&appid=${apiKey}&units=${unit}`;
  } else {
    throw new Error("Either city or coordinates must be provided.");
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Weather data not found");
  }
  return res.json();
}



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


export async function fetchCoordinatesByCity(city, apiKey) {
  const res = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );
  const data = await res.json();
  if (!res.ok || data.length === 0) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon };
}

export async function fetchForecastByCoords(lat, lon, unit, apiKey) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return data;
}
