import React from 'react';

function UnitToggle({ unit, setUnit }) {
  const toggleDegrees = () => {
      setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    }

  return (
    <div className="unit-toggle">   
      <div className="toggle-wrapper">
              <label className="toggle-label">
                  <span className="unit-label"  >°C</span>
                  <input type="checkbox" 
                         id="theme-toggle" 
                         onChange={toggleDegrees}
                         checked={unit === 'imperial'}
                  />
                  <span className="slider"></span>
                  <span className="unit-label">°F</span>         
              </label>
      </div>
    </div>
  );
}

export default UnitToggle;