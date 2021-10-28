import { Model } from 'models/model';
import Request from '../../src/services/request/request';

export interface IArtistModel {
    id: number;
    name: string;
    avatar: string;
}

export class ArtistModel extends Model<IArtistModel> {
    constructor(props: IArtistModel = null) {
        super(props);
    }

    static getHomepageArtists(): Promise<ArtistModel[]> | Promise<[]> {
        return new Promise<ArtistModel[]>((res) => {
            Request.get('/home/artists')
                .then((response) => {
                    const artists: Array<ArtistModel> = response.reduce(
                        (acc, elem) => {
                            acc.push(new ArtistModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(artists);
                })
                .catch(() => {
                    res([]);
                });
        });
    }
}
