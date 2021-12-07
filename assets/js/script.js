var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '3b73cbd4a1e753832f14fcac6dacbcdf';

// Select DOM elements
var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#floatingInput');
var currentWeather = document.querySelector('#city');
var forecastWrapper = document.querySelector('#forecast');
// var searchHistoryEl = document.querySelector('.list-group');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Search History: display
// function displaySearchHistory() {
//     searchHistoryEl.innerHTML = '';

//     // display most recent history first
//     for (var i = searchHistory.length - 1; i>= 0; i--) {
//         var listButton = document.createElement('button');
//         listButton.setAttribute('type', 'button');
//         listButton.classList.add('list-group-item', 'list-group-item-action');

//         listButton.textContent = searchHistory[i];
//         listButton.setAttribute('data-search', searchHistory[i]);
//         searchHistoryEl.append(listButton);
//     }
// }

// function storeSearchHistory(search) {
//     searchHistory.push(search);

//     localStorage.setItem('search-item', JSON.stringify(searchHistory));

//     displaySearchHistory();
// }

// function retrieveSearchHistory() {
//     var searchHistoryStorage = localStorage.getItem('search-item');
//     if (searchHistoryStorage) {
//         searchHistoryStorage = JSON.parse(searchHistoryStorage);
//     }
//     displaySearchHistory();
// }

// function displayCurrentCityWeather(city, timezone, weather) {
//     var date = dayjs().tz(timezone).format('M/D/YYYY');

//     // grab weather data from API and declare as variables
//     var fahrenheit = weather.temp;
//     var humidity = weather.humidity;
//     var windSpeed = weather.wind_speed;
//     var uvi = weather.uvi;

//     // thank you to my tutor who helped me figure out how to use the icons on openweather.org!
//     var iconURL = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
//     var iconDesc = weather.weather[0].description || weather[0].main;

// // create dom elements to display weather

//     // temperature in degrees-fahrenheit
//     var tempEl = document.createElement('p');
//     tempEl.setAttribute('class', 'card-text');
//     tempEl.textContent = `Temperature ${fahrenheit}°F`;

//     // humidity in %
//     var humidityEl = document.createElement('p');
//     humidityEl.setAttribute('class', 'card-text');
//     humidityEl.textContent = `Humidity: ${humidity}%`;

//     // wind speed in mph
//     var windEl = document.createElement('p');
//     windEl.setAttribute('class', 'card-text');
//     windEl.textContent = `Wind Speed: ${windSpeed}mph`;

//     // UV Index in ... its own index
//     var uviEl = document.createElement('p');
//     uviEl.setAttribute('class', 'card-text');
//     uviEl.textContent = `UV Index: ${uvi}`;

//     // create border property
//     var uviBorder = document.createElement('div');
//     uviBorder.setAttribute('class', 'border');
//     uviBorder.setAttribute('class', 'border-2');
//     uviBorder.setAttribute('class', 'm-3');

//     // border color conditional upon uvi
//     if (uvi < 3) {
//         uviBorder.classList.add('border-success');
//     } else if (uvi < 7) {
//         uviBorder.classList.add('border-warning');
//     } else {
//         uviBorder.classList.add('border-danger');
//     }

//     // append border to uviEl and then uviEl to a card
//     uviEl.append(uviBorder);
//     cardBody.append(uviEl);

//     // create cards
//     var cardBody = document.createElement('div');
//     var card = document.createElement('div');
//     cardBody.setAttribute('class', 'card-body');
//     card.setAttribute('class', 'card');
//     card.append(cardBody);

//     // create heading for current city name
//     var heading = document.createElement('h2');
//     heading.setAttribute('class', 'h2 card-title');
//     heading.textContent = `${city} (${date})`;
//     heading.append(weatherIcon);

//     // create weather icon image elements
//     var weatherIcon = document.createElement('img');
//     weatherIcon.setAttribute('class', 'weather-icon');
//     weatherIcon.setAttribute('src', iconURL);
//     weatherIcon.setAttribute('alt', iconDesc);

//     // append all of this to the currentWeather section
//     currentWeather.innerHTML = '';
//     currentWeather.append(card);
// }

function displayData(city, data) {
    let cityTitle = city.innerHTML;
    let dataContent = data.innerHTML;

    cityTitle = document.createElement('h2');
    cityTitle.setAttribute('class', 'card-title');

    dataContent = document.createElement('p');
    dataContent.setAttribute('class', 'card-text');

    var cardBody = document.createElement('div');
    var card = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');
    card.setAttribute('class', 'card');
    card.append(cardBody);

    cityTitle.append(card);
    dataContent.append(card);

    card.append(currentWeather);
}

function currentCityWeather(input) {

    var city = input;

    var apiURL = `${weatherApiRootUrl}/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;

    fetch(apiURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            // data.weather
            displayData(city, data);
        })
        .catch(function(err) {
            console.error(err);
        });
}


// retrieveSearchHistory();
searchForm.addEventListener('submit', currentCityWeather('Minneapolis'));
// searchHistoryEl.addEventListener('click', retrieveSearchHistory);

// var getOneCallAPI = function() {
//     console.log('function was called')
// };

// getOneCallAPI();