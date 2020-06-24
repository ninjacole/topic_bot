import { Message } from "discord.js";
import { ICommandHandler } from "../interfaces/ICommandHandler";
import { CommandHandlerResult } from "../CommandHandlerResult";
import { Commands } from "../helpers/Commands";
import { Result } from "../Result";

// Handles messages, looking for commands
class CommandHandler implements ICommandHandler {
    private readonly UNKNOWN: string = "Unknown command";
    private readonly MISSING: string = "Missing command";
    private readonly MISSING_SONG_URL: string = "Missing song url";

    constructor() {

    }

    public handle = (message: Message): CommandHandlerResult => {
        let result: CommandHandlerResult = new CommandHandlerResult();

        if (message.author.bot) {
            result.success = false;
            result.message = "Message sent by bot";
        } else if (message.content.startsWith(Commands.PREFIX)) {
            // regex removes all the whitespace around words
            const args: string[] = message.content.slice(Commands.PREFIX.length).match(/\S+/g);

            if (args.length > 0) {
                if (args[0] === Commands.SUMMON) {
                    result.success = true;
                    result.command = Commands.SUMMON;
                } else if (args[0] === Commands.PLAY) {
                    if (args.length > 1) {
                        result.success = true;
                        result.command = Commands.PLAY;
                        result.additionalArgs = args[1];
                    } else {
                        result.success = false;
                        result.message = this.MISSING_SONG_URL;
                    }
                } else if (args[0] === Commands.STOP) {
                    result.success = true;
                    result.command = Commands.STOP;
                } else {
                    result.success = false;
                    result.message = this.UNKNOWN;
                }
            } else {
                result.success = false;
                result.message = this.MISSING;
            }
        } else {
            result.success = false;
        }

        return result;
    }
}

export { CommandHandler }