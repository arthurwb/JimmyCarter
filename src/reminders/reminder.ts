import { Message, TextChannel } from 'discord.js';

export function setReminder(msg: Message) {
    if (msg.channel instanceof TextChannel) {
        msg.channel.send("set")
    }
}

export function getReminder(msg: Message) {
    if (msg.channel instanceof TextChannel) {
        msg.channel.send("get")
    }
}