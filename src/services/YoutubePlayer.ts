import { VoiceConnection, Message, StreamDispatcher } from "discord.js";

const ytdl = require('ytdl-core');

class YoutubePlayer {
    private readonly INVALID_URL: string;
    private readonly STOPPED: string;
    private readonly YOUTUBE_URL_REGEX: RegExp;

    private stream: StreamDispatcher;

    constructor() {
        this.INVALID_URL = "Invalid youtube URL";
        this.STOPPED = "Stopped";

        // @author: Stephan Schmitz <eyecatchup@gmail.com>
        // @url: https://stackoverflow.com/a/10315969/624466
        this.YOUTUBE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    }

    public play = (url: string, message: Message, voiceConnection: VoiceConnection) => {
        if (this.validate(url)) {
            this.stream = voiceConnection.play(ytdl(url, { filter: 'audioonly' }));
        } else {
            message.reply(this.INVALID_URL);
        }
    }

    public stop = (message: Message, voiceConnection: VoiceConnection) => {
        this.stream && this.stream.destroy();
        message.reply(this.STOPPED);
    }

    private validate = (url: string) => {
        return (url.match(this.YOUTUBE_URL_REGEX)) ? RegExp.$1 : false;
    }
}

export { YoutubePlayer }