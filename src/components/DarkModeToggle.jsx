import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function DarkModeToggle({ darkMode, setDarkMode }) {
    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    }

  return (
    <div className="toggle-wrapper">
        <label className="toggle-label">
            <FontAwesomeIcon icon="sun" />
            <input type="checkbox" 
                   id="theme-toggle" 
                   onChange={toggleDarkMode}
            />
            <span className="slider"></span>
            <FontAwesomeIcon icon="moon" />
            
        </label>
      </div>
  );
}

export default DarkModeToggle;

