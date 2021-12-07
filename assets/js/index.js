var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var apiKey = '3b73cbd4a1e753832f14fcac6dacbcdf';

// Select DOM elements
var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#floatingInput');
var iconWrapper = document.querySelector('#icon');
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

var getSearchCoordinates = function(search) {

    var apiURL = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=3&appid=${apiKey}`;

    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            if (!data[0]) {
                alert('Location unknown')
            } else {
                getWeatherData(data[0]);
                addToSearchHistory(search);
            }
            })
            .catch(function(err) {
                console.error(err);
        });
    });
}

var liveSearchHistoryList = function() {
    var storedHistoryList = localStorage.getItem('city');
    if (storedHistoryList) {
        searchHistory = JSON.parse(storedHistoryList);
    }
    displaySearchHistory();
}

// console.log("outside", response);
var displaySearchHistory = function() {
    searchHistoryEl.innerHTML = '';

    for(var i = searchHistory.length -1; i>= 0; i--) {
        var historyItem = document.createElement('button');
        historyItem.setAttribute('class', 'list-group-item list-group-item-action');
        historyItem.setAttribute('id', 'search-term');

        historyItem.setAttribute('searchItemActive', searchHistory[i]);
        historyItem.textContent = searchHistory[i];
        searchHistoryEl.append(historyItem)

    }
}

var addToSearchHistory = function(search) {

    searchHistory.push(search);
    localStorage.setItem('city', JSON.stringify(searchHistory));
    displaySearchHistory();
}

var getWeatherData = function(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    searchedCity.textContent = city;

    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
        return res.json();
        })
        .then(function (data) {
        displayCurrentWeather(data);
        // displayForecast(data);
        })
        .catch(function (err) {
        console.error(err);
        });
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

var displayCurrentWeather = function(data) {
    console.log(city);
    console.log(data);

// functions to destructure array
    function temperature({current: {temp: temp}}) {
        return `Temperature: ${temp}°F`
    }

    function humidity({current: {humidity: percent}}) {
        return `Humidity: ${percent}%`
    }

    function windSpeed({current: {wind_speed: mph}}) {
        return `Wind Speed: ${mph}MPH`
    }

    function timezone({timezone: tz}) {
        var date = dayjs().tz(tz).format('M/D/YYYY')
        return date;
    }

    function uvIndex({current: {uvi: uvi}}) {
        return `${uvi}`;
    }

    function weatherIconURL({current:
        {
            weather: {
                0: {
                    icon: icon,
                }
            }
        }})
        {
            return `https://openweathermap.org/img/wn/${icon}.png`;
        }

// assign variables to destructured elements
    var currentCityWeather = temperature(data);
    console.log(currentCityWeather);

    var currentCityHumidity = humidity(data);
    console.log(currentCityHumidity);

    var currentCityWind = windSpeed(data);
    console.log(currentCityWind);

    var currentTimezone = timezone(data);
    console.log(currentTimezone);

    var uvi = uvIndex(data);
    console.log(uvi);

    var iconURL = weatherIconURL(data);
    console.log(iconURL);

// append variables to DOM elements
    var temperatureEl = document.createElement('p');
    temperatureEl.setAttribute('class', 'card-text');
    temperatureEl.innerHTML = '';
    temperatureEl.append(currentCityWeather);

    var humidityEl = document.createElement('p');
    humidityEl.setAttribute('class', 'card-text');
    humidityEl.innerHTML = '';
    humidityEl.append(currentCityHumidity);

    var windEl = document.createElement('p');
    windEl.setAttribute('class', 'card-text');
    windEl.innerHTML = '';
    windEl.append(currentCityWind);

    var iconEL = document.createElement('img');
    iconEL.
    setAttribute('src', iconURL);

    var uviText = document.createElement('h6');
    uviText.textContent = '';
    uviText.append(uvi);

// text color conditional upon uvi
    var uviButton = document.createElement('button');
    uviButton.append(uviText);

    if (uvi < 3) {
        uviButton.setAttribute('class','btn-success rounded-pill mx-2 my-2');
    } else if (uvi < 7) {
        uviButton.setAttribute('class','btn-warning rounded-pill mx-2 my-2');
    } else {
        uviButton.setAttribute('class','btn-danger rounded-pill mx-2 my-2');
    }

    currentTimezoneWrapper.textContent = currentTimezone;

    var weatherList = document.createElement('div');
    weatherList.append(temperatureEl, humidityEl, windEl);

    currentCityWrapperEL.innerHTML = '';
    currentCityWrapperEL.append(iconEL, weatherList, uviButton);

}

liveSearchHistoryList();


var searchHistoryButtonHandler = function(event) {
    event.preventDefault();

    var historyItemButton = event.target;
    var citySearch = historyItemButton.getAttribute('searchItemActive');
    getSearchCoordinates(citySearch);
}

searchForm.addEventListener("submit", formSubmitHandler);

searchHistoryEl.addEventListener("click", searchHistoryButtonHandler);