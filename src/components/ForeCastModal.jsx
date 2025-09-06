import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import HourlyTempChart from './HourlyTempChart';
import { useEffect, useState } from 'react';


const chartOptions = [
  { value: "temp", label: <div><FontAwesomeIcon icon="temperature-half" />Temp</div>},
  { value: "humidity", label: <div><FontAwesomeIcon icon="droplet" />Humidity</div>},
  { value: "wind", label: <div><FontAwesomeIcon icon="wind" />Wind</div>},
  { value: "rain", label: <div><FontAwesomeIcon icon="cloud-rain" />Rain</div> }
];

function ForecastModal({ item, onClose, unit, city, forecastType, hourlyData }) {

  const [selectedChart, setSelectedChart] = useState("temp");
  
  const rainChance = Math.round(item.pop * 100) + '%';
  const formattedDate = forecastType === 'day'
    ? format(parseISO(item.dt_txt), 'EEEE, MMMM d') // Day view
    : format(parseISO(item.dt_txt), 'h a, MMM d');  // Hour view

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-forecast" onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
        <h2>{city.name}, {city.country}</h2>
        <h3 className=''>{formattedDate}</h3>
        <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className='hourly-weather-icon'

        />
        <p>{item.weather[0].main}</p>
        </div>
        
        <div className="chart-toggle">
          {chartOptions.map((opt) => (
            <button
              key={opt.value}
              className={`toggle-btn ${selectedChart === opt.value ? "active" : ""}`}
              onClick={() => setSelectedChart(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        {selectedChart === "temp" && <p className='modal-details'><FontAwesomeIcon icon="temperature-half" /> Temp: {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>}
        {selectedChart === "humidity" && <p className='modal-details'><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>}
        {selectedChart === "wind" && <p className='modal-details'><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>}
        {selectedChart === "rain" && <p className='modal-details'><FontAwesomeIcon icon="cloud-rain" /> Rain: {rainChance}</p>}



        <HourlyTempChart hourlyData={hourlyData } selectedChart={selectedChart} unit={unit} />

      </div>
    </div>
  );
}

export default ForecastModal;