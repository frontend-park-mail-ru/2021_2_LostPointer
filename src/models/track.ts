import {Model} from "models/model";
import Request from "../../src/services/request/request";

export interface ITrack {
    id: number;
    title: string;
    artist: string;
    album: string;
    explicit: boolean;
    genre: string;
    number: number;
    file: string;
    listenCount: number;
    duration: number;
    lossless: boolean;
    cover: string;
}

export class Track extends Model<ITrack> {
    constructor(props: ITrack = null, isLoaded: boolean = false) {
        super(props, isLoaded);
    }

    static getHomepageTracks() {
        return Request.get('/home/tracks').then((response) => { return response; });
    }
}
