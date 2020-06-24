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

    constructor(token: string, commandHandler: ICommandHandler) {
        this.token = token;
        this.commandHandler = commandHandler;
        this.UNKNOWN_COMMAND = "Uknown command.";
        this.MISSING_COMMAND = "Missing command.";
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
                case Commands.PLAY:
                    const url: string = result.additionalArgs;
                    this.player.play(url, message);
                    break;
                case Commands.STOP:
                    this.player.stop(message);
                    break;
                case Commands.SUMMON:
                    this.player.joinChannel(message);
                    break;

                default:
                    console.log("Command handler gave us an unknown value: ", result.command);
            }
        } else {
            result.message && message.reply(result.message);
        }
    }
}

export { Bot }