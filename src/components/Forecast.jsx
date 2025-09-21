import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';
import ForecastModal from './ForecastModal';
import HourlyTempChart from './HourlyTempChart';
import { formatLocalDate, formatLocalHour, getLocalDateKey } from './utils/time';
import WeatherMap from './WeatherMap';
import SavedCities from './SavedCities';

import { format, isToday, parse, parseISO } from 'date-fns';

import { useState } from 'react';



function Forecast({ forecast, unit, darkMode}) {
  if (!forecast || !forecast.list) return null;

  const hourlyForecast = forecast.list.slice(0, 6).map(item => ({
  ...item,
  localHour: formatLocalHour(item.dt, forecast.city.timezone)
}));
  console.log("hourlyForecast", hourlyForecast);
  
  const [selectedHour, setSelectedHour] = useState(null);
  const [typeForecast, setTypeForecast] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  
  //Hours for Graphic
  /*
  const hourlyData = forecast?.list?.slice(0, 8).map((item) => ({
    time: formatLocalHour(item.dt, forecast.city.timezone),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    rain: item.pop ? Math.round(item.pop * 100) : 0,
    tooltipInfo: {
      name: "Temperature",
      value: Math.round(item.main.temp),
      unit: unit === "metric" ? "°C" : "°F",
    },
      
  }))||[];
  console.log("temp", hourlyData);
*/
  function getLocalDate(dt, timezoneOffset) {
  // shift UTC dt by city offset
  const utcMs = dt * 1000;
  const localMs = utcMs + timezoneOffset * 1000;
  return new Date(localMs);
}

function getLocalDateString(dt, timezoneOffset) {
  const localDate = getLocalDate(dt, timezoneOffset);
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

 const groupedByDate = forecast.list.reduce((acc, item) => {
  const key = getLocalDateKey(item.dt, forecast.city.timezone);
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

  const openModal = (item, type) => {
    const dateKey = getLocalDateString(item.dt, forecast.city.timezone); 
    console.log("dateKey", dateKey);
    setSelectedDate(dateKey);
    //setSelectedHour(item);
    setTypeForecast(type);
    document.body.style.overflow = 'hidden'; // prevent scrolling
  };

  const closeModal = () => {
    setSelectedHour(null);
    setSelectedDate(null);
    document.body.style.overflow = 'auto'; // re-enable scrolling
  };


  return (
    <div>
      <div className="hourly-forecast">
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
      <div style={{display:'flex', flexDirection:'row', alignItems: '', gap:'1rem', width:'100%'}}>
        <div className="forecast">
          <h3>Daily Forecast</h3>
          {Object.entries(groupedByDate).map(([dateKey, items]) => {
            const firstItem = items[0]; // or maybe pick midday item for better icon
            return (
              <ForecastDay
                key={dateKey}
                label={dateKey}
                item={firstItem}
                unit={unit}
                onClick={() => openModal(firstItem, 'day')}
              />
            );
          })}
        </div>
        <div style={{width:'100%'}}>
          <WeatherMap
              lat={forecast.city.coord.lat}
              lon={forecast.city.coord.lon}
              city={forecast.city.name}
              temp={Math.round(forecast.list[0].main.temp)}
              unit={unit}
              darkMode={darkMode}
          />
          <SavedCities unit={unit} />
        </div>
      </div>

      {selectedDate && (
        <ForecastModal 
          //item={selectedHour} 
          onClose={closeModal} 
          unit={unit} 
          city={forecast.city} 
          forecastType={typeForecast} 
          //hourlyData={hourlyData}
          groupedByDate={groupedByDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
}

export default Forecast;
