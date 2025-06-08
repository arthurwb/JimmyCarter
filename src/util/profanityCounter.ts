import axios from "axios";
import { Message, TextChannel } from "discord.js";

import profanity from '../../responses/profanity.json' assert { type: 'json' };

export const checkAndLogWords = async (msg: Message, profanity: string[]): Promise<void> => {
    try {
        const res = await axios.get('http://jsonblob.com/api/jsonBlob/1381346616098873344');
        const data = res.data;

        const authorId = msg.author.id;
        const channel = msg.channel;

        if (!data.profanity[authorId]) {
            data.profanity[authorId] = {};
        }

        let shouldWarn = false;

        profanity.forEach((word: string) => {
            if (!data.profanity[authorId][word]) {
                data.profanity[authorId][word] = 0;
            }

            data.profanity[authorId][word] += 1;

            if (data.profanity[authorId][word] % 20 === 0) {
                shouldWarn = true;
            }
        });

        await axios.put('http://jsonblob.com/api/jsonBlob/1381346616098873344', data);

        if (shouldWarn) {
            if (channel instanceof TextChannel) {
                channel.send("Jimmy doesn't like it when people curse...");
            }
        }
    } catch (err) {
        console.error("Error fetching or updating profanity data:", err);
    }
};

export const getWordCount = async (msg: Message): Promise<Record<string, number> | undefined> => {
    try {
        const res = await axios.get('http://jsonblob.com/api/jsonBlob/1381346616098873344');
        const data = res.data;

        const authorId = msg.author.id;

        if (!data.profanity[authorId]) {
            data.profanity[authorId] = {};
        }

        return data.profanity[authorId];
    } catch (err) {
        console.error("Error fetching profanity data:", err);
        return undefined;
    }
}