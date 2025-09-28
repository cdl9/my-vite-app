import ReactAnimatedWeather from "react-animated-weather";
import iconMap from "./iconMap";

function WeatherIcon({ code, size, isHovered }) {
  const icon = iconMap[code] || "CLOUDY"; // fallback
  return (
    <ReactAnimatedWeather
      icon={icon}
      color={isHovered ? "white": "goldenrod"}
      size={size}
      animate={true}
    />
  );
}

export default WeatherIcon;
