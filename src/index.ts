import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message, ShardClientUtil, TextChannel } from 'discord.js';

import { commands } from './commands/commands';
import { msgEvents } from './msg_events/msgEvents';
import { checkAndLogWords } from './util/profanityCounter';

import { setTimeout } from 'node:timers/promises';

import cron from 'node-cron';

import profanity_responses from '../responses/profanity_responses.json' with { type: 'json' };
import profanityList from '../responses/profanity.json' with { type: 'json' };
import { dice100, dice20, dice6, dice12 } from './util/dice';
import { getReminder, setReminder } from './reminders/reminder';

interface TriggerConfig {
    triggers: string[];
    set_reminders: string[];
    get_reminders: string[];
}

import triggerConfig from '../responses/triggers.json' with { type: 'json' };
import { news } from './reminders/news';
import { weather } from './reminders/weather';

const triggers = triggerConfig as TriggerConfig;

// Create a new Discord client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// When the bot is ready
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);

    news(readyClient);
    weather(readyClient);
});

// Handle incoming messages
client.on(Events.MessageCreate, async (msg: Message) => {
    if (msg.author.bot) return;

    const msg_lower = msg.content.toLowerCase();

    // ---------- REMINDERS ----------
    const set_reminders: string[] = triggers.set_reminders ?? [];
    const get_reminders: string[] = triggers.get_reminders ?? [];

    const matchedSetReminder = set_reminders.some(trigger =>
        msg_lower.includes(trigger.toLowerCase())
    );

    if (matchedSetReminder) {
        setReminder(msg);
        return;
    }

    const matchedGetReminder = get_reminders.some(trigger =>
        msg_lower.includes(trigger.toLowerCase())
    );

    if (matchedGetReminder) {
        getReminder(msg);
        return;
    }

    // ---------- COMMANDS ----------
    if (msg_lower.startsWith('!')) {
        commands(msg);
        return;
    }

    // ---------- TRIGGERS ----------
    const jimmyTriggers = triggers.triggers ?? [];

    if (jimmyTriggers.some(trigger => msg_lower.includes(trigger))) {
        msgEvents(msg);
        return;
    }

    if (profanityList["profanity"].some(word => msg_lower.includes(word)) && dice12() == 0) {
        const res = profanity_responses["profanity_responses"][Math.floor(Math.random() * (profanity_responses["profanity_responses"].length))];
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(res)
        }
        return;
    } 
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
