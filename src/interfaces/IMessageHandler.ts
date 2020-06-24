import { Message } from "discord.js";

// Simple interface for handling discord messages
interface IMessageHandler {
    handle(message: Message): Promise<Message | Message[]>;
}

export { IMessageHandler }