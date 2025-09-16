import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SearchBar({ city, setCity, onSearch, onEnter, API_KEY, setCityLabel }) {
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [tempInput, setTempInput] = useState(""); // for preview
  const wrapperRef = useRef(null);

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
      setSuggestions(data);
      console.log("suggestions", data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  // Handle typing with debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);        // 🔹 always keep input synced
    setTempInput("");      // reset preview
    setHighlightedIndex(-1);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(value);
      }, 400)
    );
  };

  // Handle clicking a suggestion
  const handleSelectSuggestion = (selectedCity) => {
    const label = `${selectedCity.name}, ${selectedCity.country}${
      selectedCity.state ? ` (${selectedCity.state})` : ""
    }`;
    setCity(label);
    setCityLabel(`${selectedCity.name}, ${selectedCity.country}`);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setTempInput("");

    onSearch({
      lat: selectedCity.lat,
      lon: selectedCity.lon,
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const nextIndex = prev < suggestions.length - 1 ? prev + 1 : 0;
        setTempInput(
          `${suggestions[nextIndex].name}, ${suggestions[nextIndex].country}${
            suggestions[nextIndex].state ? ` (${suggestions[nextIndex].state})` : ""
          }`
        );
        return nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const nextIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
        setTempInput(
          `${suggestions[nextIndex].name}, ${suggestions[nextIndex].country}${
            suggestions[nextIndex].state ? ` (${suggestions[nextIndex].state})` : ""
          }`
        );
        return nextIndex;
      });
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectSuggestion(suggestions[highlightedIndex]);

      } else {
        onEnter(e);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setTempInput("");
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        setHighlightedIndex(-1);
        setTempInput("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Clear on focus
  const handleFocus = () => {
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <div
        ref={wrapperRef}
        className="wrapper-input"
        style={{
          position: "relative",
          width: "300px",
          alignItems: "center",
          display: "flex",
        }}
      >
        <input
          type="text"
          placeholder="Enter city"
          value={tempInput || city}   // 🔹 keep full text
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="input-city"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className={`suggestion-item ${highlightedIndex === i ? "highlighted" : ""}`}
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.name}, {s.country} {s.state ? `(${s.state})` : ""}
              </li>
            ))}
          </ul>
        )}
        <button
          className="main-button"
          onClick={async () => {
            if (city?.lat && city?.lon) {
              // already structured from suggestion
              onSearch({ lat: city.lat, lon: city.lon });
            } else if (typeof city === "string" && city.trim()) {
              try {
                const res = await fetch(
                  `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
                );
                const data = await res.json();
                if (data.length > 0) {
                  const match = data[0];
                  const label = `${match.name}, ${match.country}${
                    match.state ? ` (${match.state})` : ""
                  }`;
                  setCity(label);
                  setCityLabel(`${match.name}, ${match.country}`);
                  onSearch({ lat: match.lat, lon: match.lon });
                }
                else {
                  // ❌ No results
                  setCity("");
                  setCityLabel("No data available");
                  setSuggestions([]);
                  onSearch(null);
                }
              } catch (err) {
                console.error("Error resolving city:", err);
              }
            }
          }}

        >
          <FontAwesomeIcon icon="magnifying-glass" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
