import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons'; // Filled bookmark
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef, createRef } from 'react';

import WeatherIcon from './WeatherIcon';

function SavedCities({savedCities, setSavedCities, unit, onSelectCity, triggerToast}) {
  const removeCity = (name) => {
    setSavedCities(savedCities.filter(c => c.name !== name));
  };
  if (!savedCities) return null;

  const nodeRefs = useRef({}); // 👈 stable refs for CSSTransition
  return(
        <div className="background-card saved-cities">
            <h4><FontAwesomeIcon icon="globe" /> WORLD FORECAST</h4>
            
            {savedCities.length === 0 && <p>No saved cities yet.</p>}
            
            <TransitionGroup className="flex-row">
                {savedCities.map((city, idx) =>{
                if (!nodeRefs.current[city.name]) {
                    nodeRefs.current[city.name] = createRef(); // 👈 stable ref for each city
                }
                console.log("icon code", city.icon);
                return (
                    <CSSTransition
                        key={city.name}
                        timeout={300}
                        classNames="city"
                        nodeRef={nodeRefs.current[city.name]} // 👈 pass the stable ref
                    >
                    <div 
                        ref={nodeRefs.current[city.name]}
                        className="small-card saved-city-item flex-column" 
                        onClick={() => onSelectCity(city)}
                    >
                        <div style={{width:'100%',marginRight:'0px', marginTop:'15px'}}>
                            <button style={{alignSelf:"flex-end", justifySelf:"flex-end"}} 
                                className="bookmark-button" 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    removeCity(city.name);
                                    triggerToast(`${city.name} removed from favorites`);
                                }}
                            >
                                <FontAwesomeIcon icon={faSolidBookmark} className="mediumIcon"/>
                                
                            </button>
                        </div>
                        <div className='flex-column'>
                            <p style={{margin:'0px'}}>{city.cityLabel.split(',')[0]}</p>
                            <p style={{margin:'0px'}}>{city.cityLabel.split(',')[1]}</p>
                            <div className="small-animated-icon">
                                <WeatherIcon code={city.icon} size={50} />
                            </div>
                            <p style={{marginTop:'10px'}}>
                                <FontAwesomeIcon icon="temperature-half" />
                                {Math.round(city.temp)}°{unit === 'metric' ? 'C' : 'F'}
                            </p>
                        </div>
                    </div>
                    </CSSTransition>
                );
        })}
            </TransitionGroup>
        </div>
    );
}

export default SavedCities;