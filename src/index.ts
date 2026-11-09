import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message, ShardClientUtil, TextChannel } from 'discord.js';

import { commands } from './commands/commands';
import { msgEvents } from './msg_events/msgEvents';
import { checkAndLogWords } from './util/profanityCounter';

import { setTimeout } from 'node:timers/promises';

import cron from 'node-cron';

import profanity from '../responses/profanity.json' with { type: 'json' };
import profanityRes from '../responses/profanity-responses.json' with { type: 'json' };
import { dice100, dice20, dice6 } from './util/dice';
import { getReminder, setReminder } from './reminders/reminder';

interface TriggerConfig {
    triggers: string[];
    set_reminders: string[];
    get_reminders: string[];
}

import triggerConfig from '../responses/triggers.json' with { type: 'json' };

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
client.once(Events.ClientReady, () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
});

// Handle incoming messages
client.on(Events.MessageCreate, async (msg: Message) => {
    if (msg.author.bot) return;

    const msg_lower = msg.content.toLowerCase();

    // ---------- REMINDERS ----------
    const set_reminders: string[] = triggers.set_reminders ?? [];
    const get_reminders: string[] = triggers.get_reminders ?? [];

    const matchedSetReminder = set_reminders.some((set_reminders) =>
        msg_lower.toLowerCase().includes(set_reminders.toLowerCase())
    );

    if (matchedSetReminder) {
        setReminder(msg);
        return;
    }

    const matchedGetReminder = get_reminders.some((get_reminders) =>
        msg_lower.toLowerCase().includes(get_reminders.toLowerCase())
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
    const jimmyTriggers = triggers.triggers ?? [];;
    if (jimmyTriggers.some(trigger => msg_lower.includes(trigger))) {
        msgEvents(msg);
        return;
    }

    // ----------- EVENTS ------------
    client.once(Events.ClientReady, async (readyClient) => {
        
    });
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
