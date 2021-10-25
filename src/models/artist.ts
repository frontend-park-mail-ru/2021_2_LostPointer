import {Model} from "models/model";
import Request from "../../src/services/request/request";

export interface IArtist {
    id: number;
    name: string;
    avatar: string;
}

export class Artist extends Model<IArtist> {
    constructor(props: IArtist = null, isLoaded = false) {
        super(props, isLoaded);
    }

    static getHomepageArtists() {
        return new Promise<Artist[]>((res) => {
            Request.get('/home/artists').then((response) => {
                res(<Artist[]>response);
            });
        });
    }
}
