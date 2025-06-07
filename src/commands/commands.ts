import axios from 'axios';
import { Message, TextChannel } from 'discord.js';

export const commands = (msg: Message): void =>  {

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
    }
}