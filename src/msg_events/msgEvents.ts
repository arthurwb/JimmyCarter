import { Message, TextChannel } from 'discord.js';
import responses from '../../responses/responses.json' with { type: 'json' };
import profanityList from '../../responses/profanity.json' with { type: 'json' };
import * as Dice from "../util/dice"

export const msgEvents = (msg: Message): void => {
    const msgLower = msg.content.toLowerCase();

    // ---- PROFANITY CHECK ----
    const containsProfanity = profanityList.profanity.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i'); // word-boundary safe
        return regex.test(msgLower);
    });

    if (containsProfanity) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send("⚠️ TEST: Profanity detected");
        }
        return; // stop further processing
    }

    // ---- EXISTING LOGIC ----
    if (["peanut", "peanuts"].some(word => msgLower.includes(word))) {
        const res = responses["peanut"][Math.floor(Math.random() * (responses["peanut"].length))];
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(res)
        }
    } 
    else if (/hey.*jim/i.test(msgLower)) {
        const res = responses["hey-jimmy"][Math.floor(Math.random() * (responses["hey-jimmy"].length))];
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(res)
        }
    } 
    else if (/jim*name/i.test(msgLower)) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send("My name is James Earl Carter Jr. but you can call me Jimmy")
        }
    } 
    else {
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
