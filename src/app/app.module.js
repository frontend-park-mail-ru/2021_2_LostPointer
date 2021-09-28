import { FWModule } from '../framework/index.js';
import { appComponent } from './app.component.js';
import { appSidebar } from './common/app.sidebar.js';
import { appPlayer } from './common/app.player.js';
import { appTopbar } from './common/app.topbar.js';
import { appTopAlbums } from './common/app.topalbums.js';
import { appSuggestedPlaylists } from './common/app.suggestedplaylists.js';
import { appSuggestedArtists } from './common/app.suggestedartists.js';
import { appFriendActivity } from './common/app.friendactivity.js';
import { appTrackList } from './common/app.tracklist.js';

class AppModule extends FWModule {
}

export const appModule = new AppModule({
  components: [
    appComponent,
    appSidebar,
    appPlayer,
    appTopbar,
    appTopAlbums,
    appSuggestedPlaylists,
    appTrackList,
    appSuggestedArtists,
    appFriendActivity,
  ],
});
