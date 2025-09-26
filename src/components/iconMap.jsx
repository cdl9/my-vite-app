const iconMap = {
  "01d": "CLEAR_DAY",          // clear sky (day)
  "01n": "CLEAR_NIGHT",        // clear sky (night)
  "02d": "PARTLY_CLOUDY_DAY",  // few clouds (day)
  "02n": "PARTLY_CLOUDY_NIGHT",// few clouds (night)
  "03d": "CLOUDY",             // scattered clouds
  "03n": "CLOUDY",
  "04d": "CLOUDY",             // broken clouds
  "04n": "CLOUDY",
  "09d": "RAIN",               // shower rain
  "09n": "RAIN",
  "10d": "RAIN",               // rain
  "10n": "RAIN",
  "11d": "SLEET",              // thunderstorm → no thunder icon, so sleet is closest
  "11n": "SLEET",
  "13d": "SNOW",               // snow
  "13n": "SNOW",
  "50d": "FOG",                // mist/fog
  "50n": "FOG",
};
export default iconMap;