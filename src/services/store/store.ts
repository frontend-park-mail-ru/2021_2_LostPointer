class Store {
    private authenticated: boolean;
    private userAvatar: string;

    set(prop: string, val: any): void {
        this[prop] = val;
    }

    get(prop: string): any {
        return this[prop];
    }
}

export default new Store();
