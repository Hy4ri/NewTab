document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather');
    const weatherButton = document.createElement('button');
    weatherButton.textContent = 'Change Location';
    weatherButton.style.cursor = 'pointer';
    weatherButton.style.marginLeft = '10px';
    weatherButton.style.padding = '5px';
    weatherButton.style.backgroundColor = 'var(--tcolor3)';
    weatherButton.style.color = 'black';
    weatherButton.style.border = '1px solid black';
    weatherButton.style.borderRadius = '3px';
    weatherButton.style.display = 'none'; // Hidden by default

    // Append the button to the weather container
    weatherContainer.appendChild(weatherButton);

    // Show the button only when hovering over the weather section
    weatherContainer.addEventListener('mouseenter', () => {
        weatherButton.style.display = 'inline-block';
    });

    weatherContainer.addEventListener('mouseleave', () => {
        weatherButton.style.display = 'none';
    });

    // Load and display weather
    chrome.storage.sync.get('weatherLocation', (data) => {
        const location = data.weatherLocation || { latitude: 32.0026, longitude: 35.7336, name: 'As-Salt' }; // Default: As-Salt
        fetchWeather(location.latitude, location.longitude, location.name);
    });

    // Change weather location
    weatherButton.addEventListener('click', () => {
        let latitude = null;
        let longitude = null;
        let name = null;

        // Prompt for latitude until a valid number is provided, or user cancels
        while (latitude === null) {
            const latInput = prompt("Enter the latitude of the city (e.g., 32.0026):");
            if (latInput === null) {
                return; // User canceled the prompt
            }
            if (latInput && !isNaN(parseFloat(latInput))) {
                latitude = parseFloat(latInput);
            } else {
                alert("Latitude is required and must be a valid number. Please try again.");
            }
        }

        // Prompt for longitude until a valid number is provided, or user cancels
        while (longitude === null) {
            const lonInput = prompt("Enter the longitude of the city (e.g., 35.7336):");
            if (lonInput === null) {
                return; // User canceled the prompt
            }
            if (lonInput && !isNaN(parseFloat(lonInput))) {
                longitude = parseFloat(lonInput);
            } else {
                alert("Longitude is required and must be a valid number. Please try again.");
            }
        }

        // Prompt for name (city name or label), or allow user to cancel
        while (name === null) {
            name = prompt("Enter a name for this location (e.g., City name):");
            if (name === null) {
                return; // User canceled the prompt
            }
            if (!name) {
                alert("Name is required. Please try again.");
            }
        }

        // Save to storage and update weather only if all inputs are valid and not canceled
        chrome.storage.sync.set({ weatherLocation: { latitude, longitude, name } }, () => {
            fetchWeather(latitude, longitude, name);
        });
    });

    // Fetch and display weather data
    function fetchWeather(latitude, longitude, name) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperature = data.current_weather.temperature;
                weatherContainer.innerHTML = `${name}: ${temperature}°C`;
                weatherContainer.appendChild(weatherButton); // Re-add the button
            })
            .catch(error => {
                console.error('Error:', error);
                weatherContainer.innerHTML = `Failed to load weather data for ${name}.`;
                weatherContainer.appendChild(weatherButton); // Re-add the button
            });
    }
});
