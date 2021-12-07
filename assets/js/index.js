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

    var apiURL = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=3&appid=${apiKey}`;

    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            if (!data[0]) {
                alert('Location unknown')
            } else {
                getWeatherData(data[0]);
            }
            })
            .catch(function(err) {
                console.error(err);
        });
    });
}

var getWeatherData = function(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    searchedCity.textContent = city;
    // searchHistoryEl.append(city);
    // // searchHistoryEl.textContent = city;

    // localStorage.setItem('city', city);

    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
        return res.json();
        })
        .then(function (data) {
        displayCurrentWeather(data);
        })
        .catch(function (err) {
        console.error(err);
        });
}

// var destructureData = function(location, data) {
//     displayCurrentWeather(location, data.current, data.timezone);

// }

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
        return `UV Index: ${uvi}`;
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

    var uviEl = document.createElement('h5');
    uviEl.append(uvi);

    // create border element that for UV Index
    var uviBorder = document.createElement('div');
    uviBorder.setAttribute('class', 'border border-2 m-3');

    // border color conditional upon uvi
    if (uvi <= 3) {
        uviBorder.classList.add('border-success');
    } else if (uvi <= 7) {
        uviBorder.classList.add('border-warning');
    } else {
        uviBorder.classList.add('border-danger');
    }


    currentTimezoneWrapper.textContent = currentTimezone;

    var weatherList = document.createElement('div');
    // var weatherListItem = document.createElement('li');
    weatherList.append(temperatureEl, humidityEl, windEl, uviEl);

    currentCityWrapperEL.innerHTML = '';
    currentCityWrapperEL.append(weatherList)

}

// var searchHistoryButtonHandler = function(event) {
//     event.preventDefault();

//     searchHistoryEl.innerHTML = search;
//     getCurrentWeather(search);
// }

searchForm.addEventListener("submit", formSubmitHandler);

// searchHistoryEl.addEventListener("click", getCurrentWeather);