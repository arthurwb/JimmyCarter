import axios from "axios";
import { Message, TextChannel } from "discord.js";

import profanity from '../../responses/profanity.json' with { type: 'json' };

const BLOB_URL = 'http://jsonblob.com/api/jsonBlob/1381346616098873344';

const is404 = (err: any) =>
    axios.isAxiosError(err) && err.response?.status === 404;

export const checkAndLogWords = async (msg: Message, profanity: string[]): Promise<void> => {
    let data: any;

    try {
        const res = await axios.get(BLOB_URL);
        data = res.data;
    } catch (err) {
        if (is404(err)) {
            return;
        }
        console.error("Error fetching profanity data:", err);
        return;
    }

    try {
        const authorId = msg.author.id;
        const channel = msg.channel;

        if (!data.profanity) data.profanity = {};
        if (!data.profanity[authorId]) data.profanity[authorId] = {};

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

        await axios.put(BLOB_URL, data);

        if (shouldWarn && channel instanceof TextChannel) {
            channel.send("Jimmy doesn't like it when people curse...");
        }
    } catch (err) {
        console.error("Error updating profanity data:", err);
    }
};

export const getWordCount = async (msg: Message): Promise<Record<string, number> | undefined> => {
    let data: any;

    try {
        const res = await axios.get(BLOB_URL);
        data = res.data;
    } catch (err) {
        if (is404(err)) {
            // Blob doesn't exist → skip silently
            return undefined;
        }
        console.error("Error fetching profanity data:", err);
        return undefined;
    }

    const authorId = msg.author.id;

    if (!data.profanity) data.profanity = {};
    if (!data.profanity[authorId]) data.profanity[authorId] = {};

    return data.profanity[authorId];
};
