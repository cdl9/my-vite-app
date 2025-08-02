import { useState, useEffect, useRef } from "react";

function SearchBar({ city, setCity, onSearch, onEnter, API_KEY }) {
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const wrapperRef = useRef(null); // 👈 ref for detecting outside click

  // Fetch city suggestions
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();
      console.log("City suggestions:", data);
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  // Handle typing with debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(value);
      }, 400) // 0.4s debounce
    );
  };

  // Handle clicking a suggestion
  const handleSelectSuggestion = (selectedCity) => {
    setCity(`${selectedCity.name}, ${selectedCity.country} ${selectedCity.state ? `(${selectedCity.state})` : ""}`);
    setSuggestions([]);
    onSearch({
        lat: selectedCity.lat,
        lon: selectedCity.lon
    }); // Trigger weather fetch
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        console.log("click");

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        console.log("Suggestions clear");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
        console.log("remove listener");

    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSuggestions([]);
      onEnter(e);
    }
  };






    return (
        <div className="search-bar">
            <div  ref={wrapperRef} style={{ position: 'relative',width: '200px'}}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="input-city"
                />
                {suggestions.length > 0 && (
                <ul className="suggestions-list">
                {suggestions.map((s, i) => (
                    <li
                    key={i}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(s)}
                    >
                    {s.name}, {s.country} {s.state ? `(${s.state})` : ""}
                    </li>
                ))}
                </ul>
            )}

            </div>
            <button style={{position:"relative", margin:"0 2rem"}} className="main-button" onClick={onSearch}>Get Weather</button>
            
    </div>


    );
};

export default SearchBar;