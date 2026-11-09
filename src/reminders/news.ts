import { Client, Message, TextChannel } from 'discord.js';
import cron from 'node-cron';

import { getNews } from '../util/getNews';

export function news(readyClient: Client<true>) {
    console.log(`Logged in as ${readyClient.user.tag}!`);

    const reminderChannelId = process.env.REMINDER_CHANNEL_ID;

    if (!reminderChannelId) {
        console.error('REMINDER_CHANNEL_ID is missing from .env');
        return;
    }

    cron.schedule('0 12 * * *', async () => {
        try {
            const channel = await readyClient.channels.fetch(reminderChannelId);

            if (!channel) {
                console.error('Reminder channel not found.');
                return;
            }

            if (!channel.isTextBased() || !('send' in channel)) {
                console.error('Reminder channel is not a text channel.');
                return;
            }

            const news = getNews();

            await channel.send(news);

            console.log('Daily noon event completed.');

        } catch (error: unknown) {
            console.error('Daily event failed:', error);
        }

    }, {
        timezone: 'America/New_York'
    });
}