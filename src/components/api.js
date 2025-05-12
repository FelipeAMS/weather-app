const WEATHERSTACK_API_KEY = '3627ee7bc2143e14c813f8c16e625a20';
const MAPBOX_API_KEY = 'pk.eyJ1IjoieG9ya3kiLCJhIjoiY2xpeGszaWcwMDdncDNrdXU5enB0cjRiMiJ9.lJp9Y5-UltfnJIq2Mo9KqQ';

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const url = `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${lat},${lon}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.info || 'Error fetching weather data');
    }

    return {
      name: data.location.name,
      country: data.location.country,
      temperature: `${Math.round(data.current.temperature)}°C`,
      description: data.current.weather_descriptions[0],
      humidity: `${data.current.humidity}%`,
      windSpeed: `${data.current.wind_speed} m/s`,
      iconUrl: data.current.weather_icons[0],
    };
  } catch (err) {
    console.error('Weather API Error:', err);
    throw new Error('Error fetching weather data');
  }
};

export const getCoordinates = async (city) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Location fetch failed');
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error('No locations found');
    }

    return data.features;
  } catch (err) {
    console.error('Mapbox API Error:', err);
    throw new Error('Error fetching location data');
  }
};

