import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message, ShardClientUtil, TextChannel } from 'discord.js';

import { commands } from './commands/commands';
import { msgEvents } from './msg_events/msgEvents';
import { checkAndLogWords } from './util/profanityCounter';

import profanity from '../responses/profanity.json' assert { type: 'json' };
import triggers from '../responses/triggers.json' assert { type: 'json' };

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
client.on(Events.MessageCreate, (msg: Message) => {
    if (msg.author.bot) return;

    const msg_lower = msg.content.toLowerCase();

    // ---------- PROFANITY DETECTION ----------
    const list = profanity["profanity"];
    const matchedWords: string[] = [];

    for (const word of list) {
        const regex = new RegExp(`\\b${word}\\b`, 'i'); // word-safe
        if (regex.test(msg_lower)) {
            matchedWords.push(word);
        }
    }

    if (matchedWords.length > 0) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send("⚠️ TEST: Profanity detected");
        }

        checkAndLogWords(msg, matchedWords);
        return; // ⛔ stops ALL further processing
    }

    // ---------- TRIGGERS ----------
    const jimmyTriggers = triggers["triggers"];
    if (jimmyTriggers.some(trigger => msg_lower.includes(trigger))) {
        msgEvents(msg);
    }

    // ---------- COMMANDS ----------
    if (msg_lower.startsWith('!')) {
        commands(msg);
    }
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
