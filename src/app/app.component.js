import { FWComponent } from '../framework/index.js';
import { appSidebar } from './app.common/app.sidebar.js';
import { appPlayer } from './app.common/app.player.js';
import { appTopbar } from './app.common/app.topbar.js';
import { appTopAlbums } from './app.common/app.topalbums.js';
import { appSuggestedPlaylists } from './app.common/app.suggestedplaylists.js';
import { appTrackList } from './app.common/app.tracklist.js';
import { appSuggestedArtists } from './app.common/app.suggestedartists.js';
import { appFriendActivity } from './app.common/app.friendactivity.js';

class AppComponent extends FWComponent {
}

export const appComponent = new AppComponent({
  selector: 'app',
  components: [
    appSidebar,
    appPlayer,
    appTopbar,
    appTopAlbums,
    appSuggestedPlaylists,
    appTrackList,
    appSuggestedArtists,
    appFriendActivity,
  ],
  template: `
<div class="app__content">
    <div class="sidebar"></div>
    <div class="main-layout">
        <div class="topbar"></div>
        <div class="main-layout__content">
            <div class="listen-now">
                <div class="listen-now__top-albums"></div>
                <div class="listen-now__suggested-content">
                    <div class="suggested-playlists"></div>
                    <div class="track-list"></div>
                    <div class="suggested-artists"></div>
                </div>
            </div>
            <div class="friend-activity"></div>
        </div>
    </div>
</div>
<div class="player"></div>
  `,
});
