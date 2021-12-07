var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var apiKey = '3b73cbd4a1e753832f14fcac6dacbcdf';

// Select DOM elements
var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#floatingInput');
var iconWrapper = document.querySelector('#icon');
var searchedCity = document.querySelector('#city');
var currentTimezoneWrapper = document.querySelector('#timezone-wrapper')
var forecastTimezoneWrapper = document.querySelector('#forecast-timezone-wrapper');
var currentCityWrapperEL = document.querySelector('#current-weather-wrapper');
var forecastWrapperEL = document.querySelector('#forecast');
var searchHistoryEl = document.querySelector('#search-item');


dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// var response = fetch("https://api.openweathermap.org/data/2.5/weather?q=austin&appid=3b73cbd4a1e753832f14fcac6dacbcdf")
// .then(function(response) {
//     response.json().then(function(data) {
//         console.log("inside", data);
//     });
// });

var getSearchCoordinates = function (search) {

    var apiURL = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=3&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
                if (!data[0]) {
                    alert('Location unknown')
                } else {
                    getWeatherData(data[0]);
                    addToSearchHistory(search);
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    });
}

var liveSearchHistoryList = function () {
    var storedHistoryList = localStorage.getItem('city');
    if (storedHistoryList) {
        searchHistory = JSON.parse(storedHistoryList);
    }
    displaySearchHistory();
}

// console.log("outside", response);
var displaySearchHistory = function () {
    searchHistoryEl.innerHTML = '';

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var historyItem = document.createElement('button');
        historyItem.setAttribute('class', 'list-group-item list-group-item-action');
        historyItem.setAttribute('id', 'search-term');

        historyItem.setAttribute('searchItemActive', searchHistory[i]);
        historyItem.textContent = searchHistory[i];
        searchHistoryEl.append(historyItem)

    }
}

var addToSearchHistory = function (search) {

    searchHistory.push(search);
    localStorage.setItem('city', JSON.stringify(searchHistory));
    displaySearchHistory();
}

var getWeatherData = function (location) {
    var {
        lat
    } = location;
    var {
        lon
    } = location;
    var city = location.name;

    searchedCity.textContent = city;

    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(function (err) {
            console.error(err);
        });
}

var formSubmitHandler = function (event) {
    event.preventDefault();

    var location = searchInput.value.trim();

    if (location) {
        getSearchCoordinates(location);
        searchInput.value = '';
    } else {
        alert('Please enter a city name.')
    }
}

var displayCurrentWeather = function (data) {
    console.log(city);
    console.log(data);

    // functions to destructure array
    function temperature({
        current: {
            temp: temp
        }
    }) {
        return `Temperature: ${temp}°F`
    }

    function humidity({
        current: {
            humidity: percent
        }
    }) {
        return `Humidity: ${percent}%`
    }

    function windSpeed({
        current: {
            wind_speed: mph
        }
    }) {
        return `Wind Speed: ${mph}MPH`
    }

    function timezone({
        timezone: tz
    }) {
        var date = dayjs().tz(tz).format('M/D/YYYY')
        return date;
    }

    function uvIndex({
        current: {
            uvi: uvi
        }
    }) {
        return `${uvi}`;
    }

    function weatherIconURL({
        current: {
            weather: {
                0: {
                    icon: icon,
                }
            }
        }
    }) {
        return `https://openweathermap.org/img/wn/${icon}.png`;
    }

    function weatherIconDesc({
        current: {
            weather: {
                0: {
                    description: description,
                }
            }
        }
    }) {
        return `${description}`;
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

    var iconDesc = weatherIconDesc(data);
    console.log(iconDesc);

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

    var windEl = document.createElement('p');
    windEl.setAttribute('class', 'card-text');
    windEl.innerHTML = '';
    windEl.append(currentCityWind);

    var iconEL = document.createElement('img');
    iconEL.setAttribute('src', iconURL);

    var iconDescEl = document.createElement('p');
    iconDescEl.setAttribute('class', 'card-text');
    iconDescEl.innerHTML = '';
    iconDescEl.append(iconDesc);

    var uviText = document.createElement('h6');
    uviText.textContent = '';
    uviText.append(uvi);

    // text color conditional upon uvi
    var uviButton = document.createElement('button');
    uviButton.append(uviText);

    if (uvi < 3) {
        uviButton.setAttribute('class', 'btn-success rounded-pill mx-2 my-2');
    } else if (uvi < 7) {
        uviButton.setAttribute('class', 'btn-warning rounded-pill mx-2 my-2');
    } else {
        uviButton.setAttribute('class', 'btn-danger rounded-pill mx-2 my-2');
    }

    currentTimezoneWrapper.textContent = currentTimezone;

    var weatherList = document.createElement('div');
    weatherList.append(iconDesc, temperatureEl, humidityEl, windEl);

    currentCityWrapperEL.innerHTML = '';
    currentCityWrapperEL.append(iconEL, weatherList, uviButton);

}

// haaaaa this is so much simpler...
function temperature(forecastDay) {
    return `Temperature: ${forecastDay.temp.day}°F`;
}

function humidity(forecastDay) {
    return `Humidity: ${forecastDay.humidity}%`
}

function windSpeed(forecastDay) {
    return `Wind Speed: ${forecastDay.wind_speed}MPH`
}

function uvIndex(forecastDay) {
    return `${forecastDay.uvi}`;
}

function weatherIconURL(forecastDay) {
    return `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}.png`;
}

function weatherIconDesc(forecastDay) {
    return `${forecastDay.weather[0].description}`;
}

function timezone(data) {
    var date = dayjs().tz(data.timezone).format('dddd')
    return date;
}

var displayForecast = function (data) {
    // functions to destructure array

    for (var i = 1; i <= 5; i++) {
        console.log(data.daily[i]);
        const forecastDay = data.daily[i]

        // assign variables to destructured elements
        var forecastCityWeather = temperature(forecastDay);
        console.log(forecastCityWeather);

        var forecastCityHumidity = humidity(forecastDay);
        console.log(forecastCityHumidity);

        var forecastCityWind = windSpeed(forecastDay);
        console.log(forecastCityWind);

        var uvi = uvIndex(forecastDay);
        console.log(uvi);

        var iconURL = weatherIconURL(forecastDay);
        console.log(iconURL);

        var iconDesc = weatherIconDesc(forecastDay);
        console.log(iconDesc)

        var forecastTimezone = timezone(data);
        console.log(forecastTimezone);

        // append variables to DOM elements
        var temperatureEl = document.createElement('p');
        temperatureEl.setAttribute('class', 'card-text');
        temperatureEl.innerHTML = '';
        temperatureEl.append(forecastCityWeather);

        var humidityEl = document.createElement('p');
        humidityEl.setAttribute('class', 'card-text');
        humidityEl.innerHTML = '';
        humidityEl.append(forecastCityHumidity);

        var windEl = document.createElement('p');
        windEl.setAttribute('class', 'card-text');
        windEl.innerHTML = '';
        windEl.append(forecastCityWind);


        var iconEL = document.createElement('img');
        iconEL.setAttribute('src', iconURL);

        var iconDescEl = document.createElement('p');
        iconDescEl.setAttribute('class', 'card-text');
        iconDescEl.innerHTML = '';
        iconDescEl.append(iconDesc);

        var uviText = document.createElement('h6');
        uviText.textContent = '';
        uviText.append(uvi);

        // text color conditional upon uvi
        var uviButton = document.createElement('button');
        uviButton.append(uviText);

        if (uvi < 3) {
            uviButton.setAttribute('class', 'btn-success rounded-pill mx-2 my-2');
        } else if (uvi < 7) {
            uviButton.setAttribute('class', 'btn-warning rounded-pill mx-2 my-2');
        } else {
            uviButton.setAttribute('class', 'btn-danger rounded-pill mx-2 my-2');
        }

        //  build forecast card

        var column = document.createElement('div');
        var card = document.createElement('div');
        var cardBody = document.createElement('div');
        var cardTitle = document.createElement('h5');
        var weatherList = document.createElement('div');
        weatherList.append(temperatureEl, humidityEl, windEl);

        column.append(card)
        card.append(cardBody);
        cardBody.append(cardTitle, iconEL, iconDescEl, weatherList)

        cardTitle.textContent = forecastTimezone;

        forecastWrapperEL.innerHTML = '';
        forecastWrapperEL.append(column, uviButton);
    }
}

liveSearchHistoryList();


var searchHistoryButtonHandler = function (event) {
    event.preventDefault();

    var historyItemButton = event.target;
    var citySearch = historyItemButton.getAttribute('searchItemActive');
    getSearchCoordinates(citySearch);
}

searchForm.addEventListener("submit", formSubmitHandler);

searchHistoryEl.addEventListener("click", searchHistoryButtonHandler);