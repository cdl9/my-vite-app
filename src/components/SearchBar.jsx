const SearchBar = ({ city,setCity, onSearch, onEnter}) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={onEnter}
            />
            <button onClick={onSearch}>Get Weather</button>
        </div>
    );
};

export default SearchBar;