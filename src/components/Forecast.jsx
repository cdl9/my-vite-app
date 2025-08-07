import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';
import ForecastModal from './ForecastModal';

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
            <ForecastDay item={item} unit={unit}
              onClick={() => openModal(item, 'day')}
            />
          ))}
      </div>

      {selectedHour && (
        <ForecastModal item={selectedHour} onClose={closeModal} unit={unit} city={forecast.city} forecastType={typeForecast}/>
      )}
    </div>
  );
}

export default Forecast;
