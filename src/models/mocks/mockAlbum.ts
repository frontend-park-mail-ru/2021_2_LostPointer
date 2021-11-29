import { AlbumModel } from 'models/album';

export default new AlbumModel({
    id: 0,
    title: 'Loading album name...',
    year: 0,
    artist: 'Loading artist name...',
    artwork: 'loading',
    tracks_count: 0,
    tracks_duration: 0,
    album: false,
    tracks: null,
});
