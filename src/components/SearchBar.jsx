const SearchBar = ({ city,setCity, onSearch, onEnter}) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-city"
                onKeyPress={onEnter}
            />
            <button className="main-button" onClick={onSearch}>Get Weather</button>
        </div>
    );
};

export default SearchBar;