window.addEventListener("load", async (e) => {
    e.stopPropagation();
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        const url = `https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'ff5c26ec3bmsh9a4eb79adb77d32p1ccc34jsn7611fa445f49',
		    'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
          }
        };
  
        try {
          const response = await fetch(url, options);
          const result = await response.json();
          updateWeatherUI(result, "K");
          convertUnixTimestamps(result);
          console.log(result)
        } catch (error) {
          console.error(error);
        }
      });
    }

    // write javascript for adding greeting message & show time
    let greeting = document.getElementById("greeting");
  
    
    let time = document.getElementById("time");
  
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
  
    if(hours < 12){
      greeting.innerHTML = "Good Morning";
    }
    else if(hours < 17)
    {
      greeting.innerHTML = "Good Afternoon";
    }
    else {
      greeting.innerHTML = "Good Evening";
    }
  
    time.innerHTML = `${hours}:${minutes} P.M`;
  
  
  
  
  });
  
  function convertTemperature(temperature, unit) {
    if (unit === "K") {
      return convertKelvinToCelsius(temperature);
    } else if (unit === "F") {
      return convertFahrenheitToCelsius(temperature);
    } else {
      throw new Error("Invalid temperature unit");
    }
  }
  
  function convertKelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }
  
  function convertFahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  
  function updateWeatherUI(data, unit) {
    const temperature = document.getElementById('temperature');
    const tempCelsius = convertTemperature(data.main.temp, unit);
    temperature.innerHTML = `${tempCelsius.toFixed(2)}°C`;
  
    // update other elements similarly, using convertTemperature for each value based on its unit
    const feelsLike = document.getElementById("feelsLikeTemperature");
    feelsLike.innerHTML = `Feels Like: ${convertTemperature(data.main.feels_like, unit).toFixed(2)}°C`;
  
    // min temperature
    const minTemperature = document.getElementById("minimum");
    const minTempCelsius = convertTemperature(data.main.temp_min, unit).toFixed(2);
    minTemperature.innerHTML = `${minTempCelsius}°C`;
  
    // max temperature
    const maxTemperature = document.getElementById("maximum");
    const maxTempCelsius = convertTemperature(data.main.temp_max, unit).toFixed(2);
    maxTemperature.innerHTML = `${maxTempCelsius}°C`;
  
    // pressure
    const atmosphericPressure = document.getElementById("pressure");
    atmosphericPressure.innerHTML = `${data.main.pressure} hPa`;
  
    // visibility
    const visibility = document.getElementById("visibility");
    visibility.innerHTML = `${data.visibility} meters`;
  
    // wind speed
    const windSpeed = document.getElementById("windSpeed");
    windSpeed.innerHTML = `${data.wind.speed} m/s`;
  
    // humidity
    const humidity = document.getElementById("humidity");
    humidity.innerHTML = `${data.main.humidity}%`;
  
    // sunrise
    const sunriseElement = document.getElementById("sunrise");
    const sunriseTimestamp = data.sys.sunrise;
    const sunriseDate = new Date(sunriseTimestamp * 1000);
    const sunriseTime = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunriseElement.innerHTML = `Sunrise: ${sunriseTime}`;

    // sunset
    const sunsetElement = document.getElementById("sunset");
    const sunsetTimestamp = data.sys.sunset;
    const sunsetDate = new Date(sunsetTimestamp * 1000);
    const sunsetTime = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunsetElement.innerHTML = `Sunset: ${sunsetTime}`;
  }
  
  const btn = document.getElementById("searchBtn");
  let isLoading = false;
  btn.addEventListener("click", async () => {
    const cityName = document.getElementsByName("cityName")[0].value;
    const url = `https://open-weather13.p.rapidapi.com/city/${cityName}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'ff5c26ec3bmsh9a4eb79adb77d32p1ccc34jsn7611fa445f49',
		'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
      }
    };
    try {
      isLoading = true;
      isLoading ? btn.innerHTML = "Loading..." : btn.innerHTML = "Search";
      const response = await fetch(url, options);
      const result = await response.json();
      updateWeatherUI(result, "F");
      console.log(result);
    } catch (error) {
      isLoading = false;
      console.error(error);
    } finally {
      isLoading = false;
      isLoading ? btn.innerHTML = "Loading..." : btn.innerHTML = "Search";
    }

    
  });