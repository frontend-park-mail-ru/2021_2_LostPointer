import { TrackModel } from 'models/track';
import mockArtist from 'models/mocks/mockArtist';
import mockAlbum from 'models/mocks/mockAlbum';

export default new TrackModel({
    id: 0,
    title: 'Loading title...',
    artist: mockArtist,
    album: mockAlbum,
    explicit: false,
    genre: '',
    number: 0,
    file: '',
    listen_count: 0,
    duration: 0,
    lossless: false,
    cover: '',
    pos: 0,
});
