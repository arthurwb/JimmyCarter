import { Client } from 'discord.js';
import cron from 'node-cron';

import { getNews } from '../util/getNews';
import newsJSON from '../../responses/news.json';

export function news(readyClient: Client<true>): void {
    console.log(`Initializing news scheduler for ${readyClient.user.tag}`);

    const reminderChannelId = process.env.REMINDER_CHANNEL_ID;

    if (!reminderChannelId) {
        console.error('REMINDER_CHANNEL_ID is missing from .env');
        return;
    }

    cron.schedule('0 15 * * *', async () => {
        try {
            const channel = await readyClient.channels.fetch(reminderChannelId);

            if (!channel || !channel.isTextBased() || !('send' in channel)) {
                console.error('Reminder channel not found or cannot send messages.');
                return;
            }

            const newsHeadline = await getNews();

            const endings = newsJSON.news;

            const ending = endings[
                Math.floor(Math.random() * endings.length())
            ];

            await channel.send(
                `I just read an article titled "${newsHeadline}". ${ending}`
            );

            console.log('Daily noon event completed.');

        } catch (error: unknown) {
            console.error('Daily event failed:', error);
        }

    }, {
        timezone: 'America/New_York'
    });

    console.log('News scheduler initialized. Runs daily at noon.');
}
