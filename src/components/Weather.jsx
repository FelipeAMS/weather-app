import { useState } from 'react';
import { getWeatherByCoords, getCoordinates } from './api';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { lat, lon } = await getCoordinates(location);
      const weather = await getWeatherByCoords(lat, lon);
      setWeatherData({ location, ...weather });
      changeFavicon(weather.iconUrl);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
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
      <p>The app where you can search for whatever weather forecast!</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="search" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <button 
        onClick={getCurrentLocation} 
        disabled={loading}
        className="current-location-btn"
      >
        Get Current Location Weather
      </button>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location}</h2>
          <h3>{weatherData.country}</h3>
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