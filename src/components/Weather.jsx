import { useState, useEffect } from 'react';
import { getWeatherByCoords, getCoordinates } from './api';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    setError('');
    
    if (value.length > 2) {
      try {
        const results = await getCoordinates(value);
        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (suggestion && suggestion.geometry && suggestion.geometry.coordinates) {
      setLocation(suggestion.place_name);
      setSuggestions([]);
      const [lon, lat] = suggestion.geometry.coordinates;
      setLoading(true);
      try {
        const weather = await getWeatherByCoords(lat, lon);
        setWeatherData({ location: suggestion.place_name, ...weather });
        changeFavicon(weather.iconUrl);
        changeWindowTitle(`${weather.name}, ${weather.country} - Weather App`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weather = await getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            setWeatherData({ location: 'Current Location', ...weather });
            changeFavicon(weather.iconUrl);
            changeWindowTitle(weather.location);
            console.log(weather);
          } catch (err) {
            setError('Error getting weather for your location');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Error getting your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const changeWindowTitle = (title) => {
    document.title = title;
  };

  const changeFavicon = (iconUrl) => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = iconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  return (
    <main>
      <h1>Weather</h1>
      <p className="description">The app where you can search for whatever weather forecast!</p>
      <div className="search-container">
        <input 
          id="search-input"
          type="search" 
          value={location}
          onChange={handleInputChange}
          placeholder="Enter location"
          disabled={loading}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id} 
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button 
        onClick={getCurrentLocation} 
        disabled={loading}
        className="current-location-btn"
      >
        Get Current Location Weather
      </button>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {weatherData && weatherData.location && weatherData.iconUrl && (
        <div className="weather-info">
          <h2>{weatherData.location}</h2>
          <h3>{weatherData.name}, {weatherData.country}</h3>
          <img src={weatherData.iconUrl} alt={weatherData.description} style={{width: '100px', height: '100px', borderRadius: '30%'}} />
          <p className="temperature">{weatherData.temperature}</p>
          <p className="description">{weatherData.description}</p>
          <div className="details">
            <p>Humidity: {weatherData.humidity}</p>
            <p>Wind Speed: {weatherData.windSpeed}</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Weather; 