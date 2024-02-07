$(document).ready(function() {
  // Insert your API key here
  var apiKey = '20aae1609a9e7755e20296e813671ca0';

  $('#city-form').submit(function(event) {
    event.preventDefault(); // Prevent the default form submission

    var city = $('#city').val(); // Get the city from the input field
    // URL for the current weather from OpenWeatherMap, with Fahrenheit units
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: weatherUrl,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        displayForecast(lat, lon); // Call to display the forecast
        console.log('current: ', data);
      },
      error: function() {
        $('#weather-info').html('<p>Weather data could not be retrieved. Please try again.</p>');
      }
    });
  });

  function displayForecast(lat, lon) {
    // URL for the 5-day forecast from OpenWeatherMap, with Fahrenheit units
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    $('#weather-info').empty(); // Clear previous data

    $.ajax({
      url: weatherUrl,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('fiveday: ', data);
        // The API returns data in 3-hour intervals; we'll just take the first interval of each day as the day's forecast
        for (let i = 0; i < data.list.length; i += 8) { // Skipping every 8 to get approximately midday of each day
          var day = data.list[i];
          var date = new Date(day.dt * 1000).toDateString(); // Convert timestamp to readable date
          var weatherHtml = `
            <div class="weather-day card mx-2 my-2" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">${date}</h5>
                <p class="card-text">Temperature: ${day.main.temp}°F</p>
                <p class="card-text">Weather: ${day.weather[0].main}, ${day.weather[0].description}</p>
              </div>
            </div>
          `;
          $('#weather-info').append(weatherHtml); // Append the HTML to the weather-info div
        }
      },
      error: function() {
        $('#weather-info').html('<p>Weather data could not be retrieved. Please try again.</p>');
      }
    });
  }
});
