import axios from 'axios';
import { Message, TextChannel } from 'discord.js';

import { getWordCount } from '../util/profanityCounter';

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
    }
}