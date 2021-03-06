import { Message } from "discord.js";
import { CommandHandlerResult } from "../CommandHandlerResult";

// Simple interface for handling discord messages
interface ICommandHandler {
    handle(message: Message): CommandHandlerResult;
    showHelp(message: Message): void;
}

export { ICommandHandler }