import { Model } from 'models/model';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import Request, {IResponseBody} from 'services/request/request';
import { ContentType } from 'services/request/requestUtils';

const hardcoded_playlist = "[\n" +
    "    {\n" +
    "        \"id\": 4938,\n" +
    "        \"title\": \"All I Know (feat. Future)\",\n" +
    "        \"genre\": \"R\u0026B/Soul\",\n" +
    "        \"number\": 16,\n" +
    "        \"file\": \"47fa483b-9538-42bb-ab13-a16c7a7b07e9.m4a\",\n" +
    "        \"duration\": 321,\n" +
    "        \"album\": {\n" +
    "            \"id\": 622,\n" +
    "            \"title\": \"Starboy\",\n" +
    "            \"artwork\": \"05e1ad6e-1bb8-4d6b-8d6e-0ae6853e94e1\"\n" +
    "        },\n" +
    "        \"artist\": {\n" +
    "            \"id\": 325,\n" +
    "            \"name\": \"The Weeknd\"\n" +
    "        }\n" +
    "    },\n" +
    "    {\n" +
    "        \"id\": 4736,\n" +
    "        \"title\": \"Ride (Photek Remix)\",\n" +
    "        \"genre\": \"Dance\",\n" +
    "        \"number\": 1,\n" +
    "        \"file\": \"7343c455-f133-4323-856a-80bdca3f9d4d.m4a\",\n" +
    "        \"duration\": 267,\n" +
    "        \"album\": {\n" +
    "            \"id\": 569,\n" +
    "            \"title\": \"Ride (Photek Remix) - Single\",\n" +
    "            \"artwork\": \"27e02ca7-e29d-428e-ad4d-bceac72ed10a\"\n" +
    "        },\n" +
    "        \"artist\": {\n" +
    "            \"id\": 318,\n" +
    "            \"name\": \"Lana Del Rey\"\n" +
    "        }\n" +
    "    },\n" +
    "    {\n" +
    "        \"id\": 4804,\n" +
    "        \"title\": \"Did Anyone Approach You?\",\n" +
    "        \"genre\": \"Pop\",\n" +
    "        \"number\": 32,\n" +
    "        \"file\": \"ec57e479-97d7-4ef3-bf58-92ecb510e953.m4a\",\n" +
    "        \"duration\": 249,\n" +
    "        \"album\": {\n" +
    "            \"id\": 597,\n" +
    "            \"title\": \"25: The Very Best Of (Deluxe Video Version)\",\n" +
    "            \"artwork\": \"e4e8f3d5-3766-46c2-9420-4f2dacab87e4\"\n" +
    "        },\n" +
    "        \"artist\": {\n" +
    "            \"id\": 322,\n" +
    "            \"name\": \"a-ha\"\n" +
    "        }\n" +
    "    },\n" +
    "    {\n" +
    "        \"id\": 5180,\n" +
    "        \"title\": \"Каждый раз\",\n" +
    "        \"genre\": \"Teen Pop\",\n" +
    "        \"number\": 2,\n" +
    "        \"file\": \"58601c37-63cd-4abf-b826-75478ef149ce.m4a\",\n" +
    "        \"listen_count\": 2,\n" +
    "        \"duration\": 208,\n" +
    "        \"album\": {\n" +
    "            \"id\": 641,\n" +
    "            \"title\": \"Раскраски для взрослых\",\n" +
    "            \"artwork\": \"21a774e7-b4fd-4ded-a074-bfe1482a4567\"\n" +
    "        },\n" +
    "        \"artist\": {\n" +
    "            \"id\": 333,\n" +
    "            \"name\": \"Монеточка\"\n" +
    "        }\n" +
    "    },\n" +
    "    {\n" +
    "        \"id\": 4298,\n" +
    "        \"title\": \"Grotesque (Radio Edit)\",\n" +
    "        \"genre\": \"Unknown\",\n" +
    "        \"number\": 11,\n" +
    "        \"file\": \"15537833-9ce2-4f04-a251-08db9f11c1be.m4a\",\n" +
    "        \"duration\": 216,\n" +
    "        \"album\": {\n" +
    "            \"id\": 456,\n" +
    "            \"title\": \"A State of Trance 2013\",\n" +
    "            \"artwork\": \"b308f456-9fd2-4f6b-92b1-0dbd4135624a\"\n" +
    "        },\n" +
    "        \"artist\": {\n" +
    "            \"id\": 266,\n" +
    "            \"name\": \"Armin van Buuren\"\n" +
    "        }\n" +
    "    }\n" +
    "]"

export interface IPlaylistModel {
    id: number;
    title: string;
    tracks: Array<TrackModel>;
    avatar: string,
}

export class PlaylistModel extends Model<IPlaylistModel> {
    constructor(props: IPlaylistModel = null) {
        super(props);
    }

    static getPlaylist(playlistId: string): Promise<PlaylistModel> | Promise<null> {
        return new Promise<PlaylistModel>((res) => {
            const response = JSON.parse(hardcoded_playlist);
            if (response) {
                const tracks: Array<TrackModel> = response.reduce(
                    (acc, elem, index) => {
                        elem.pos = index;
                        const artist = new ArtistModel(elem.artist);
                        const album = new AlbumModel(elem.album);
                        elem.album = album;
                        elem.artist = artist;
                        acc.push(new TrackModel(elem));
                        return acc;
                    },
                    []
                );
                res(new PlaylistModel({
                    id: parseInt(playlistId),
                    title: 'test playlist',
                    tracks: tracks,
                    avatar: '/static/playlists/default_playlist_artwork_384px.webp',
                }))
            }
        });
    }

    static getUserPlaylists(): Promise<Array<PlaylistModel>> {
        return new Promise<Array<PlaylistModel>>((res) => {
            const response = JSON.parse(hardcoded_playlist);
            if (response) {
                const tracks: Array<TrackModel> = response.reduce(
                    (acc, elem, index) => {
                        elem.pos = index;
                        const artist = new ArtistModel(elem.artist);
                        const album = new AlbumModel(elem.album);
                        elem.album = album;
                        elem.artist = artist;
                        acc.push(new TrackModel(elem));
                        return acc;
                    },
                    []
                );
                res([
                    new PlaylistModel({
                        id: 123,
                        title: 'test playlist 1',
                        tracks: tracks,
                        avatar: '/static/playlists/default_playlist_artwork_384px.webp',
                    }),
                    new PlaylistModel({
                        id: 124,
                        title: 'test playlist 2',
                        tracks: tracks,
                        avatar: '/static/playlists/default_playlist_artwork_384px.webp',
                    }),
                    ]);
            }
        });
    }

    updateInformation(formdata: FormData): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.get(
                '/csrf',
            )
                .then((csrfBody) => {
                    if (csrfBody.status === 200) {
                        const csrfToken = csrfBody.message;
                        Request.patch(
                            `/playlists/${this.getProps().id}`,
                            formdata,
                            ContentType.FORM,
                            {
                                'X-CSRF-Token': csrfToken,
                            },
                        ).then((body) => {
                            if (body.status === 200) {
                                this.props.title = String(formdata.get('title'));
                            }
                            res(body);
                        })
                    }
                })
        })
    }
}
