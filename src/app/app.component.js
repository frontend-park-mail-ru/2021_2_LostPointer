import { FWComponent } from '../framework/index.js';

class AppComponent extends FWComponent {
}

export const appComponent = new AppComponent({
  selector: 'app',
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
