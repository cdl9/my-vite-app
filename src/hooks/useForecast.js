import { useState, useEffect } from 'react';

const API_KEY = '5739b15cf015b1daa9e4085470048ca8';

function useForecast({ lat, lon, unit }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lat || !lon) return;

    setLoading(true);
    setError('');
    console
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          setForecast(data);
        } else {
          setError(data.message || 'Could not fetch forecast');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch forecast');
        console.error('Forecast fetch error:', err);
        setLoading(false);
      });
  }, [lat, lon, unit]);

  return { forecast, loading, error };
}

export default useForecast;
