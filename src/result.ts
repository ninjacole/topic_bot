// Generic result class for methods
class Result {
    public success: boolean;
    public message: string;

    constructor() {
        this.message = "";
        this.success = false;
    }
}

export { Result }