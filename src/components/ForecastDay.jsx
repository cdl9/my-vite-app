import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';


function ForecastDay({ label,item, unit, onClick }) {
  if (!item) return null;

  return (
              <div key={item.dt} className="forecast-item" onClick={onClick}>
                  {/*<p>{item.weather[0].main}</p>*/}
                  <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="Weather icon"
                      className='forecast-day-icon'
                  />
                  <p><FontAwesomeIcon icon="temperature-half" /> {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p className="date-forecast"> {format(parseISO(label), "d MMM, EEE")}</p>

                  {/*<p><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>
                  <p><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>
*/}
              </div>
  );
}

export default ForecastDay;
