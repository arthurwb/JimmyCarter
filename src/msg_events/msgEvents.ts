import { Message, TextChannel } from 'discord.js';
import responses from '../../responses/responses.json' assert { type: 'json' };
import * as Dice from "../util/dice"

export const msgEvents = (msg: Message): void => {
    const msgLower = msg.content.toLowerCase()
    if (["peanut", "peanuts"].some(word => msgLower.includes(word))) {
        const res = responses["peanut"][Math.floor(Math.random() * (responses["peanut"].length))];
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(res)
        }
    } else if (msgLower.includes("hey jimmy")) {
        const res = responses["hey-jimmy"][Math.floor(Math.random() * (responses["hey-jimmy"].length))];
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(res)
        }
    } else if (msgLower.includes("jimmy name")) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send("My name is James Earl Carter Jr. but you can call me Jimmy")
        }
    } else {
        const yesOrNo = ["yes", "no"];
        if (msg.channel instanceof TextChannel) {
            const res = yesOrNo[Math.floor(Math.random() * 2)]
            if (Dice.dice12() == 0) {
                msg.channel.send("Every time you mention my name my soul is ripped from the embrace of our Lord and I must momentarily feel the eternal pain and suffering that exists on this mortal plane. Every moment I spend away from the heavenly Father is like a bullet ripping through my very soul.")
            } else {
                msg.channel.send(res)
            }
        }
    }
}