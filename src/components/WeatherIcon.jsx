import ReactAnimatedWeather from "react-animated-weather";
import iconMap from "./iconMap";

function WeatherIcon({ code, size}) {
  const icon = iconMap[code] || "CLOUDY"; // fallback
  return (
    <ReactAnimatedWeather
      icon={icon}
      color="goldenrod"
      size={size}
      animate={true}
    />
  );
}

export default WeatherIcon;
