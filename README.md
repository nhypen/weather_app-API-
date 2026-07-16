# Weather App

A modern and responsive weather application built with HTML, CSS, and JavaScript.

The application allows users to search for any city and view the current weather conditions together with a five-day forecast. It uses the Open-Meteo API, which does not require an API key.

## Features

* Search for weather by city name
* Display current temperature
* Display the minimum and maximum temperature
* Display the apparent temperature
* Display humidity
* Display wind speed
* Display precipitation
* Display the current weather condition
* Five-day weather forecast
* Dynamic background based on weather conditions
* Current location weather using browser geolocation
* Automatic saving of the last searched city
* Responsive design for desktop, tablet, and mobile devices
* Loading animation
* Error messages for invalid cities and failed requests

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Open-Meteo Weather API
* Open-Meteo Geocoding API
* BigDataCloud Reverse Geocoding API
* Font Awesome
* Google Fonts

## Project Structure

```text
weather-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How It Works

The user enters a city name into the search field.

The application sends a request to the Open-Meteo Geocoding API to find the coordinates of the selected city.

The coordinates are then used to request weather data from the Open-Meteo Weather API.

The returned data is displayed on the page, including the current weather conditions and the forecast for the next five days.

The application also changes the background depending on the current weather, such as clear weather, rain, snow, fog, clouds, or thunderstorms.

## API Information

This project uses the Open-Meteo API.

Open-Meteo provides free weather data and does not require an API key.

Weather API:

```text
https://api.open-meteo.com/v1/forecast
```

Geocoding API:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Reverse Geocoding API:

```text
https://api.bigdatacloud.net/data/reverse-geocode-client
```

## How to Run the Project

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Right-click the `index.html` file.
5. Select `Open with Live Server`.
6. Enter a city name in the search field.
7. Click the Search button.

## Using Current Location

The location button allows the user to display weather information for their current location.

The browser may ask for permission to access the location.

Geolocation may not work when the `index.html` file is opened directly from the computer. The project should be opened using Live Server or another local development server.

## Local Storage

The application uses browser local storage to remember the last searched city.

When the user opens the application again, weather data for the saved city is loaded automatically.

If no city has been saved, Warsaw is displayed as the default city.

## Error Handling

The application displays an error message when:

* The city cannot be found
* The search field is empty
* Weather data cannot be downloaded
* The browser does not support geolocation
* Location permission is denied
* The current location is unavailable

## Responsive Design

The application is fully responsive and adjusts its layout for:

* Desktop computers
* Tablets
* Mobile phones

Weather cards and forecast elements automatically reorganize depending on the screen size.

## Author
nhypen
