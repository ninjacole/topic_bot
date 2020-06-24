import { Bot } from "./Bot";
import { config } from './config';
import { Result } from "./Result";
import { CommandHandler } from "./services/CommandHandler";
import { ICommandHandler } from "./interfaces/ICommandHandler";

console.log('starting bot');

const commandHandler: ICommandHandler = new CommandHandler();

const bot = new Bot(config.token, commandHandler);

bot.connect().then((connectionResult: Result) => {
    if (connectionResult.success) {
        const listenResult: Result = bot.listen()
    } else {
        console.log(connectionResult.message);
    }
});
