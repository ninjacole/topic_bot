import { Client, Message, VoiceConnection } from "discord.js"
import { Result } from "./Result";
import { ICommandHandler } from "./interfaces/ICommandHandler";
import { CommandHandlerResult } from "./CommandHandlerResult";
import { YoutubePlayer } from "./services/YoutubePlayer";
import { Commands } from "./helpers/Commands";

class Bot {
    // public for injection / unit testing
    public commandHandler: ICommandHandler;
    public client: Client = new Client();
    public player: YoutubePlayer = new YoutubePlayer();

    private readonly token: string;
    private connected: boolean = false;
    private readonly UNKNOWN_COMMAND: string;
    private readonly MISSING_COMMAND: string;
    private readonly FAILED_TO_JOIN_CHANNEL: string;
    private readonly NOT_IN_CHANNEL: string;

    private voiceConnection: VoiceConnection;

    constructor(token: string, commandHandler: ICommandHandler) {
        this.token = token;
        this.commandHandler = commandHandler;
        this.UNKNOWN_COMMAND = "Uknown command.";
        this.MISSING_COMMAND = "Missing command.";
        this.FAILED_TO_JOIN_CHANNEL = "Failed to join channel.";
        this.NOT_IN_CHANNEL = "You're not in a voice channel.";
    }

    // Connect discord client
    public connect = async (): Promise<Result> => {
        let result: Result = new Result();

        try {
            await this.client.login(this.token);
            result.message = "Logged in successfully";
            result.success = true;
            this.connected = true;
        } catch (error) {
            result.message = error;
            result.success = false;
            this.connected = false;
        }

        return result;
    }

    // Start listening to discord messages
    public listen = (): Result => {
        let result: Result = new Result();

        if (this.connected) {
            // TODO: find a way to use the ClientEvents defined in discord.js instead of magic string
            this.client.on("message", this.onMessageReceived);
            result.message = "Listening for messages";
            result.success = true;
        } else {
            result.message = "Not connected";
            result.success = false;
        }

        return result;
    }

    // received message handler
    private onMessageReceived = (message: Message) => {
        if (message.author.bot) {
            console.log('message from another bot. Ignoring');
        } else {
            console.log("received message: ", message.content);
            const commandResult: CommandHandlerResult = this.commandHandler.handle(message)
            this.onCommandHandlerResultReceieved(message, commandResult);
        }
    }

    private onCommandHandlerResultReceieved = (message: Message, result: CommandHandlerResult) => {
        if (result.success) {
            switch (result.command) {
                case Commands.MISSING:
                    message.reply(this.MISSING_COMMAND);
                    break;
                case Commands.UNKNOWN:
                    message.reply(this.UNKNOWN_COMMAND);
                    break;
                case Commands.PLAY:
                    const url: string = result.additionalArgs;
                    this.player.play(url, message, this.voiceConnection);
                    break;
                case Commands.STOP:
                    this.player.stop(this.voiceConnection);
                    break;
                case Commands.SUMMON:
                    this.joinChannel(message);
                    break;

                default:
                    console.log("Command handler gave us an unknown value: ", result.command);
            }
        }
    }

    private joinChannel = (message: Message) => {
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

export { Bot }