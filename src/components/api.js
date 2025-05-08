const WEATHERSTACK_API_KEY = '3627ee7bc2143e14c813f8c16e625a20';
const MAPBOX_API_KEY = 'pk.eyJ1IjoieG9ya3kiLCJhIjoiY2xpeGszaWcwMDdncDNrdXU5enB0cjRiMiJ9.lJp9Y5-UltfnJIq2Mo9KqQ';

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const url = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${lat},${lon}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    return {
      country: data.location.country,
      temperature: `${Math.round(data.current.temperature)}°C`,
      description: data.current.weather_descriptions[0],
      humidity: `${data.current.humidity}%`,
      windSpeed: `${data.current.wind_speed} m/s`,
      iconUrl: data.current.weather_icons[0],
    };
  } catch (err) {
    throw new Error('Error fetching weather data');
  }
};

export const getCoordinates = async (city) => {
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${city}&access_token=${MAPBOX_API_KEY}`; 
    const response = await fetch(url);
    if (!response.ok) throw new Error('Location fetch failed');
    const results = await response.json();
    if (results.length === 0) throw new Error('City not found');
    const lat = results.features[0].geometry.coordinates[1];
    const lon = results.features[0].geometry.coordinates[0];
    return { lat, lon };
  } catch (err) {
    throw new Error('Error fetching location data');
  }
};

