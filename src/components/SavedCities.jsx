import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function SavedCities({unit}) {
    return(
        <div className="background-card saved-cities">
            SavedCities
            <div className="small-card saved-city-item">
                <p style={{margin:'0px'}}>City</p>
                <p style={{margin:'0px'}}>Country</p>
                <p style={{marginTop:'1px'}}><FontAwesomeIcon icon="temperature-half" />53°{unit === 'metric' ? 'C' : 'F'}</p>
            </div>
        </div>
    );
}

export default SavedCities;