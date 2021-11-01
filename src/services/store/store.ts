class Store<IStore> {
    private authenticated: boolean;
    private nowPlaying: HTMLImageElement;
    private userAvatar: string;

    set(prop: string, val: any): void {
        this[prop] = val;
    }

    get(prop: string): any {
        return this[prop];
    }
}

export default new Store();
