import { Bot } from "./Bot";
import { PingMessageHandler } from "./services/PingMessageHandler";
import { PingParser } from "./services/PingParser";
import { config } from './config';
import { Result } from "./Result";

console.log('starting bot');

const messageHandler = new PingMessageHandler(new PingParser());
const bot = new Bot(config.token, messageHandler);

bot.connect().then((connectionResult: Result) => {
    if (connectionResult.success) {
        const listenResult: Result = bot.listen()
    } else {
        console.log(connectionResult.message);
    }
});
