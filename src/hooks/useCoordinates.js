import { useState, useEffect } from 'react';

const API_KEY = '5739b15cf015b1daa9e4085470048ca8';


function useCoordinates(city, apiKey) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchCoords = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoords({ lat, lon });
        } else {
          setError('City not found');
        }
      } catch (err) {
        setError('Failed to fetch coordinates');
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [city, apiKey]);

  return { coords, loading, error };
}

export default useCoordinates;