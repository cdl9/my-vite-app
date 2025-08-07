import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';


function ForecastModal({ item, onClose, unit, city, forecastType }) {

  const rainChance = Math.round(item.pop * 100) + '%';
  const formattedDate = forecastType === 'day'
    ? format(parseISO(item.dt_txt), 'EEEE, MMMM d') // Day view
    : format(parseISO(item.dt_txt), 'h a, MMM d');  // Hour view

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-forecast" onClick={(e) => e.stopPropagation()}>
        <h2>{city.name}, {city.country}</h2>
        <h3 className=''>{formattedDate}</h3>
            <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                  className='hourly-weather-icon'

            />
            <p>{item.weather[0].main}</p>

            <p className='modal-details'><FontAwesomeIcon icon="temperature-half" /> Temp: {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
            <p className='modal-details'><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>
            <p className='modal-details'><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>
            <p className='modal-details'><FontAwesomeIcon icon="cloud-rain" /> Rain: {rainChance}</p>

      </div>
    </div>
  );
}

export default ForecastModal;