import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { useState } from 'react';

/*
<div className='animated-icon'>
  <WeatherIcon code={item.weather[0].icon} size={30} />
</div>
*/

function ForecastDay({ label,item, unit, onClick }) {
  if (!item) return null;
  
  const [isHovered, setIsHovered] = useState(false);
  
  return (
              <div key={item.dt} className="forecast-item" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                  {/*<p>{item.weather[0].main}</p>*/}
                  
                  <div  style={{margin:"12px 15px", display:"flex", alignItems:"center"}}>
                  <WeatherIcon code={item.weather[0].icon} size={35} isHovered={isHovered}/>
                  </div>
                  <p><FontAwesomeIcon icon="temperature-half" /> {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p className="date-forecast"> {format(parseISO(label), "d MMM, EEE")}</p>

                  {/*<p><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>
                  <p><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>
*/}
              </div>
  );
}

export default ForecastDay;
