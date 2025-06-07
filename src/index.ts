import 'dotenv/config'; // initializes dotenv
import { Client, GatewayIntentBits, Events, Message } from 'discord.js';

import { commands } from './commands/commands';
import { msgEvents } from './msg_events/msgEvents';

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

    const jimmyTriggers = ["jimmy", "jim", "peanuts"]
    if (jimmyTriggers.some(trigger => msg_lower.includes(trigger))) {
        msgEvents(msg);
    }

    if (msg_lower.startsWith('!')) {
        commands(msg);
    }
});

// Login with token
client.login(process.env.CLIENT_TOKEN);
