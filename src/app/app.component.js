import { Component } from '../framework/core/component.js';
import { appSidebar } from './app.common/app.sidebar.js';
import { appPlayer } from './app.common/app.player.js';
import { appTopbar } from './app.common/app.topbar.js';
import { appTopAlbums } from './app.common/app.topalbums.js';
import { appSuggestedPlaylists } from './app.common/app.suggestedplaylists.js';
import { appTrackList } from './app.common/app.tracklist.js';
import { appSuggestedArtists } from './app.common/app.suggestedartists.js';
import { appFriendActivity } from './app.common/app.friendactivity.js';

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.template = `
<div class="app__content">
    {{#render sidebar}}{{/render}}
    <div class="main-layout">
        {{#render topbar}}{{/render}}
        <div class="main-layout__content">
            <div class="listen-now">
                {{#render top_albums}}{{/render}}
                <div class="listen-now__suggested-content">
                    {{#render suggested_playlists}}{{/render}}
                    {{#render track_list}}{{/render}}
                    {{#render suggested_artists}}{{/render}}
                </div>
            </div>
            {{#render friend_activity}}{{/render}}
        </div>
    </div>
</div>
{{#render player}}{{/render}}
  `;
    this.data = {
      sidebar: appSidebar,
      topbar: appTopbar,
      top_albums: appTopAlbums,
      suggested_playlists: appSuggestedPlaylists,
      track_list: appTrackList,
      suggested_artists: appSuggestedArtists,
      friend_activity: appFriendActivity,
      player: appPlayer,
    };
  }
}
