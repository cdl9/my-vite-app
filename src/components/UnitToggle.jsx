import React from 'react';

function UnitToggle({ unit, setUnit }) {
  return (
    <div className="unit-toggle">
      <button
        className={`toggle-button ${unit === 'metric' ? 'selected' : ''}`}
        onClick={() => setUnit('metric')}
        disabled={unit === 'metric'}
      >
        °C
      </button>
      <button
        className={`toggle-button ${unit === 'imperial' ? 'selected' : ''}`}
        onClick={() => setUnit('imperial')}
        disabled={unit === 'imperial'}
        style={{ marginLeft: '0.5rem' }}
      >
        °F
      </button>
    </div>
  );
}

export default UnitToggle;