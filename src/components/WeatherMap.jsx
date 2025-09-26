import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Background from 'three/src/renderers/common/Background.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const { BaseLayer, Overlay } = LayersControl;
const API_KEY = '5739b15cf015b1daa9e4085470048ca8';
const CLOUDS_URL = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`;

function WeatherMap({ lat, lon, city, temp, unit, darkMode, cityLabel }) {
  if (!lat || !lon) return null;

  let color = "#4A90E2"; // default (blue)
  let url_link="";

  if ((unit=="metric"&&temp >= 35)||(unit=="imperial"&&temp >= 95)) {
    color = "#F44336"; // red
  } else if ((unit=="metric"&&temp >= 25)||(unit=="imperial"&&temp >= 77)) {
    color = "#FF9800"; // orange
  } else if ((unit=="metric"&&temp >= 10)||(unit=="imperial"&&temp >= 50)) {
    color = "#FFD700"; // green
  }

  /*
    html: `<div classname="background-card" style="background:${"gray"}; border-radius:8px; widht:"100%"; padding:4px; color:white; text-align:center; font-size:0.8rem;">
            ${cityLabel}
            <div class="temp-marker" style="background:${color};">
              ${temp}°${unit === "metric" ? "C" : "F"}
            </div>
          </div>`,*/
  const tempIcon = L.divIcon({
    className: "custom-temp-icon",
    html: `<div class="temp-marker" style="background:${color};">
              ${temp}°${unit === "metric" ? "C" : "F"}
            </div>`,
    iconSize: [110, 40],
    iconAnchor: [20, 20], // centers the icon
  });

  function RecenterMap({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lon], 6, { animate: true });
    }, [lat, lon, map]);
    return null;
  }

  if(darkMode){
    url_link="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }else{
    url_link="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  }

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={6}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={false}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="Base Map">
      <TileLayer
        url={url_link}
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains={['a', 'b', 'c']}
        maxZoom={20}
      />
      
      {/* Weather overlay */}
      </BaseLayer>

      <Overlay checked name="Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        </Overlay>

        <Overlay name="Precipitation">
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        </Overlay>

        <Overlay name="Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        </Overlay>

        <Overlay name="Wind">
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        </Overlay>
      </LayersControl>
      <Marker position={[lat, lon]} icon={tempIcon}>
        <Tooltip  permanent direction="right" offset={[10, -20]} className="city-tooltip">
          <div  style={{ textAlign: "center", display:"flex", flexDirection:"row", alignItems:"center", gap:"0.25rem"}}>
            <FontAwesomeIcon icon="location-dot"/><h4 style={{ margin: "0" }}>{cityLabel}</h4>
          </div>
        </Tooltip>
        {/*<Popup  open={true} closeButton={false}>
          <strong>{cityLabel}</strong><br />
          {temp}°{unit === "metric" ? "C" : "F"}
        </Popup>*/}
      </Marker>
      <RecenterMap lat={lat} lon={lon} />

    </MapContainer>
  );
}

export default WeatherMap;
