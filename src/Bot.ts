import { Client, Message } from "discord.js"
import { Result } from "./Result";
import { IMessageHandler } from "./interfaces/IMessageHandler";

class Bot {
    // public for injection / unit testing
    public messageHandler: IMessageHandler;
    public client: Client = new Client();

    private readonly token: string;
    private connected: boolean = false;

    constructor(token: string, messageHandler: IMessageHandler) {
        this.token = token;
        this.messageHandler = messageHandler;
    }

    // Connect discord client
    public connect = (): Result => {
        let result: Result = new Result();

        this.client.login(this.token).then(() => {
            result.message = "Logged in successfully";
            result.success = true;
        }).catch((error) => {
            result.message = error;
            result.success = false;
        });

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
            this.messageHandler.handle(message).then(this.onMessageHandlerSucceeded).catch(this.onMessageHandlerFailed);
        }
    }

    // callback for handler success
    private onMessageHandlerSucceeded = () => {
        console.log('handled successfully');
    }

    // callback for handler fail
    private onMessageHandlerFailed = () => {
        console.log('handler failed');
    }
}

export { Bot }