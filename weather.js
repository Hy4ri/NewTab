document.addEventListener('DOMContentLoaded', () => {
  const city = 'As-Salt';
  const latitude = 32.0026; // Latitude for As-Salt
  const longitude = 35.7336; // Longitude for As-Salt
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const temperature = data.current_weather.temperature;
      document.getElementById('weather').innerHTML = `${city}: ${temperature}°C`;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('weather').innerHTML = 'Failed to load weather data.';
    });
});