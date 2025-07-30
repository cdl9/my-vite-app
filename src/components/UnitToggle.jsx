import React from 'react';

function UnitToggle({ unit, setUnit }) {
  const toggleDegrees = () => {
      setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    }

  return (
    <div className="unit-toggle">   
      <div className="toggle-wrapper">
              <label className="toggle-label">
                  <p className="unit-label">°C</p>
                  <input type="checkbox" 
                         id="theme-toggle" 
                         onChange={toggleDegrees}
                         checked={unit === 'imperial'}
                  />
                  <span className="slider"></span>
                  <p className="unit-label">°F</p>         
              </label>
      </div>
    </div>
  );
}

export default UnitToggle;