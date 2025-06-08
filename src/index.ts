import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message, ShardClientUtil } from 'discord.js';

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
    if (msg.author.bot) return; // make sure the bot doesnt respond to itself
    const msg_lower = msg.content.toLocaleLowerCase();

    const jimmyTriggers = triggers["triggers"];
    if (jimmyTriggers.some(trigger => msg_lower.includes(trigger))) {
        msgEvents(msg);
    }

    if (msg_lower.startsWith('!')) {
        commands(msg);
    }

    const list = profanity["profanity"];
    const matchedWords: string[] = [];

    list.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = msg_lower.match(regex);
        if (matches && matches.length > 0) {
            for (let i = 0; i < matches.length; i++) {
                matchedWords.push(word);
            }
        }
    });

    if (matchedWords.length > 0) {
        checkAndLogWords(msg, matchedWords);
    }
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
