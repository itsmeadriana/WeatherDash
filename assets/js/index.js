var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '3b73cbd4a1e753832f14fcac6dacbcdf';

// Select DOM elements
var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#floatingInput');
var currentWeather = document.querySelector('#city');
var forecastWrapper = document.querySelector('#forecast');
// var searchHistoryEl = document.querySelector('.list-group');

var response = fetch("https://api.openweathermap.org/data/2.5/weather?q=austin&appid=3b73cbd4a1e753832f14fcac6dacbcdf");
console.log("inside", response);