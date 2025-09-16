import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';


function ForecastHour({ item, unit, onClick}) {
  if (!item) return null;
  return (
              <div key={item.dt} className="hourly-item" onClick={onClick}>
                <p>{item.localHour}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                  className='hourly-weather-icon'

                />
                <p>{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
              </div>
  );
}

export default ForecastHour;
