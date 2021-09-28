import Request from '../../appApi/request.js';

class DashboardView {
  constructor() {
    this.title = 'Sign in';
    this.html = `
<div class="app__content">
        <div class="sidebar">
            <img class="sidebar__logo" data-link href="/" src="/src/static/img/sidebar_logo.png">
            <object class="sidebar__icon" data="/src/static/img/home.svg"></object>
            <object class="sidebar__icon" data="/src/static/img/explore.svg"></object>
            <object class="sidebar__icon" data="/src/static/img/favorite.svg"></object>
            <object class="sidebar__icon" data="/src/static/img/more.svg"></object>
        </div>
        <div class="main-layout">
            <div class="topbar">
                <span class="topbar__search"></span>
                <span class="topbar-icons">
                  <img class="topbar-icon" src="/src/static/img/notifications-none.svg">
                  <img class="topbar-icon" src="/src/static/img/settings.svg">
                  </span>
                <img class="topbar-profile" href="/" data-link src="/src/static/img/ava.png">
            </div>
            <div class="main-layout__content">
                <div class="listen-now">
                    <div class="listen-now__top-albums">
                        <img class="top-album" src="/src/static/img/id.jpeg"/>
                        <img class="top-album" src="/src/static/img/albina.jpeg"/>
                        <img class="top-album" src="/src/static/img/starboy.jpg"/>
                        <img class="top-album" src="/src/static/img/yur.jpg"/>
                    </div>
                    <div class="listen-now__suggested-content">
                        <div class="suggested-playlists">
                            <div class="suggested-playlists__header">Your Playlists</div>
                            <div class="suggested-playlists__container">
                                <div class="suggested-playlist">
                                    <img class="suggested-playlist-artwork" src="/src/static/img/yur.jpg">
                                    <div class="suggested-playlist-name">Jail Mix</div>
                                </div>
                                <div class="suggested-playlist">
                                    <img class="suggested-playlist-artwork" src="/src/static/img/albina.jpeg">
                                    <div class="suggested-playlist-name">Resine Working Mix Extended</div>
                                </div>
                                <div class="suggested-playlist">
                                    <img class="suggested-playlist-artwork" src="/src/static/img/starboy.jpg">
                                    <div class="suggested-playlist-name">Workout Mix 2</div>
                                </div>
                            </div>
                        </div>
                        <div class="track-list">
                            <div class="suggested-tracks__header">Tracks of the Week</div>
                            <div class="suggested-tracks-container">
                                <div class="track-list-item">
                                    <img class="track-list-item__artwork" src="/src/static/img/saptded.webp">
                                    <div class="track-list-item__name-container">
                                        <div class="track-list-item__name">Песня про кабанчик и стаканчик и прочие приколы</div>
                                        <div class="track-list-item__artist">Saptded</div>
                                    </div>
                                    <div class="track-list-item__ellipsis">
                                        <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                                        <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
                                    </div>
                                </div>
                                <div class="track-list-item">
                                    <img class="track-list-item__artwork" src="/src/static/img/saptded.webp">
                                    <div class="track-list-item__name-container">
                                        <div class="track-list-item__name">Песня про кабанчик и стаканчик и прочие приколы</div>
                                        <div class="track-list-item__artist">Saptded</div>
                                    </div>
                                    <div class="track-list-item__ellipsis">
                                        <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                                        <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
                                    </div>
                                </div>
                                <div class="track-list-item">
                                    <img class="track-list-item__artwork" src="/src/static/img/saptded.webp">
                                    <div class="track-list-item__name-container">
                                        <div class="track-list-item__name">Песня про кабанчик и стаканчик и прочие приколы</div>
                                        <div class="track-list-item__artist">Saptded</div>
                                    </div>
                                    <div class="track-list-item__ellipsis">
                                        <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                                        <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
                                    </div>
                                </div>
                                <div class="track-list-item">
                                    <img class="track-list-item__artwork" src="/src/static/img/saptded.webp">
                                    <div class="track-list-item__name-container">
                                        <div class="track-list-item__name">Песня про кабанчик и стаканчик и прочие приколы</div>
                                        <div class="track-list-item__artist">Saptded</div>
                                    </div>
                                    <div class="track-list-item__ellipsis">
                                        <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                                        <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
                                    </div>
                                </div>
                                <div class="track-list-item">
                                    <img class="track-list-item__artwork" src="/src/static/img/saptded.webp">
                                    <div class="track-list-item__name-container">
                                        <div class="track-list-item__name">Песня про кабанчик и стаканчик и прочие приколы</div>
                                        <div class="track-list-item__artist">Saptded</div>
                                    </div>
                                    <div class="track-list-item__ellipsis">
                                        <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                                        <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="suggested-artists">
                            <div class="suggested-artists__header">Top Artists</div>
                            <div class="suggested-artists__container">
                                <img class="suggested-artist" src="/src/static/img/starboy.jpg">
                                <img class="suggested-artist" src="/src/static/img/albina.jpeg">
                                <img class="suggested-artist"  src="/src/static/img/yur.jpg">
                                <img class="suggested-artist" src="/src/static/img/id.jpeg">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="friend-activity">
                    <div class="friend-activity__header">
                        <span class="friend-activity__header-text">Friends Activity</span>
                        <img class="friend-activity__header-img" src="/src/static/img/more_friends.svg" alt="">
                    </div>
                    <div class="friends-container">
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/saptded.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">Saptded</div>
                                <div class="listening-to">ТЁЛКА-дрейн</div>
                            </div>
                        </div>
                        <div class="friend">
                            <img class="friend-avatar" src="/src/static/img/vershov.webp">
                            <div class="friend-info-container">
                                <div class="friend-nickname">VErshovBMSTU</div>
                                <div class="listening-to">Чёрные Глаза</div>
                            </div>
                        </div>
                    </div>
                    <div class="more-friends">
                        <div class="view-all-text">View All</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="player">
        <img class="player-artwork" src="/src/static/img/albina.jpeg"/>
        <div class="now-playing">
            <div class="track-name">Megalovania</div>
            <div class="artist-name">Toby Fox</div>
        </div>
        <div class="player-controls">
        <img src="/src/static/img/skip.svg" class="player-skip-left">
        <img src="/src/static/img/play.svg" class="player-play">
        <img src="/src/static/img/skip.svg" class="player-skip-right">
        </div>
        <div class="player__time">0:00</div>
        <div class="player__seekbar"></div>
        <div class="player__time">03:30</div>
        <img class="shuffle" src="/src/static/img/shuffle.svg">
        <img class="repeat" src="/src/static/img/repeat.svg">
        <div class="player__seekbar player-volume"></div>
        <img class="player__volume-icon" src="/src/static/img/volume.svg">
    </div>
`;
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => {
        if (status !== 200) {
          const button = document.querySelector('.topbar-profile');
          button.href = '/signin';
          button.src = '/src/static/img/enter.png';
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => { console.log(error.msg); });
  }
}

export default DashboardView;
