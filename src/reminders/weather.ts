
import { Client, TextChannel } from 'discord.js';
import cron from 'node-cron';

import { getWeather } from '../util/getWeather';
import weatherJSON from '../../responses/weather.json';

// Types
type TemperatureCategory =
    | 'danger_cold'
    | 'very_cold'
    | 'cold'
    | 'normal'
    | 'hot'
    | 'very_hot'
    | 'danger_hot'
    | 'misc';

type PrecipitationCategory =
    | 'Thunderstorm'
    | 'Snow'
    | 'Rain'
    | 'Drizzle'
    | 'Clouds'
    | 'misc';

// Configuration
const TIMEZONE = 'America/New_York';
const SCHEDULE = '0 9 * * *';

const TEMPERATURE_THRESHOLDS: {
    max: number;
    category: TemperatureCategory;
}[] = [
    { max: -10, category: 'danger_cold' },
    { max: 32, category: 'very_cold' },
    { max: 59, category: 'cold' },
    { max: 79, category: 'normal' },
    { max: 94, category: 'hot' },
    { max: 110, category: 'very_hot' },
    { max: Infinity, category: 'danger_hot' }
];

const PRECIPITATION_PRIORITY: Record<string, number> = {
    Thunderstorm: 5,
    Snow: 4,
    Rain: 3,
    Drizzle: 2,
    Clouds: 1
};

// Helpers

function randomResponse<T>(responses: T[]): T {
    return responses[Math.floor(Math.random() * responses.length)];
}

function getTemperatureResponse(temp: number): string {
    const category =
        TEMPERATURE_THRESHOLDS.find(threshold => temp <= threshold.max)?.category
        ?? 'misc';

    return randomResponse(weatherJSON.temp[category]);
}

function getPrecipitationResponse(
    conditions: string[]
): string {
    const precipitation = conditions
        .filter(condition => condition in PRECIPITATION_PRIORITY)
        .sort(
            (a, b) =>
                PRECIPITATION_PRIORITY[b] - PRECIPITATION_PRIORITY[a]
        )[0] as PrecipitationCategory | undefined;

    return randomResponse(
        weatherJSON.precip[precipitation ?? 'misc']
    );
}

function formatWeatherMessage(weatherData: {
    day: number;
    night: number;
    conditions: string[];
}): string {
    const dayResponse = getTemperatureResponse(weatherData.day);
    const nightResponse = getTemperatureResponse(weatherData.night);
    const precipitationResponse = getPrecipitationResponse(
        weatherData.conditions
    );

    return `${dayResponse} | ${nightResponse} | ${precipitationResponse}`;
}

// Discord

async function sendWeatherUpdate(client: Client<true>): Promise<void> {
    const channelId = process.env.REMINDER_CHANNEL_ID;

    if (!channelId) {
        console.error('REMINDER_CHANNEL_ID is missing from .env');
        return;
    }

    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel?.isTextBased() || !('send' in channel)) {
            console.error('Reminder channel not found or cannot send messages.');
            return;
        }

        const weatherData = await getWeather();
        const message = formatWeatherMessage(weatherData);

        await channel.send(message);

        console.log('Daily weather event completed.');
    } catch (error: unknown) {
        console.error('Daily weather event failed:', error);
    }
}

// Scheduler

export function weather(client: Client<true>): void {
    console.log(`Initializing weather scheduler for ${client.user.tag}`);

    cron.schedule(
        SCHEDULE,
        async () => await sendWeatherUpdate(client),
        { timezone: TIMEZONE }
    );

    console.log('Weather scheduler initialized. Runs daily at 9am.');
}
