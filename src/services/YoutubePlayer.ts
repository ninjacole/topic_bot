import { VoiceConnection, Message } from "discord.js";

const ytdl = require('ytdl-core');

class YoutubePlayer {
    constructor() {

    }

    public play = (url: string, message: Message, voiceConnection: VoiceConnection) => {
        if (this.validate(url)) {
            voiceConnection.play(ytdl(url, { filter: 'audioonly' }));
        } else {
            message.reply("Invalid youtube URL");
        }
    }

    public stop = (voiceConnection: VoiceConnection) => {
        voiceConnection.disconnect();
    }

    // JavaScript function to match (and return) the video Id 
    // of any valid Youtube Url, given as input string.
    // @author: Stephan Schmitz <eyecatchup@gmail.com>
    // @url: https://stackoverflow.com/a/10315969/624466
    private validate = (url: string) => {
        const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }
}

export { YoutubePlayer }