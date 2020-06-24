import { Result } from "./Result";

class CommandHandlerResult extends Result {
    public command: string;
    public additionalArgs: string;

    constructor() {
        super();
    }
}

export { CommandHandlerResult }