import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import HourlyTempChart from './HourlyTempChart';
import { useEffect, useState, useRef } from 'react';
import { addSeconds } from 'date-fns';

import { formatLocalHour, formatLocalDate } from './utils/time';

const chartOptions = [ { value: "temp", label: <div><FontAwesomeIcon icon="temperature-half" />Temp</div>}, { value: "humidity", label: <div><FontAwesomeIcon icon="droplet" />Humidity</div>}, { value: "wind", label: <div><FontAwesomeIcon icon="wind" />Wind</div>}, { value: "rain", label: <div><FontAwesomeIcon icon="cloud-rain" />Rain</div> } ];

/*
const chartOptions = [
  { value: "temp", label: <div><FontAwesomeIcon icon="temperature-half" />Temp</div>},
  { value: "humidity", label: <div><FontAwesomeIcon icon="droplet" />Humidity</div>},
  { value: "wind", label: <div><FontAwesomeIcon icon="wind" />Wind</div>},
  { value: "rain", label: <div><FontAwesomeIcon icon="cloud-rain" />Rain</div> }
];*/

/*
function getLocalDate(dt, timezoneOffset) {
  // shift UTC dt by city offset
  const localSeconds = dt + timezoneOffset;
  return new Date(localSeconds * 1000);
}*/

function ForecastModal({ onClose, unit, city, forecastType, groupedByDate, selectedDate, setSelectedDate }) {

  const [selectedChart, setSelectedChart] = useState("temp");
  const dates = Object.keys(groupedByDate);
  console.log("dates", dates);
  console.log("selectedDate", selectedDate);
  const dayData = groupedByDate[selectedDate] || [];
  console.log("dayData", dayData);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (dayData.length === 0) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-forecast" onClick={(e) => e.stopPropagation()}>
        <h2>{city.name}, {city.country}</h2>
        <p>No forecast data available for this date.</p>
      </div>
    </div>
  );
}
  
  const hourlyData = dayData.map((item) => ({
    time: formatLocalHour(item.dt, city.timezone),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    rain: item.pop ? Math.round(item.pop * 100) : 0,
}));

const formattedDate = dayData.length > 0 ? formatLocalDate(dayData[0].dt, city.timezone) : '';

//    const formattedDate = formatLocalDate(dayData[0].dt, city.timezone);
  console.log("hourlyData", hourlyData);
/*
  console.log("dayData", dayData);
  console.log("utcdate", utcDate);
  console.log("localdate", localDate);
  console.log("formattedDate", formattedDate); 

*/
  //console.log("hourlyDataModal", hourlyData);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={(e) => {
      // Close modal only if clicking directly on overlay
      if (e.target.classList.contains("modal-overlay")) {
        onClose();
      }
    }}>
      <div className="modal-forecast" onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{city.name}, {city.country}</h2>
          {/* Date selector */}
        <div className="date-selector">
          {dates.map((date) => {
          return(
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <div style={{fontSize:'12px',marginBottom:'5px'}}>{days[(new Date(date)).getDay()]}</div>

              <button
                key={date}
                className={date === selectedDate ? "active date-tab" : "date-tab"}
                onClick={() => setSelectedDate(date)}
              >
                {format(parseISO(date), "d")}
              </button>
            </div>
          )}
          )}
        </div>
        {<h3 className='' style={{fontWeight:'normal'}}>{format(parseISO(selectedDate), "EEEE, MMMM d")}</h3>}

        </div>

        
        {/* Dropdown selector */}
      <div style={{display:'flex', width:'100%',  flexDirection:'row', alignContent:'center', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'0rem'}}>
        <img
                src={`https://openweathermap.org/img/wn/${dayData[0].weather[0].icon}@2x.png`}
                alt="Weather icon"
                className='hourly-weather-icon'

          />
        {selectedChart === "temp" && <p className='modal-details'>{Math.round(hourlyData[0].temp)}°{unit === 'metric' ? 'C' : 'F'}</p>}
        </div>
        <div className="custom-dropdown" ref={dropdownRef}>
          
          <button
            onClick={() => setOpen(!open)}
            className="dropdown-button"
            type="button"
          >
            {chartOptions.find(opt => opt.value === selectedChart)?.label}
            <span className="arrow">▼</span>
          </button>

          {open && (
            <ul className="dropdown-menu">
              {chartOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    setSelectedChart(opt.value);
                    setOpen(false);
                  }}
                  className={selectedChart === opt.value ? "active" : ""}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>



{/*
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
        */}
{/*}        
        {format(parseISO(date), "EEE, MMM d")}
         
        <p>{dayData[0].weather[0].main}</p>
        
        {selectedChart === "temp" && <p className='modal-details'><FontAwesomeIcon icon="temperature-half" /> Temp: {Math.round(hourlyData[0].temp)}°{unit === 'metric' ? 'C' : 'F'}</p>}
         
        {selectedChart === "temp" && <p className='modal-details'><FontAwesomeIcon icon="temperature-half" /> Temp: {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>}
        {selectedChart === "humidity" && <p className='modal-details'><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>}
        {selectedChart === "wind" && <p className='modal-details'><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>}
        {selectedChart === "rain" && <p className='modal-details'><FontAwesomeIcon icon="cloud-rain" /> Rain: {rainChance}</p>}

*/}

        <HourlyTempChart hourlyData={hourlyData} selectedChart={selectedChart} unit={unit} />

      </div>
    </div>
  );
}

export default ForecastModal;