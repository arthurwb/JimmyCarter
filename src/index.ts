import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message, ShardClientUtil, TextChannel } from 'discord.js';

import { commands } from './commands/commands';
import { msgEvents } from './msg_events/msgEvents';
import { checkAndLogWords } from './util/profanityCounter';

import { setTimeout } from 'node:timers/promises';

import cron from 'node-cron';

import profanity from '../responses/profanity.json' with { type: 'json' };
import profanityRes from '../responses/profanity-responses.json' with { type: 'json' };
import triggers from '../responses/triggers.json' with { type: 'json' };
import { dice100, dice20, dice6 } from './util/dice';

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

    // ---------- PROFANITY DETECTION ----------
    const list = profanity["profanity"];
    const matchedWords: string[] = [];

    for (const word of list) {
        if (msg_lower.includes(word)) {
            matchedWords.push(word);
        }
    }

    if (matchedWords.length > 0) {
        const res = profanityRes["profanity-responses"][Math.floor(Math.random() * (profanityRes["profanity-responses"].length))];
        if (msg.channel instanceof TextChannel && dice20() == 1) {
            msg.channel.send(res);
        }

        checkAndLogWords(msg, matchedWords);
        return; // stops ALL further processing
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

    if (dice100() == 1) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send("you have been afflicted...");
            let user = msg.author.username;

            setTimeout(3600000);

            if (dice6() == 1) {
                msg.channel.send(`${user} has unfortunatly passed away...`);
                msg.channel.send({ files: ["https://www.politico.com/dims4/default/resize/630/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2Fe1%2F84%2F1aac2b2548a5939c6880fed24760%2Fgettyimages-1313911789.jpeg"] });
            } else {
                msg.channel.send(`${user} is looking good, they are't sick anymore. Yay`);
                msg.channel.send({ files: ["https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/rockcms/2023-02/230218-jimmy-carter-mjf-1542-3ab487.jpg"] });
            }
        }
    }
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
