import axios from 'axios';
import { Message, TextChannel } from 'discord.js';

import { getWordCount } from '../util/profanityCounter';
import { getNews } from '../util/getNews';
import { getWeather } from '../util/getWeather';

export const commands = async (msg: Message): Promise<void> =>  {
    if (msg.content === '!dog') {
        axios.get('https://dog.ceo/api/breeds/image/random')
            .then(response => {
                const dogImageUrl = response.data.message;
                if (msg.channel instanceof TextChannel) {
                    msg.channel.send("Hey buddy, here's a cool dog picture I found on the internet.");
                    msg.channel.send({ files: [dogImageUrl] });
                }
            })
            .catch(error => {
                console.error('Error fetching dog image:', error);
            });
    } else if (msg.content === '!fuck') {
        const wordCount = await getWordCount(msg)
        let res = "You had said...\n"
        if (wordCount) {
            for (let word in wordCount) {
                if (wordCount.hasOwnProperty(word)) {
                    res = res + `${word}: ${wordCount[word]} times\n`
                }
            }
        }
        msg.reply(res);
    } else if (msg.content === "!news") {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(await getNews());
        }
    } else if (msg.content === "!weather") {
        if (msg.channel instanceof TextChannel) {
            const weather = await getWeather();
            let formattedWeather = "";
            weather.temps.forEach((_, index) => {
                formattedWeather = formattedWeather + `\nHours ${(index*3)-3}-${index*3}: ${weather.temps[index]} | ${weather.conditions[index]}`
            })
            msg.channel.send(formattedWeather);
        }
    }
}
