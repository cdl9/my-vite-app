import { format } from 'date-fns';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';
import ForecastModal from './ForecastModal';
import HourlyTempChart from './HourlyTempChart';


import { useState } from 'react';



function Forecast({ forecast, unit }) {
  if (!forecast || !forecast.list) return null;

  console.log('ForecastCity',forecast);
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDate = forecast.list[0].dt_txt.split(' ')[0];


  const hourlyForecast = forecast.list
  .slice(0, 6);
  const [selectedHour, setSelectedHour] = useState(null);
  const [typeForecast, setTypeForecast] = useState(null);

  //Hours for Graphic
  const hourlyData = forecast?.list?.slice(0, 8).map((item) => {
    const hours = new Date(item.dt * 1000).getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hours + 11) % 12 + 1) + ' ' + ampm; // Convert to 12-hour format
  return {
    time: formattedHour,
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    rain: item.pop ? Math.round(item.pop * 100) : 0, // Convert probability to mm for simplicity
    tooltipInfo: {
      name: "Temperature",
      value: Math.round(item.main.temp),
      unit: "°C"
    }
    }
  })||[];
  console.log("temp", hourlyData[0].temp);


  const openModal = (item, type) => {
    setSelectedHour(item);
    setTypeForecast(type);
    document.body.style.overflow = 'hidden'; // prevent scrolling
  };

  const closeModal = () => {
    setSelectedHour(null);
    document.body.style.overflow = 'auto'; // re-enable scrolling
  };


  return (
    <div>
      <div className="hourly-forecast">
          <h3>Hourly Forecast</h3>
          <div className="hourly-items">
            {hourlyForecast.map(item => (
              <ForecastHour 
                  key={item.dt}
                  item={item} 
                  unit={unit}
                  onClick={() => openModal(item, 'hour')}
              />
            ))}
          </div>
      </div>
      <h3>5 Days Forecast</h3>

      <div className="forecast">
        {forecast.list
          .filter((_, i) => i % 8 === 0) // Approx. one per day
          .map(item => (
            <ForecastDay key={item.dt} item={item} unit={unit}
              onClick={() => openModal(item, 'day')}
            />
          ))}
      </div>
      {selectedHour && (
        <ForecastModal item={selectedHour} onClose={closeModal} unit={unit} city={forecast.city} forecastType={typeForecast} hourlyData={hourlyData} />
      )}
    </div>
  );
}

export default Forecast;
