import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';
import ReactAnimatedWeather from 'react-animated-weather';
import WeatherIcon from './WeatherIcon';
import {useEffect, useState } from 'react';


function ForecastHour({ item, unit, onClick}) {
  const [isHovered, setIsHovered] = useState(false);


  if (!item) return null;
  return (
              <div key={item.dt} className="hourly-item" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <p>{item.localHour}</p>
                <div className='animated-icon'>
                  <WeatherIcon code={item.weather[0].icon} size={50} isHovered={isHovered}/>
                </div>
                <p>{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
              </div>
  );
}

export default ForecastHour;
