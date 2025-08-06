import { useState, useEffect, useRef } from "react";

function SearchBar({ city, setCity, onSearch, onEnter, API_KEY }) {
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [tempInput, setTempInput] = useState(""); // for preview
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
    setTempInput("");
    setHighlightedIndex(-1);

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
    setHighlightedIndex(-1);
    setTempInput("");
    onSearch({
        lat: selectedCity.lat,
        lon: selectedCity.lon
    }); // Trigger weather fetch
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const nextIndex =
          prev < suggestions.length - 1 ? prev + 1 : 0;
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
            const nextIndex =
            prev > 0 ? prev - 1 : suggestions.length - 1;
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        setHighlightedIndex(-1);
        setTempInput("");
        console.log("Suggestions clear");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
        console.log("remove listener");

    };
  }, []);
/*
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSuggestions([]);
      onEnter(e);
    }
  };

*/
    const handleFocus = () => {
        setCity("");        // clear the text
        setSuggestions([]); // clear old suggestions
    };
    


    return (
        <div className="search-bar">
            <div  ref={wrapperRef} style={{ position: 'relative',width: '200px'}}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={tempInput || city}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onMouseDown={(e) => {
                        if (city) {
                            setCity("");
                        }
                        }}
                    className="input-city"
                />
                {suggestions.length > 0 && (
                <ul className="suggestions-list">
                {suggestions.map((s, i) => (
                    <li
                    key={i}
                    className={`suggestion-item ${
                  highlightedIndex === i ? "highlighted" : ""
                }`}
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