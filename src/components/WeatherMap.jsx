import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

function WeatherMap({ lat, lon, city, temp, unit, darkMode }) {
  if (!lat || !lon) return null;

  let color = "#4A90E2"; // default (blue)
  let url_link="";

  console.log("unit", unit);
  if ((unit=="metric"&&temp >= 35)||(unit=="imperial"&&temp >= 95)) {
    color = "#F44336"; // red
  } else if ((unit=="metric"&&temp >= 25)||(unit=="imperial"&&temp >= 77)) {
    color = "#FF9800"; // orange
  } else if ((unit=="metric"&&temp >= 10)||(unit=="imperial"&&temp >= 50)) {
    color = "#FFD700"; // green
  }

  const tempIcon = L.divIcon({
    className: "custom-temp-icon",
    html: `<div class="temp-marker" style="background:${color};">${temp}°${unit === "metric" ? "C" : "F"}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20], // centers the icon
  });

  function RecenterMap({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lon], 12, { animate: true });
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
      zoom={12}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url={url_link}
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains={['a', 'b', 'c']}
        maxZoom={20}
      />
      <Marker position={[lat, lon]} icon={tempIcon}>
        <Popup>
          <strong>{city}</strong><br />
          {temp}°{unit === "metric" ? "C" : "F"}
        </Popup>
      </Marker>
      <RecenterMap lat={lat} lon={lon} />
    </MapContainer>
  );
}

export default WeatherMap;
