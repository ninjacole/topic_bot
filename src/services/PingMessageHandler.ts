import { Message } from "discord.js";
import { PingParser } from "./PingParser";
import { IMessageHandler } from "../interfaces/IMessageHandler";

class PingMessageHandler implements IMessageHandler {
    private pingParser: PingParser;

    constructor(pingFinder: PingParser) {
        this.pingParser = pingFinder;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingParser.isPing(message.content)) {
            return message.reply('pongz0rz, ' + message.author.username);
        }

        return Promise.reject();
    }
}

export { PingMessageHandler }