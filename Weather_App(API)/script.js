"use strict";

/*
    Weather App
    API: Open-Meteo

    This application does not require an API key.
*/

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const clearButton = document.getElementById("clearButton");
const locationButton = document.getElementById("locationButton");

const weatherContent = document.getElementById("weatherContent");
const loadingContainer = document.getElementById("loadingContainer");
const messageBox = document.getElementById("messageBox");

const currentDateElement = document.getElementById("currentDate");
const cityNameElement = document.getElementById("cityName");
const countryNameElement = document.getElementById("countryName");
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const currentTemperature = document.getElementById("currentTemperature");
const weatherDescription = document.getElementById("weatherDescription");

const maxTemperature = document.getElementById("maxTemperature");
const minTemperature = document.getElementById("minTemperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const precipitation = document.getElementById("precipitation");

const forecastGrid = document.getElementById("forecastGrid");
const lastUpdated = document.getElementById("lastUpdated");

const GEOCODING_API_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

const REVERSE_GEOCODING_API_URL =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";

const WEATHER_API_URL =
    "https://api.open-meteo.com/v1/forecast";

const DEFAULT_CITY = "Warsaw";

const weatherCodes = {
    0: {
        description: "Clear sky",
        dayIcon: "☀️",
        nightIcon: "🌙",
        theme: "clear"
    },

    1: {
        description: "Mainly clear",
        dayIcon: "🌤️",
        nightIcon: "🌙",
        theme: "clear"
    },

    2: {
        description: "Partly cloudy",
        dayIcon: "⛅",
        nightIcon: "☁️",
        theme: "cloudy"
    },

    3: {
        description: "Overcast",
        dayIcon: "☁️",
        nightIcon: "☁️",
        theme: "cloudy"
    },

    45: {
        description: "Fog",
        dayIcon: "🌫️",
        nightIcon: "🌫️",
        theme: "fog"
    },

    48: {
        description: "Rime fog",
        dayIcon: "🌫️",
        nightIcon: "🌫️",
        theme: "fog"
    },

    51: {
        description: "Light drizzle",
        dayIcon: "🌦️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    53: {
        description: "Moderate drizzle",
        dayIcon: "🌦️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    55: {
        description: "Heavy drizzle",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    56: {
        description: "Light freezing drizzle",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    57: {
        description: "Heavy freezing drizzle",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    61: {
        description: "Light rain",
        dayIcon: "🌦️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    63: {
        description: "Moderate rain",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    65: {
        description: "Heavy rain",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    66: {
        description: "Light freezing rain",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    67: {
        description: "Heavy freezing rain",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    71: {
        description: "Light snowfall",
        dayIcon: "🌨️",
        nightIcon: "🌨️",
        theme: "snow"
    },

    73: {
        description: "Moderate snowfall",
        dayIcon: "🌨️",
        nightIcon: "🌨️",
        theme: "snow"
    },

    75: {
        description: "Heavy snowfall",
        dayIcon: "❄️",
        nightIcon: "❄️",
        theme: "snow"
    },

    77: {
        description: "Snow grains",
        dayIcon: "❄️",
        nightIcon: "❄️",
        theme: "snow"
    },

    80: {
        description: "Light rain showers",
        dayIcon: "🌦️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    81: {
        description: "Moderate rain showers",
        dayIcon: "🌧️",
        nightIcon: "🌧️",
        theme: "rain"
    },

    82: {
        description: "Heavy rain showers",
        dayIcon: "⛈️",
        nightIcon: "⛈️",
        theme: "storm"
    },

    85: {
        description: "Light snow showers",
        dayIcon: "🌨️",
        nightIcon: "🌨️",
        theme: "snow"
    },

    86: {
        description: "Heavy snow showers",
        dayIcon: "❄️",
        nightIcon: "❄️",
        theme: "snow"
    },

    95: {
        description: "Thunderstorm",
        dayIcon: "⛈️",
        nightIcon: "⛈️",
        theme: "storm"
    },

    96: {
        description: "Thunderstorm with hail",
        dayIcon: "⛈️",
        nightIcon: "⛈️",
        theme: "storm"
    },

    99: {
        description: "Severe thunderstorm with hail",
        dayIcon: "⛈️",
        nightIcon: "⛈️",
        theme: "storm"
    }
};

searchForm.addEventListener("submit", handleSearch);

cityInput.addEventListener("input", () => {
    const hasText = cityInput.value.trim().length > 0;

    clearButton.classList.toggle("hidden", !hasText);
});

clearButton.addEventListener("click", () => {
    cityInput.value = "";
    clearButton.classList.add("hidden");
    cityInput.focus();
});

locationButton.addEventListener("click", getUserLocation);

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    const savedCity = localStorage.getItem("weatherAppCity");
    const initialCity = savedCity || DEFAULT_CITY;

    cityInput.value = initialCity;
    clearButton.classList.remove("hidden");

    await searchWeatherByCity(initialCity);
}

async function handleSearch(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name.");
        return;
    }

    await searchWeatherByCity(city);
}

async function searchWeatherByCity(city) {
    showLoading();

    try {
        const location = await getCoordinates(city);

        if (!location) {
            throw new Error(
                "City not found. Check the spelling and try again."
            );
        }

        const weatherData = await getWeatherData(
            location.latitude,
            location.longitude
        );

        displayWeather(weatherData, location);

        localStorage.setItem("weatherAppCity", location.name);
    } catch (error) {
        console.error("Weather application error:", error);

        showMessage(
            error.message ||
            "Something went wrong while loading the weather."
        );
    } finally {
        hideLoading();
    }
}

async function getCoordinates(city) {
    const requestUrl =
        `${GEOCODING_API_URL}` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
        throw new Error("Unable to search for this city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    return data.results[0];
}

async function getWeatherData(latitude, longitude) {
    const currentVariables = [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "weather_code",
        "wind_speed_10m"
    ].join(",");

    const dailyVariables = [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max"
    ].join(",");

    const requestUrl =
        `${WEATHER_API_URL}` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=${currentVariables}` +
        `&daily=${dailyVariables}` +
        `&temperature_unit=celsius` +
        `&wind_speed_unit=kmh` +
        `&precipitation_unit=mm` +
        `&timezone=auto` +
        `&forecast_days=6`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
        throw new Error("Unable to download weather data.");
    }

    return await response.json();
}

function displayWeather(data, location) {
    const current = data.current;
    const daily = data.daily;

    if (!current || !daily) {
        throw new Error("The weather service returned incomplete data.");
    }

    const currentCondition = getWeatherCondition(
        current.weather_code
    );

    const isDay = current.is_day === 1;

    currentDateElement.textContent = formatFullDate(current.time);

    cityNameElement.textContent = location.name;

    countryNameElement.textContent = createLocationDescription(
        location
    );

    currentWeatherIcon.textContent = isDay
        ? currentCondition.dayIcon
        : currentCondition.nightIcon;

    currentTemperature.textContent =
        `${roundTemperature(current.temperature_2m)}°`;

    weatherDescription.textContent =
        currentCondition.description;

    maxTemperature.textContent =
        `${roundTemperature(daily.temperature_2m_max[0])}°`;

    minTemperature.textContent =
        `${roundTemperature(daily.temperature_2m_min[0])}°`;

    feelsLike.textContent =
        `${roundTemperature(current.apparent_temperature)}°`;

    humidity.textContent =
        `${Math.round(current.relative_humidity_2m)}%`;

    windSpeed.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    precipitation.textContent =
        `${formatNumber(current.precipitation)} mm`;

    lastUpdated.textContent =
        `Last updated: ${formatTime(current.time)}`;

    renderForecast(daily);
    updateBackground(currentCondition.theme, isDay);

    messageBox.classList.add("hidden");
    weatherContent.classList.remove("hidden");
}

function renderForecast(daily) {
    forecastGrid.innerHTML = "";

    /*
        Index 0 is the current day.
        We use indexes 1–5 for the next five days.
    */
    for (let index = 1; index <= 5; index += 1) {
        const weatherCode = daily.weather_code[index];
        const condition = getWeatherCondition(weatherCode);

        const forecastCard = document.createElement("article");
        forecastCard.className = "forecast-card";

        forecastCard.innerHTML = `
            <p class="forecast-day">
                ${formatWeekday(daily.time[index])}
            </p>

            <p class="forecast-date">
                ${formatShortDate(daily.time[index])}
            </p>

            <div
                class="forecast-icon"
                aria-label="${condition.description}"
                title="${condition.description}"
            >
                ${condition.dayIcon}
            </div>

            <p class="forecast-description">
                ${condition.description}
            </p>

            <div class="forecast-temperatures">
                <strong>
                    ${roundTemperature(
                        daily.temperature_2m_max[index]
                    )}°
                </strong>

                <span>
                    ${roundTemperature(
                        daily.temperature_2m_min[index]
                    )}°
                </span>
            </div>
        `;

        forecastGrid.appendChild(forecastCard);
    }
}

function getWeatherCondition(code) {
    return weatherCodes[code] || {
        description: "Unknown weather",
        dayIcon: "🌡️",
        nightIcon: "🌡️",
        theme: "cloudy"
    };
}

function updateBackground(theme, isDay) {
    const weatherClasses = [
        "weather-default",
        "weather-clear-day",
        "weather-clear-night",
        "weather-cloudy",
        "weather-rain",
        "weather-storm",
        "weather-snow",
        "weather-fog"
    ];

    document.body.classList.remove(...weatherClasses);

    if (theme === "clear") {
        document.body.classList.add(
            isDay
                ? "weather-clear-day"
                : "weather-clear-night"
        );

        return;
    }

    document.body.classList.add(`weather-${theme}`);
}

function createLocationDescription(location) {
    const parts = [];

    if (
        location.admin1 &&
        location.admin1 !== location.name
    ) {
        parts.push(location.admin1);
    }

    if (location.country) {
        parts.push(location.country);
    }

    return parts.join(", ") || "Unknown location";
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showMessage(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const location = await getLocationName(
                    latitude,
                    longitude
                );

                const weatherData = await getWeatherData(
                    latitude,
                    longitude
                );

                displayWeather(weatherData, location);

                cityInput.value = location.name;
                clearButton.classList.remove("hidden");

                localStorage.setItem(
                    "weatherAppCity",
                    location.name
                );
            } catch (error) {
                console.error("Location error:", error);

                showMessage(
                    "Your location was found, but the weather could not be loaded."
                );
            } finally {
                hideLoading();
            }
        },

        (error) => {
            hideLoading();

            const errorMessages = {
                1: "Location permission was denied.",
                2: "Your location is currently unavailable.",
                3: "The location request took too long."
            };

            showMessage(
                errorMessages[error.code] ||
                "Unable to access your location."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

async function getLocationName(latitude, longitude) {
    try {
        const requestUrl =
            `${REVERSE_GEOCODING_API_URL}` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&localityLanguage=en`;

        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error("Reverse geocoding failed.");
        }

        const data = await response.json();

        return {
            name:
                data.city ||
                data.locality ||
                data.principalSubdivision ||
                "Current location",

            admin1: data.principalSubdivision || "",
            country: data.countryName || ""
        };
    } catch (error) {
        console.warn(
            "Unable to determine the location name:",
            error
        );

        return {
            name: "Current location",
            admin1: "",
            country: ""
        };
    }
}

function showLoading() {
    loadingContainer.classList.remove("hidden");
    weatherContent.classList.add("hidden");
    messageBox.classList.add("hidden");

    searchForm.setAttribute("aria-busy", "true");
}

function hideLoading() {
    loadingContainer.classList.add("hidden");
    searchForm.setAttribute("aria-busy", "false");
}

function showMessage(message) {
    messageBox.textContent = message;
    messageBox.classList.remove("hidden");
}

function roundTemperature(value) {
    if (typeof value !== "number") {
        return "--";
    }

    return Math.round(value);
}

function formatNumber(value) {
    if (typeof value !== "number") {
        return "0";
    }

    return value.toFixed(1);
}

function parseApiDate(dateString) {
    /*
        Adding T00:00:00 prevents the browser from changing
        the date because of UTC timezone conversion.
    */
    return new Date(`${dateString.split("T")[0]}T00:00:00`);
}

function formatFullDate(dateString) {
    const date = dateString.includes("T")
        ? new Date(dateString)
        : parseApiDate(dateString);

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(date);
}

function formatWeekday(dateString) {
    const date = parseApiDate(dateString);

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "short"
    }).format(date);
}

function formatShortDate(dateString) {
    const date = parseApiDate(dateString);

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short"
    }).format(date);
}

function formatTime(dateString) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}