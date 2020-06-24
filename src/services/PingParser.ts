class PingParser {
    private ping: string = 'ping';

    public isPing(stringToSearch: string): boolean {
        return stringToSearch && stringToSearch.trim().toLowerCase() == this.ping;
    }
}

export { PingParser }