
interface Hour {
    id: number;
    temp?: string;
    condition?: string;
}

interface Daily {
    temps: number[];
    day: number;
    night: number;
    conditions: string[];
}

interface WeatherApiResponse {
    list: {
        main: {
            temp: number;
        };
        weather: {
            main: string;
        }[];
    }[];
}

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const WEATHER_LOCATION = {
    lat: 39.1,
    lon: -84.5
};

const FORECAST_HOURS = 8;
const DAY_HOURS = 4;

// API

async function fetchWeather(): Promise<WeatherApiResponse | null> {
    const key = process.env.WEATHER_API;

    if (!key) {
        console.error('WEATHER_API is missing from .env');
        return null;
    }

    try {
        const params = new URLSearchParams({
            lat: WEATHER_LOCATION.lat.toString(),
            lon: WEATHER_LOCATION.lon.toString(),
            appid: key,
            units: 'imperial',
            cnt: FORECAST_HOURS.toString()
        });

        const response = await fetch(
            `${WEATHER_API_URL}?${params}`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data: WeatherApiResponse = await response.json();

        if (!data.list?.length) {
            console.error('Weather API returned an empty forecast.');
            return null;
        }

        return data;

    } catch (error: unknown) {
        console.error('Failed to fetch weather:', error);
        return null;
    }
}

// Processing

function processWeather(data: WeatherApiResponse): Daily {
    const dayForecast = data.list.slice(0, DAY_HOURS);
    const nightForecast = data.list.slice(DAY_HOURS);

    const allTemp = data.list.flatMap(
        hour => Math.floor(hour.main.temp)
    );

    const dayTemp = Math.max(
        ...dayForecast.map(hour => hour.main.temp)
    );

    const nightTemp = Math.min(
        ...nightForecast.map(hour => hour.main.temp)
    );

    const conditions = data.list.flatMap(
        hour => hour.weather.map(condition => condition.main)
    );

    return {
        temps: allTemp,
        day: dayTemp,
        night: nightTemp,
        conditions
    };
}

// Main

export async function getWeather(): Promise<Daily | null> {
    const data = await fetchWeather();

    if (!data) return null;

    console.log('Weather fetched successfully.');

    return processWeather(data);
}
