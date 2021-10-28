import {Model} from './model';
import Request from '../../src/services/request/request'

export interface IAlbum {
    id: number;
    title: string;
    year: number;
    artist: string;
    artwork: string;
    tracksCount: number;
    tracksDuration: number;
}

export class Album extends Model<IAlbum> {
    constructor(props: IAlbum = null) {
        super(props);
    }

    static getHomepageAlbums(): Promise<Album[]> | Promise<[]> {
        return new Promise((res) => {
            Request.get('/home/albums').then((response) => {
                res((<Album[]>response));
            })
                .catch(() => {
                    res([]);
                });
        });
    }
}
