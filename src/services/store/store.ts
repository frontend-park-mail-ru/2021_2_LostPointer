import { Component } from 'components/Component/component';

class Store {
    private authenticated: boolean;
    private nowPlaying: HTMLImageElement;
    private userAvatar: string;
    private playingView: Component<never>;

    set(prop: string, val: any): void {
        this[prop] = val;
    }

    get(prop: string): any {
        return this[prop];
    }
}

export default new Store();
