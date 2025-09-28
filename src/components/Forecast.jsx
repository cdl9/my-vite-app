import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';
import ForecastModal from './ForecastModal';
import HourlyTempChart from './HourlyTempChart';
import { formatLocalDate, formatLocalHour, getLocalDateKey } from './utils/time';
import WeatherMap from './WeatherMap';
import SavedCities from './SavedCities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { format, isToday, parse, parseISO } from 'date-fns';

import {useEffect, useState } from 'react';



function Forecast({ forecast, unit, darkMode,triggerStat, setTriggerStat, cityLabel }) {
  if (!forecast || !forecast.list) return null;

  const hourlyForecast = forecast.list.slice(0, 6).map(item => ({
  ...item,
  localHour: formatLocalHour(item.dt, forecast.city.timezone)
}));
  
  const [selectedHour, setSelectedHour] = useState(null);
  const [typeForecast, setTypeForecast] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (triggerStat) {
      // today’s date
      const todayKey = getLocalDateKey(
        forecast.list[0].dt,
        forecast.city.timezone
      );

      setSelectedDate(todayKey);
      setTypeForecast(triggerStat);

      document.body.style.overflow = "hidden";
      setTriggerStat(null); // reset so it doesn’t reopen infinitely
    }
  }, [triggerStat, forecast, setTriggerStat]);
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

const [page, setPage] = useState(0); // 0 = first 3, 1 = last 3
const itemsPerPage = 3;

const forecastDates = Object.entries(groupedByDate);
const totalPages = Math.ceil(forecastDates.length / itemsPerPage);

const currentItems = forecastDates.slice(
  page * itemsPerPage,
  page * itemsPerPage + itemsPerPage
);


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
        <div className="forecast" >
          
          <div className="flex-row" style={{width:"100%", justifyContent:'space-between'}}>
            <h4><FontAwesomeIcon icon="calendar-days" /> 6-DAY FORECAST</h4>
            <div className="flex-row">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 0))} 
                disabled={page === 0}
                className='square-button'
              >
                <FontAwesomeIcon icon="arrow-left" />
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))} 
                disabled={page === totalPages - 1}
                style={{ marginLeft: "5px" }}
                className='square-button'

              >
                <FontAwesomeIcon icon="arrow-right" />
              </button>
            </div>
          </div>
          {currentItems.map(([dateKey, items]) => {
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
              cityLabel={cityLabel}
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
