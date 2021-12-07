var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var apiKey = '3b73cbd4a1e753832f14fcac6dacbcdf';

// Select DOM elements
var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#floatingInput');
var searchedCity = document.querySelector('#city');
var currentTimezoneWrapper = document.querySelector('#timezone-wrapper')
var currentCityWrapperEL = document.querySelector('#current-weather-wrapper');
var forecastWrapper = document.querySelector('#forecast');
var searchHistoryEl = document.querySelector('#search-item');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// var response = fetch("https://api.openweathermap.org/data/2.5/weather?q=austin&appid=3b73cbd4a1e753832f14fcac6dacbcdf")
// .then(function(response) {
//     response.json().then(function(data) {
//         console.log("inside", data);
//     });
// });

// console.log("outside", response);

var getSearchCoordinates = function(search) {

    var apiURL = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;

    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            if (!data[0]) {
                alert('Location unknown')
            } else {

            }
            displayCurrentWeather(data);
        });
    });
}

var getWeatherData = function(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
        return res.json();
        })
        .then(function (data) {
        destructureData(location, data);
        })
        .catch(function (err) {
        console.error(err);
        });
}

var destructureData = function(location, data) {
    displayCurrentWeather(location, data.current, data.timezone);

}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var location = searchInput.value.trim();

    if (location) {
        getSearchCoordinates(location);
        searchInput.value = '';
    } else {
        alert('Please enter a city name.')
    }
}

var displayCurrentWeather = function(data, city) {
    console.log(city);
    console.log(data);

    var currentCityName = data.name;
    searchedCity.textContent = currentCityName;
    searchHistoryEl.append(currentCityName);
    // searchHistoryEl.textContent = currentCityName;

    localStorage.setItem('city', currentCityName);

    // functions to destructure array
    function temperature({main: {temp: temp}}) {
        return `Temperature: ${temp}°F`
    }

    function humidity({main: {humidity: percent}}) {
        return `Humidity: ${percent}%`
    }

    function windSpeed({wind: {speed: mph}}) {
        return `Wind Speed: ${mph}MPH`
    }

    function timezone({timezone: tz}) {
        var date = dayjs().tz(tz).format('M/D/YYYY')
        return date;
    }

    // assign variables to destructured elements
    var currentCityWeather = temperature(data);
    var currentCityHumidity = humidity(data);
    var currentCityWind = windSpeed(data);
    var currentTimezone = timezone(data);

    console.log(timezone(data));

    var weatherList = document.createElement('ul');
    var weatherListItem = document.createElement('li');


    weatherListItem.append(weatherList);

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    card.append(cardBody);

    cardBody.append(weatherList);
    currentCityWrapperEL.append(card);

    weatherListItem.append(currentCityWeather, currentCityHumidity, currentCityWind)
    currentTimezoneWrapper.textContent = currentTimezone;
    // currentCityWrapperEL.textContent = currentCityWeather;
    // currentCityWrapperEL.textContent = currentCityHumidity;
    // currentCityWrapperEL.textContent = currentCityWind;
}

var searchHistoryButtonHandler = function(event) {
    event.preventDefault();

    searchHistoryEl.innerHTML = search;
    getCurrentWeather(search);
}

searchForm.addEventListener("submit", formSubmitHandler);

searchHistoryEl.addEventListener("click", getCurrentWeather);