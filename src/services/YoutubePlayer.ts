import { VoiceConnection, Message, StreamDispatcher, VoiceChannel } from "discord.js";

const ytdl = require('ytdl-core');

class YoutubePlayer {
    private readonly INVALID_URL: string;
    private readonly STOPPED: string;
    private readonly YOUTUBE_URL_REGEX: RegExp;
    private readonly FAILED_TO_JOIN_CHANNEL: string;
    private readonly NOT_IN_CHANNEL: string;

    private stream: StreamDispatcher;
    private voiceConnection: VoiceConnection;

    constructor() {
        this.INVALID_URL = "Invalid youtube URL";
        this.STOPPED = "Stopped";
        this.FAILED_TO_JOIN_CHANNEL = "Failed to join channel.";
        this.NOT_IN_CHANNEL = "You're not in a voice channel.";

        // @author: Stephan Schmitz <eyecatchup@gmail.com>
        // @url: https://stackoverflow.com/a/10315969/624466
        this.YOUTUBE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    }

    public play = (url: string, message: Message) => {
        if (this.validate(url)) {
            if (!this.voiceConnection) {
                this.joinChannel(message);
            }

            this.stream = this.voiceConnection.play(ytdl(url, { filter: 'audioonly' }));
        } else {
            message.reply(this.INVALID_URL);
        }
    }

    public stop = (message: Message) => {
        this.stream && this.stream.destroy();
        message.reply(this.STOPPED);
    }

    private validate = (url: string) => {
        return (url.match(this.YOUTUBE_URL_REGEX)) ? RegExp.$1 : false;
    }

    public joinChannel = (message: Message) => {
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then((connection: VoiceConnection) => {
                this.voiceConnection = connection;
            }).catch((reason: string) => {
                message.reply(this.FAILED_TO_JOIN_CHANNEL + " : " + reason);
            })
        } else {
            message.reply(this.NOT_IN_CHANNEL);
        }
    }
}

export { YoutubePlayer }